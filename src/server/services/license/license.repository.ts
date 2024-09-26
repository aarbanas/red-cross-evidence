import { db } from "~/server/db";
import { licenses } from "~/server/db/schema";
import { FindLicenseQuery } from "./types";
import { TRPCError } from "@trpc/server";
import { and, asc, count, desc, eq, ilike, type SQL } from "drizzle-orm";
enum SortableKeys {
  ID = "id",
  TYPE = "type",
  NAME = "name",
  DESCRIPTION = "description",
}
enum FilterableKeys {
  TYPE = "type",
  NAME = "name",
  DESCRIPTION = "description",
}
type FindLicenseReturnDTO = {
  id: string;
  type: string;
  name: string;
  description: string | null;
};
const mapKeyToColumn = (key: SortableKeys | FilterableKeys) => {
  switch (key) {
    case SortableKeys.ID:
      return licenses.id;
    case SortableKeys.TYPE:
      return licenses.type;
    case SortableKeys.NAME:
      return licenses.name;
    case SortableKeys.DESCRIPTION:
      return licenses.description;
    default:
      return licenses.id;
  }
};
const generateSortFunction = (
  key?: SortableKeys | string,
  value?: string,
): SQL => {
  if (
    value &&
    Object.keys(SortableKeys).findIndex((sortableKey) => sortableKey === key) >
      -1
  ) {
    if (!["asc", "desc"].includes(value)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid sort direction",
      });
    }

    return value === "asc"
      ? asc(mapKeyToColumn(key as SortableKeys))
      : desc(mapKeyToColumn(key as SortableKeys));
  }

  // If there is no 'value' or key is not a member of SortableKeys
  return asc(licenses.name);
};
const prepareOrderBy = (sort?: string | string[]): SQL[] => {
  if (!sort) {
    return [asc(licenses.type)];
  }

  if (typeof sort === "string") {
    const [key, value] = sort.split(":");

    return [generateSortFunction(key, value)];
  }

  const sorts = [];
  for (const _sort of sort) {
    const [key, value] = _sort.split(":");
    const sortValue = generateSortFunction(key, value);
    if (sortValue) {
      sorts.push(sortValue);
    }
  }

  return sorts;
};
const mapFilterableKeyToConditional = (
  key: FilterableKeys,
  value: string,
): SQL | undefined => {
  if (key === FilterableKeys.DESCRIPTION || key)
    return ilike(mapKeyToColumn(key), `${value}%`);

  if (key === FilterableKeys.TYPE || key === FilterableKeys.NAME)
    return eq(mapKeyToColumn(key as FilterableKeys), value);

  return undefined;
};
const prepareWhere = (
  filter: Record<string, string> | undefined,
): SQL | undefined => {
  if (!filter) return undefined;

  if (Object.keys(filter).length === 1) {
    const [key, value] = Object.entries(filter)[0] ?? ["", ""];
    if (!Object.values(FilterableKeys).includes(key as FilterableKeys)) {
      return undefined;
    }

    return mapFilterableKeyToConditional(key as FilterableKeys, value);
  }

  const conditionals = [];
  for (const [key, value] of Object.entries(filter)) {
    if (!Object.values(FilterableKeys).includes(key as FilterableKeys)) {
      continue;
    }

    conditionals.push(
      mapFilterableKeyToConditional(key as FilterableKeys, value),
    );
  }

  return and(...conditionals);
};
const licenseRepository = {
  find: async (data: FindLicenseQuery) => {
    const { page, limit, sort, filter } = data;
    const orderBy = prepareOrderBy(sort);
    const where = prepareWhere(filter);

    const { totalCount, returnData } = await db.transaction(
      async (
        tx,
      ): Promise<{
        totalCount: number;
        returnData: FindLicenseReturnDTO[];
      }> => {
        const [totalCount] = await tx
          .select({ count: count() })
          .from(licenses)
          //.leftJoin(profiles, eq(users.id, profiles.userId))
          .where(where);

        const returnData = await tx
          .select({
            id: licenses.id,
            type: licenses.type,
            name: licenses.name,
            description: licenses.description,
            /*
            profile: {
              id: profiles.id,
              firstName: profiles.firstName,
              lastName: profiles.lastName,
            },*/
          })
          .from(licenses)
          //.leftJoin(profiles, eq(users.id, profiles.userId))
          .where(where)
          .orderBy(...orderBy)
          .limit(limit ?? 10)
          .offset(page ? Number(page) * (limit ?? 10) : 0);

        return { totalCount: totalCount?.count ?? 0, returnData };
      },
    );

    return {
      data: returnData,
      meta: {
        count: totalCount,
        limit: limit ?? 10,
      },
    };
  },
  findById: async (id: string) => {
    return (
      db
        .select({
          id: licenses.id,
          type: licenses.type,
          name: licenses.name,
          description: licenses.description,
          /*profile: {
          id: profiles.id,
          firstName: profiles.firstName,
          lastName: profiles.lastName,
        },*/
        })
        .from(licenses)
        .where(eq(licenses.id, id))
        //.leftJoin(profiles, eq(users.id, profiles.userId))
        .execute()
    );
  },
};
export default licenseRepository;

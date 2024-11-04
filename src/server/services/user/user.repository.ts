import { db } from "~/server/db";
import {
  addresses,
  cities,
  profiles,
  profilesAddresses,
  users,
} from "~/server/db/schema";
import { and, asc, count, desc, eq, ilike, type SQL } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { type FindUserQuery } from "~/server/services/user/types";

export type FindUserReturnDTO = {
  id: string;
  email: string;
  active: boolean | null;
  createdAt: Date;
  profile: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
};

enum SortableKeys {
  ID = "id",
  FIRSTNAME = "firstname",
  LASTNAME = "lastname",
  EMAIL = "email",
  CITY = "city",
  COUNTRY = "country",
  ACTIVE = "active",
}

enum FilterableKeys {
  FIRSTNAME = "firstname",
  LASTNAME = "lastname",
  EMAIL = "email",
  CITY = "city",
}

const mapFilterableKeyToConditional = (
  key: FilterableKeys,
  value: string,
): SQL | undefined => {
  if (key === FilterableKeys.FIRSTNAME || key === FilterableKeys.LASTNAME)
    return ilike(mapKeyToColumn(key as FilterableKeys), `${value}%`);

  if (
    key === FilterableKeys.EMAIL ||
    (key === FilterableKeys.CITY && value != "")
  )
    return eq(mapKeyToColumn(key as FilterableKeys), value);

  return undefined;
};

const mapKeyToColumn = (key: SortableKeys | FilterableKeys) => {
  switch (key) {
    case SortableKeys.ID:
      return users.id;
    case SortableKeys.FIRSTNAME:
      return profiles.firstName;
    case SortableKeys.LASTNAME:
      return profiles.lastName;
    case SortableKeys.EMAIL:
      return users.email;
    case SortableKeys.ACTIVE:
      return users.active;
    case SortableKeys.CITY:
      return cities.name;
    default:
      return users.id;
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
  return asc(users.createdAt);
};

const prepareOrderBy = (sort?: string | string[]): SQL[] => {
  if (!sort) {
    return [asc(users.createdAt)];
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

const userRepository = {
  find: async (data: FindUserQuery) => {
    const { page, limit, sort, filter } = data;
    const orderBy = prepareOrderBy(sort);
    const where = prepareWhere(filter);

    const { totalCount, returnData } = await db.transaction(
      async (
        tx,
      ): Promise<{
        totalCount: number;
        returnData: FindUserReturnDTO[];
      }> => {
        const [totalCount] = await tx
          .select({ count: count() })
          .from(users)
          .leftJoin(profiles, eq(users.id, profiles.userId))
          .leftJoin(
            profilesAddresses,
            and(
              eq(profiles.id, profilesAddresses.profileId),
              eq(profilesAddresses.isPrimary, true),
            ),
          )
          .leftJoin(addresses, eq(profilesAddresses.addressId, addresses.id))
          .leftJoin(cities, eq(addresses.cityId, cities.id))
          .where(where);

        const returnData = await tx
          .select({
            id: users.id,
            email: users.email,
            active: users.active,
            createdAt: users.createdAt,
            profile: {
              id: profiles.id,
              firstName: profiles.firstName,
              lastName: profiles.lastName,
            },
          })
          .from(users)
          .leftJoin(profiles, eq(users.id, profiles.userId))
          .leftJoin(
            profilesAddresses,
            and(
              eq(profiles.id, profilesAddresses.profileId),
              eq(profilesAddresses.isPrimary, true),
            ),
          )
          .leftJoin(addresses, eq(profilesAddresses.addressId, addresses.id)) // Corrected join condition
          .leftJoin(cities, eq(addresses.cityId, cities.id))
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
    return db
      .select({
        id: users.id,
        email: users.email,
        active: users.active,
        profile: {
          id: profiles.id,
          firstName: profiles.firstName,
          lastName: profiles.lastName,
        },
      })
      .from(users)
      .where(eq(users.id, id))
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .execute();
  },
};

export default userRepository;

import { db } from "~/server/db";
import { licenses } from "~/server/db/schema";
import { count, eq, ilike, type SQL } from "drizzle-orm";
import { prepareOrderBy, prepareWhere } from "~/server/db/utility";
import type { FindQueryDTO, FindReturnDTO } from "~/server/db/utility/types";

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

export type FindLicenseReturnDTO = {
  id: string;
  type: string;
  name: string;
  description: string | null;
};

const mapKeyToColumn = (key?: string) => {
  switch (key as SortableKeys) {
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

const mapFilterableKeyToConditional = (
  key: string,
  value: string,
): SQL | undefined => {
  if (key === FilterableKeys.DESCRIPTION.valueOf())
    return ilike(mapKeyToColumn(key), `${value}%`);

  if (
    key === FilterableKeys.TYPE.valueOf() ||
    key === FilterableKeys.NAME.valueOf()
  )
    return eq(mapKeyToColumn(key), value);

  return undefined;
};

const licenseRepository = {
  find: async (data: FindQueryDTO) => {
    const { page, limit, sort, filter } = data;
    const orderBy = prepareOrderBy(
      mapKeyToColumn,
      SortableKeys,
      licenses.name,
      sort,
    );
    const where = prepareWhere(
      filter,
      FilterableKeys,
      mapFilterableKeyToConditional,
    );

    const { totalCount, returnData } = await db.transaction(
      async (tx): Promise<FindReturnDTO<FindLicenseReturnDTO>> => {
        const [totalCount] = await tx
          .select({ count: count() })
          .from(licenses)
          .where(where);

        const returnData = await tx
          .select({
            id: licenses.id,
            type: licenses.type,
            name: licenses.name,
            description: licenses.description,
          })
          .from(licenses)
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
        id: licenses.id,
        type: licenses.type,
        name: licenses.name,
        description: licenses.description,
      })
      .from(licenses)
      .where(eq(licenses.id, id))
      .execute();
  },
  findUniqueTypes: async () => {
    return db
      .selectDistinct({
        type: licenses.type,
      })
      .from(licenses)
      .orderBy(licenses.type)
      .execute();
  },
};

export default licenseRepository;

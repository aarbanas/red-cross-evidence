import { educations } from "~/server/db/schema";
import { db } from "~/server/db";
import { asc, count, eq, ilike, type SQL } from "drizzle-orm";
import type { FindQueryDTO, FindReturnDTO } from "~/server/db/utility/types";
import { prepareOrderBy, prepareWhere } from "~/server/db/utility";

enum SortableKeys {
  ID = "id",
  TYPE = "type",
  TITLE = "title",
  DESCRIPTION = "description",
}

enum FilterableKeys {
  TYPE = "type",
  NAME = "name",
  DESCRIPTION = "description",
}

export type FindEducationReturnDTO = {
  id: string;
  type: string;
  title: string;
  description: string | null;
};

const mapKeyToColumn = (key: string | undefined) => {
  switch (key as SortableKeys) {
    case SortableKeys.ID:
      return educations.id;
    case SortableKeys.TYPE:
      return educations.type;
    case SortableKeys.TITLE:
      return educations.title;
    case SortableKeys.DESCRIPTION:
      return educations.description;
    default:
      return educations.id;
  }
};

const mapFilterableKeyToConditional = (
  key: string,
  value: string,
): SQL | undefined => {
  const _key = key as FilterableKeys;
  if (_key === FilterableKeys.DESCRIPTION || _key)
    return ilike(mapKeyToColumn(_key), `${value}%`);

  if (_key === FilterableKeys.TYPE || _key === FilterableKeys.NAME)
    return eq(mapKeyToColumn(_key), value);

  return undefined;
};

const educationRepository = {
  find: async (data: FindQueryDTO) => {
    const { page, limit, sort, filter } = data;
    const orderBy = prepareOrderBy(
      mapKeyToColumn,
      SortableKeys,
      educations.title,
      sort,
    );
    const where = prepareWhere(
      filter,
      FilterableKeys,
      mapFilterableKeyToConditional,
    );

    const { totalCount, returnData } = await db.transaction(
      async (tx): Promise<FindReturnDTO<FindEducationReturnDTO>> => {
        const [totalCount] = await tx
          .select({ count: count() })
          .from(educations)
          .where(where);

        const returnData = await tx
          .select({
            id: educations.id,
            type: educations.type,
            title: educations.title,
            description: educations.description,
          })
          .from(educations)
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
        type: educations.type,
        title: educations.title,
        description: educations.description,
        precondition: educations.precondition,
        duration: educations.duration,
        lecturers: educations.lecturers,
        courseDuration: educations.courseDuration,
        renewalDuration: educations.renewalDuration,
        topics: educations.topics,
      })
      .from(educations)
      .where(eq(educations.id, id))
      .execute();
  },
  findUniqueTypes: async () => {
    return db
      .selectDistinct({ type: educations.type })
      .from(educations)
      .orderBy(asc(educations.type))
      .execute();
  },
};

export default educationRepository;

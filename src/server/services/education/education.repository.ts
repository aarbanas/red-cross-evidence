import { educations } from "~/server/db/schema";
import { db } from "~/server/db";
import { asc, count, eq, ilike, type SQL } from "drizzle-orm";
import type { FindQueryDTO, FindReturnDTO } from "~/server/db/utility/types";
import { prepareOrderBy, prepareWhere } from "~/server/db/utility";
import { EducationFormData } from "~/app/(pages)/educations/[id]/_components/EducationsForm";

enum SortableKeys {
  TYPE = "type",
  TITLE = "title",
}

enum FilterableKeys {
  TYPE = "type",
  TITLE = "title",
}

export type FindEducationReturnDTO = {
  id: string;
  type: string;
  title: string;
  description: string | null;
};

const mapKeyToColumn = (key: string | undefined) => {
  switch (key as SortableKeys) {
    case SortableKeys.TYPE:
      return educations.type;
    case SortableKeys.TITLE:
      return educations.title;
    default:
      return educations.id;
  }
};

const mapFilterableKeyToConditional = (
  key: string,
  value: string,
): SQL | undefined => {
  if (key === FilterableKeys.TITLE.valueOf())
    return ilike(mapKeyToColumn(key), `%${value}%`);

  if (value != "" && key === FilterableKeys.TYPE.valueOf())
    return eq(mapKeyToColumn(key), value);

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
  deleteById: async (id: string) => {
    return db.delete(educations).where(eq(educations.id, id)).execute();
  },
  create: async (data: EducationFormData) => {
    const {
      type,
      title,
      description,
      precondition,
      duration,
      lecturers,
      courseDuration,
      renewalDuration,
      topics,
    } = data;

    return db
      .insert(educations)
      .values({
        type,
        title,
        description,
        precondition,
        duration,
        lecturers,
        courseDuration,
        renewalDuration,
        topics,
      })
      .returning({
        id: educations.id,
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
      .execute();
  },
  update: async (data: EducationFormData) => {
    const {
      id,
      type,
      title,
      description,
      precondition,
      duration,
      lecturers,
      courseDuration,
      renewalDuration,
      topics,
    } = data;

    return db
      .update(educations)
      .set({
        type,
        title,
        description,
        precondition,
        duration,
        lecturers,
        courseDuration,
        renewalDuration,
        topics,
      })
      .where(eq(educations.id, id!))
      .returning({
        id: educations.id,
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
      .execute();
  },
};

export default educationRepository;

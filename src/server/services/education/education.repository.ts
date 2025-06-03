import {
  educations,
  educationTerms,
  type EducationType,
} from "~/server/db/schema";
import { db } from "~/server/db";
import { asc, count, eq, gte, ilike, lte, type SQL } from "drizzle-orm";
import type {
  FindQueryDTO,
  FindReturn,
  FindReturnDTO,
} from "~/server/db/utility/types";
import { prepareOrderBy, prepareWhere } from "~/server/db/utility";
import { type EducationFormData } from "~/app/(pages)/educations/list/[id]/_components/EducationsForm";
import { type EducationTermFormData } from "~/app/(pages)/educations/term/_components/EducationsTermForm";

enum ListSortableKeys {
  TYPE = "type",
  TITLE = "title",
}

enum TermSortableKeys {
  EDUCATION_ID = "educationId",
  TITLE = "title",
  DATE_FROM = "dateFrom",
  DATE_TO = "dateTo",
}

enum ListFilterableKeys {
  TYPE = "type",
  TITLE = "title",
}

enum TermFilterableKeys {
  EDUCATION_ID = "educationId",
  TITLE = "title",
  DATE_FROM = "dateFrom",
  DATE_TO = "dateTo",
}

export type FindEducationListReturnDTO = {
  id: string;
  type: string;
  title: string;
  description: string | null;
};

export type FindEducationTermReturnDTO = {
  id: string;
  title: string;
  dateFrom: Date;
  dateTo: Date;
  maxParticipants: number;
  location: string;
  education: {
    id: string;
    title: string;
  } | null;
};

const listMapKeyToColumn = (key: string | undefined) => {
  switch (key as ListSortableKeys) {
    case ListSortableKeys.TYPE:
      return educations.type;
    case ListSortableKeys.TITLE:
      return educations.title;
    default:
      return educations.id;
  }
};

const termMapKeyToColumn = (key: string | undefined) => {
  switch (key as TermSortableKeys) {
    case TermSortableKeys.EDUCATION_ID:
      return educationTerms.educationId;
    case TermSortableKeys.TITLE:
      return educationTerms.title;
    case TermSortableKeys.DATE_FROM:
      return educationTerms.dateFrom;
    case TermSortableKeys.DATE_TO:
      return educationTerms.dateTo;
    default:
      return educationTerms.id;
  }
};

const listMapFilterableKeyToConditional = (
  key: string,
  value: string,
): SQL | undefined => {
  if (key === ListFilterableKeys.TITLE.valueOf())
    return ilike(listMapKeyToColumn(key), `%${value}%`);

  if (key === ListFilterableKeys.TYPE.valueOf() && value)
    return eq(listMapKeyToColumn(key), value);

  return undefined;
};

const termMapFilterableKeyToConditional = (
  key: string,
  value: string,
): SQL | undefined => {
  if (key === TermFilterableKeys.TITLE.valueOf()) {
    return ilike(termMapKeyToColumn(key), `%${value}%`);
  }

  if (key === TermFilterableKeys.EDUCATION_ID.valueOf() && value) {
    return eq(termMapKeyToColumn(key), value);
  }

  if (
    (key === TermFilterableKeys.DATE_FROM.valueOf() ||
      key === TermFilterableKeys.DATE_TO.valueOf()) &&
    value
  ) {
    return gte(termMapKeyToColumn(key), new Date(value));
  }

  return undefined;
};

const educationRepository = {
  list: {
    find: async (
      data: FindQueryDTO,
    ): Promise<FindReturn<FindEducationListReturnDTO>> => {
      const { page, limit, sort, filter } = data;
      const orderBy = prepareOrderBy(
        listMapKeyToColumn,
        ListSortableKeys,
        educations.title,
        sort,
      );
      const where = prepareWhere(
        filter,
        ListFilterableKeys,
        listMapFilterableKeyToConditional,
      );

      const { totalCount, returnData } = await db.transaction(
        async (tx): Promise<FindReturnDTO<FindEducationListReturnDTO>> => {
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
    getAllTitles: async (type?: EducationType) => {
      return db
        .select({
          id: educations.id,
          title: educations.title,
          type: educations.type,
        })
        .from(educations)
        .where(type ? eq(educations.type, type) : undefined)
        .orderBy(asc(educations.title))
        .execute();
    },
  },
  term: {
    find: async (
      data: FindQueryDTO,
    ): Promise<FindReturn<FindEducationTermReturnDTO>> => {
      const { page, limit, sort, filter } = data;
      const orderBy = prepareOrderBy(
        termMapKeyToColumn,
        TermSortableKeys,
        educationTerms.dateFrom,
        sort,
      );
      const where = prepareWhere(
        filter,
        TermFilterableKeys,
        termMapFilterableKeyToConditional,
      );

      const { totalCount, returnData } = await db.transaction(
        async (tx): Promise<FindReturnDTO<FindEducationTermReturnDTO>> => {
          const [totalCount] = await tx
            .select({ count: count() })
            .from(educationTerms)
            .where(where);

          const returnData = await tx
            .select({
              id: educationTerms.id,
              title: educationTerms.title,
              dateFrom: educationTerms.dateFrom,
              dateTo: educationTerms.dateTo,
              maxParticipants: educationTerms.maxParticipants,
              location: educationTerms.location,
              education: {
                id: educations.id,
                title: educations.title,
              },
            })
            .from(educationTerms)
            .where(where)
            .leftJoin(educations, eq(educationTerms.educationId, educations.id))
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
          title: educationTerms.title,
          dateFrom: educationTerms.dateFrom,
          dateTo: educationTerms.dateTo,
          maxParticipants: educationTerms.maxParticipants,
          location: educationTerms.location,
          lecturers: educationTerms.lecturers,
          education: {
            id: educations.id,
            title: educations.title,
          },
        })
        .from(educationTerms)
        .where(eq(educationTerms.id, id))
        .leftJoin(educations, eq(educationTerms.educationId, educations.id))
        .execute();
    },
    deleteById: async (id: string) => {
      return db
        .delete(educationTerms)
        .where(eq(educationTerms.id, id))
        .execute();
    },
    create: async (data: EducationTermFormData) => {
      const {
        title,
        dateFrom,
        dateTo,
        maxParticipants,
        location,
        educationId,
        lecturers,
      } = data;

      return db
        .insert(educationTerms)
        .values({
          title,
          educationId,
          maxParticipants,
          location,
          lecturers,
          dateFrom: new Date(dateFrom),
          dateTo: new Date(dateTo),
        })
        .returning({
          id: educationTerms.id,
          title: educationTerms.title,
          dateFrom: educationTerms.dateFrom,
          dateTo: educationTerms.dateTo,
          maxParticipants: educationTerms.maxParticipants,
          location: educationTerms.location,
          lecturers: educationTerms.lecturers,
          educationId: educationTerms.educationId,
        })
        .execute();
    },
    update: async (data: EducationTermFormData) => {
      const {
        id,
        title,
        dateFrom,
        dateTo,
        maxParticipants,
        location,
        educationId,
        lecturers,
      } = data;

      if (!id) {
        throw new Error("Id is required for updating education term");
      }

      return db
        .update(educationTerms)
        .set({
          title,
          dateFrom: new Date(dateFrom),
          dateTo: new Date(dateTo),
          maxParticipants,
          location,
          lecturers,
          educationId,
        })
        .where(eq(educationTerms.id, id))
        .returning({
          id: educationTerms.id,
          title: educationTerms.title,
          dateFrom: educationTerms.dateFrom,
          dateTo: educationTerms.dateTo,
          maxParticipants: educationTerms.maxParticipants,
          location: educationTerms.location,
          lecturers: educationTerms.lecturers,
          educationId: educationTerms.educationId,
        })
        .execute();
    },
  },
};

export default educationRepository;

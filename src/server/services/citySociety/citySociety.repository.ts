import { count, eq, ilike, type SQL } from 'drizzle-orm';
import { db } from '~/server/db';
import { cities, citySocieties, societies } from '~/server/db/schema';
import { prepareOrderBy, prepareWhere } from '~/server/db/utility';
import type { FindQueryDTO, FindReturnDTO } from '~/server/db/utility/types';

enum SortableKeys {
  ID = 'id',
  NAME = 'name',
}

enum FilterableKeys {
  NAME = 'name',
  SOCIETY_ID = 'societyId',
}

export type FindCitySocietyReturnDTO = {
  id: string;
  name: string;
  address: string;
  director: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  cityId: string | null;
  cityName: string | null;
  societyId: string | null;
  societyName: string | null;
};

export type CitySocietyFormData = {
  id?: string;
  name: string;
  address: string;
  director: string;
  phone?: string;
  email?: string;
  website?: string;
  cityId?: string;
  societyId?: string;
};

const selectedFields = {
  id: citySocieties.id,
  name: citySocieties.name,
  address: citySocieties.address,
  director: citySocieties.director,
  phone: citySocieties.phone,
  email: citySocieties.email,
  website: citySocieties.website,
  cityId: citySocieties.cityId,
  cityName: cities.name,
  societyId: citySocieties.societyId,
  societyName: societies.name,
};

const mapKeyToColumn = (key?: string) => {
  switch (key as SortableKeys) {
    case SortableKeys.NAME:
      return citySocieties.name;
    default:
      return citySocieties.name;
  }
};

const mapFilterableKeyToConditional = (
  key: string,
  value: string,
): SQL | undefined => {
  if (key === FilterableKeys.NAME.valueOf()) {
    return ilike(citySocieties.name, `%${value}%`);
  }

  if (key === FilterableKeys.SOCIETY_ID.valueOf() && value) {
    return eq(citySocieties.societyId, value);
  }

  return undefined;
};

const citySocietyRepository = {
  find: async (data: FindQueryDTO) => {
    const { page, limit, sort, filter } = data;
    console.log(filter);
    const orderBy = prepareOrderBy(
      mapKeyToColumn,
      SortableKeys,
      citySocieties.name,
      sort,
    );
    const where = prepareWhere(
      filter,
      FilterableKeys,
      mapFilterableKeyToConditional,
    );

    const { totalCount, returnData } = await db.transaction(
      async (tx): Promise<FindReturnDTO<FindCitySocietyReturnDTO>> => {
        const [totalCount] = await tx
          .select({ count: count() })
          .from(citySocieties)
          .leftJoin(cities, eq(citySocieties.cityId, cities.id))
          .leftJoin(societies, eq(citySocieties.societyId, societies.id))
          .where(where);

        const returnData = await tx
          .select(selectedFields)
          .from(citySocieties)
          .leftJoin(cities, eq(citySocieties.cityId, cities.id))
          .leftJoin(societies, eq(citySocieties.societyId, societies.id))
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
      .select(selectedFields)
      .from(citySocieties)
      .leftJoin(cities, eq(citySocieties.cityId, cities.id))
      .leftJoin(societies, eq(citySocieties.societyId, societies.id))
      .where(eq(citySocieties.id, id))
      .execute();
  },

  findAll: async (societyId?: string) => {
    const query = db
      .select({ id: citySocieties.id, name: citySocieties.name })
      .from(citySocieties)
      .orderBy(citySocieties.name);

    if (societyId) {
      return query.where(eq(citySocieties.societyId, societyId)).execute();
    }

    return query.execute();
  },

  create: async (data: CitySocietyFormData) => {
    const {
      name,
      address,
      director,
      phone,
      email,
      website,
      cityId,
      societyId,
    } = data;
    return db
      .insert(citySocieties)
      .values({
        name,
        address,
        director,
        phone,
        email,
        website,
        cityId,
        societyId,
      })
      .returning(selectedFields)
      .execute();
  },

  update: async (data: CitySocietyFormData) => {
    const {
      id,
      name,
      address,
      director,
      phone,
      email,
      website,
      cityId,
      societyId,
    } = data;
    if (!id) throw new Error('Id is required for updating city society');

    return db
      .update(citySocieties)
      .set({
        name,
        address,
        director,
        phone,
        email,
        website,
        cityId,
        societyId,
      })
      .where(eq(citySocieties.id, id))
      .returning(selectedFields)
      .execute();
  },

  deleteById: async (id: string) => {
    return db.delete(citySocieties).where(eq(citySocieties.id, id)).execute();
  },
};

export default citySocietyRepository;

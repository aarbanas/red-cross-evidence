import { count, eq, ilike, type SQL } from 'drizzle-orm';
import { db } from '~/server/db';
import { cities, societies } from '~/server/db/schema';
import { prepareOrderBy, prepareWhere } from '~/server/db/utility';
import type { FindQueryDTO, FindReturnDTO } from '~/server/db/utility/types';

enum SortableKeys {
  ID = 'id',
  NAME = 'name',
}

enum FilterableKeys {
  NAME = 'name',
}

export type FindSocietyReturnDTO = {
  id: string;
  name: string;
  address: string;
  director: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  cityId: string | null;
  cityName: string | null;
};

export type SocietyFormData = {
  id?: string;
  name: string;
  address: string;
  director: string;
  phone?: string;
  email?: string;
  website?: string;
  cityId?: string;
};

const selectedFields = {
  id: societies.id,
  name: societies.name,
  address: societies.address,
  director: societies.director,
  phone: societies.phone,
  email: societies.email,
  website: societies.website,
  cityId: societies.cityId,
  cityName: cities.name,
};

const mapKeyToColumn = (key?: string) => {
  switch (key as SortableKeys) {
    case SortableKeys.NAME:
      return societies.name;
    default:
      return societies.name;
  }
};

const mapFilterableKeyToConditional = (
  key: string,
  value: string,
): SQL | undefined => {
  if (key === FilterableKeys.NAME.valueOf())
    return ilike(societies.name, `%${value}%`);

  return undefined;
};

const societyRepository = {
  find: async (data: FindQueryDTO) => {
    const { page, limit, sort, filter } = data;
    const orderBy = prepareOrderBy(
      mapKeyToColumn,
      SortableKeys,
      societies.name,
      sort,
    );
    const where = prepareWhere(
      filter,
      FilterableKeys,
      mapFilterableKeyToConditional,
    );

    const { totalCount, returnData } = await db.transaction(
      async (tx): Promise<FindReturnDTO<FindSocietyReturnDTO>> => {
        const [totalCount] = await tx
          .select({ count: count() })
          .from(societies)
          .leftJoin(cities, eq(societies.cityId, cities.id))
          .where(where);

        const returnData = await tx
          .select(selectedFields)
          .from(societies)
          .leftJoin(cities, eq(societies.cityId, cities.id))
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
      .from(societies)
      .leftJoin(cities, eq(societies.cityId, cities.id))
      .where(eq(societies.id, id))
      .execute();
  },

  findAll: async () => {
    return db
      .select({ id: societies.id, name: societies.name })
      .from(societies)
      .orderBy(societies.name)
      .execute();
  },

  create: async (data: SocietyFormData) => {
    const { name, address, director, phone, email, website, cityId } = data;
    return db
      .insert(societies)
      .values({ name, address, director, phone, email, website, cityId })
      .returning(selectedFields)
      .execute();
  },

  update: async (data: SocietyFormData) => {
    const { id, name, address, director, phone, email, website, cityId } = data;
    if (!id) throw new Error('Id is required for updating society');

    return db
      .update(societies)
      .set({ name, address, director, phone, email, website, cityId })
      .where(eq(societies.id, id))
      .returning(selectedFields)
      .execute();
  },

  deleteById: async (id: string) => {
    return db.delete(societies).where(eq(societies.id, id)).execute();
  },
};

export default societyRepository;

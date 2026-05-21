import { count, eq, ilike, type SQL } from 'drizzle-orm';
import { db } from '~/server/db';
import { equipment } from '~/server/db/schema';
import { prepareOrderBy, prepareWhere } from '~/server/db/utility';
import type { FindQueryDTO, FindReturnDTO } from '~/server/db/utility/types';

export type EquipmentFormData = {
  id?: string;
  name: string;
  type: string;
  size: string;
  quantity: number;
};

export type FindEquipmentReturnDTO = {
  id: string;
  name: string;
  type: string;
  size: string;
  quantity: number;
};

enum SortableKeys {
  ID = 'id',
  NAME = 'name',
  TYPE = 'type',
  SIZE = 'size',
}

enum FilterableKeys {
  NAME = 'name',
  TYPE = 'type',
}

const mapKeyToColumn = (key?: string) => {
  switch (key as SortableKeys) {
    case SortableKeys.ID:
      return equipment.id;
    case SortableKeys.NAME:
      return equipment.name;
    case SortableKeys.TYPE:
      return equipment.type;
    case SortableKeys.SIZE:
      return equipment.size;
    default:
      return equipment.name;
  }
};

const mapFilterableKeyToConditional = (
  key: string,
  value: string,
): SQL | undefined => {
  if (key === FilterableKeys.NAME.valueOf())
    return ilike(mapKeyToColumn(key), `${value}%`);

  if (key === FilterableKeys.TYPE.valueOf() && value)
    return eq(mapKeyToColumn(key), value);

  return undefined;
};

const equipmentRepository = {
  find: async (data: FindQueryDTO) => {
    const { page, limit, sort, filter } = data;
    const orderBy = prepareOrderBy(
      mapKeyToColumn,
      SortableKeys,
      equipment.name,
      sort,
    );
    const where = prepareWhere(
      filter,
      FilterableKeys,
      mapFilterableKeyToConditional,
    );

    const { totalCount, returnData } = await db.transaction(
      async (tx): Promise<FindReturnDTO<FindEquipmentReturnDTO>> => {
        const [totalCount] = await tx
          .select({ count: count() })
          .from(equipment)
          .where(where);

        const returnData = await tx
          .select({
            id: equipment.id,
            name: equipment.name,
            type: equipment.type,
            size: equipment.size,
            quantity: equipment.quantity,
          })
          .from(equipment)
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
        id: equipment.id,
        name: equipment.name,
        type: equipment.type,
        size: equipment.size,
        quantity: equipment.quantity,
      })
      .from(equipment)
      .where(eq(equipment.id, id))
      .execute();
  },
  findAll: async () => {
    return db
      .select({
        id: equipment.id,
        name: equipment.name,
        type: equipment.type,
        size: equipment.size,
        quantity: equipment.quantity,
      })
      .from(equipment)
      .orderBy(equipment.name)
      .execute();
  },
  create: async (data: EquipmentFormData) => {
    return db
      .insert(equipment)
      .values({
        name: data.name,
        type: data.type,
        size: data.size,
        quantity: data.quantity,
      })
      .returning({
        id: equipment.id,
        name: equipment.name,
        type: equipment.type,
        size: equipment.size,
        quantity: equipment.quantity,
      })
      .execute();
  },
  update: async (data: EquipmentFormData) => {
    if (!data.id) {
      throw new Error('Id is required for updating equipment');
    }

    return db
      .update(equipment)
      .set({
        name: data.name,
        type: data.type,
        size: data.size,
        quantity: data.quantity,
        updatedAt: new Date(),
      })
      .where(eq(equipment.id, data.id))
      .returning({
        id: equipment.id,
        name: equipment.name,
        type: equipment.type,
        size: equipment.size,
        quantity: equipment.quantity,
      })
      .execute();
  },
  deleteById: async (id: string) => {
    return db.delete(equipment).where(eq(equipment.id, id)).execute();
  },
};

export default equipmentRepository;

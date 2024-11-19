import { db } from "~/server/db";
import {
  addresses,
  cities,
  profiles,
  profilesAddresses,
  users,
} from "~/server/db/schema";
import { and, count, eq, ilike, type SQL } from "drizzle-orm";
import { prepareOrderBy, prepareWhere } from "~/server/db/utility";
import type { FindQueryDTO, FindReturnDTO } from "~/server/db/utility/types";

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
  city: string | null;
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
  key: string,
  value: string,
): SQL | undefined => {
  if (
    key === FilterableKeys.FIRSTNAME.valueOf() ||
    key === FilterableKeys.LASTNAME.valueOf()
  )
    return ilike(mapKeyToColumn(key as FilterableKeys), `${value}%`);

  if (
    key === FilterableKeys.EMAIL.valueOf() ||
    (key === FilterableKeys.CITY.valueOf() && value != "")
  )
    return eq(mapKeyToColumn(key), value);

  return undefined;
};

const mapKeyToColumn = (key?: string) => {
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
      return cities.id;
    default:
      return users.id;
  }
};

const userRepository = {
  find: async (data: FindQueryDTO) => {
    const { page, limit, sort, filter } = data;
    const orderBy = prepareOrderBy(
      mapKeyToColumn,
      SortableKeys,
      users.createdAt,
      sort,
    );
    const where = prepareWhere(
      filter,
      FilterableKeys,
      mapFilterableKeyToConditional,
    );

    const { totalCount, returnData } = await db.transaction(
      async (tx): Promise<FindReturnDTO<FindUserReturnDTO>> => {
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
            city: cities.name,
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

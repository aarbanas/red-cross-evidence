import { db } from "~/server/db";
import { profiles, users } from "~/server/db/schema";
import { asc, desc, eq, type SQL } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { type FindUserQuery } from "~/server/services/user/types";

enum SortableKeys {
  ID = "id",
  FIRSTNAME = "firstname",
  LASTNAME = "lastname",
  EMAIL = "email",
  CITY = "city",
  COUNTRY = "country",
  ACTIVE = "active",
}

const mapKeyToColumn = (key: SortableKeys) => {
  switch (key) {
    case SortableKeys.ID:
      return users.id;
    case SortableKeys.FIRSTNAME:
      return profiles.firstName;
    case SortableKeys.LASTNAME:
      return profiles.lastName;
    case SortableKeys.EMAIL:
      return users.email;
    case SortableKeys.CITY:
      return profiles.city;
    case SortableKeys.COUNTRY:
      return profiles.country;
    case SortableKeys.ACTIVE:
      return users.active;
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
  return asc(users.id);
};

const prepareOrderBy = (sort?: string | string[]): SQL[] => {
  if (!sort) {
    return [asc(users.id)];
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

const userRepository = {
  find: async (data: FindUserQuery) => {
    const { page, limit, sort } = data;
    const orderBy = prepareOrderBy(sort);

    return db
      .select({
        id: users.id,
        email: users.email,
        active: users.active,
        profile: {
          id: profiles.id,
          firstName: profiles.firstName,
          lastName: profiles.lastName,
          city: profiles.city,
          country: profiles.country,
        },
      })
      .from(users)
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .orderBy(...orderBy)
      .limit(limit ?? 10)
      .offset(page ? Number(page) * (limit ?? 10) : 0)
      .execute();
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

import { db } from "~/server/db";
import { profiles, users } from "~/server/db/schema";
import { asc, desc, eq, type SQL } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { type FindUserQuery } from "~/server/services/user/types";

enum SortableKeys {
  id = "id",
  firstname = "firstname",
  lastname = "lastname",
  email = "email",
  city = "city",
  country = "country",
  active = "active",
}

const mapKeyToColumn = (key: SortableKeys) => {
  switch (key) {
    case SortableKeys.id:
      return users.id;
    case SortableKeys.firstname:
      return profiles.firstName;
    case SortableKeys.lastname:
      return profiles.lastName;
    case SortableKeys.email:
      return users.email;
    case SortableKeys.city:
      return profiles.city;
    case SortableKeys.country:
      return profiles.country;
    case SortableKeys.active:
      return users.active;
    default:
      return users.id;
  }
};

const generateSortFunction = (
  key: SortableKeys | undefined | string,
  value: undefined | string,
) => {
  if (
    value &&
    Object.keys(SortableKeys).findIndex((sortableKey) => sortableKey === key) >
      -1
  ) {
    if (value === "asc") {
      return asc(mapKeyToColumn(key as SortableKeys));
    } else if (value === "desc") {
      return desc(mapKeyToColumn(key as SortableKeys));
    } else {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid sort direction",
      });
    }
  }
};

const prepareOrderBy = (sort?: string | string[]): SQL[] => {
  if (!sort) {
    return [asc(users.email)];
  }

  if (typeof sort === "string") {
    const [key, value] = sort.split(":");

    return [generateSortFunction(key, value)!];
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
      .orderBy(users.id)
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .execute();
  },
};

export default userRepository;

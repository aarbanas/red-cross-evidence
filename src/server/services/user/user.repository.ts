import { db } from "~/server/db";
import { profiles, users } from "~/server/db/schema";
import { asc, desc, eq, type SQL } from "drizzle-orm";

enum SortableKeys {
  "id",
  "firstname",
  "lastname",
  "email",
  "city",
  "country",
  "active",
}

type FindUserQueryDto = {
  page?: number;
  limit?: number;
  sort?: Record<string, "asc" | "desc">;
};

const mapKeyToColumn = (key: string) => {
  switch (key) {
    case "id":
      return users.id;
    case "firstname":
      return profiles.firstName;
    case "lastname":
      return profiles.lastName;
    case "email":
      return users.email;
    case "city":
      return profiles.city;
    case "country":
      return profiles.country;
    case "active":
      return users.active;
    default:
      return users.id;
  }
};

const prepareOrderBy = (sort?: Pick<FindUserQueryDto, "sort">) => {
  if (!sort || !Object.keys(sort).length) {
    return asc(users.id);
  }

  if (Object.keys(sort).length === 1) {
    const key = Object.keys(sort)[0];
    const value = Object.values(sort)[0];

    if (value) {
      return value === "asc"
        ? asc(mapKeyToColumn(key!))
        : desc(mapKeyToColumn(key!));
    }
  }

  //(asc(users.id), desc(profiles.firstName))
  const sorts = [];
  for (const [key, value] of Object.entries(sort)) {
    sorts.push(
      value === "asc" ? asc(mapKeyToColumn(key)) : desc(mapKeyToColumn(key)),
    );
  }

  return sorts;
};

const userRepository = {
  find: async (data: FindUserQueryDto) => {
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

import { db } from "~/server/db";
import { profiles, users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

const userRepository = {
  find: async () => {
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

import { db } from "~/server/db";
import { languages } from "~/server/db/schema";

export const skillRepository = {
  language: {
    getAll: async () => {
      return db.select().from(languages).execute();
    },
  },
};

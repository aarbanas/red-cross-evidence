import { db } from "~/server/db";
import { cities } from "~/server/db/schema";
import { asc } from "drizzle-orm";

export type FindCityNameReturnDTO = {
  name: string;
};

const cityRepository = {
  findUniqueCityNames: async () => {
    return db
      .selectDistinct({ name: cities.name })
      .from(cities)
      .orderBy(asc(cities.name))
      .execute();
  },
};

export default cityRepository;

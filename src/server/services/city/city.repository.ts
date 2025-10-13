import { db } from "~/server/db";
import { cities } from "~/server/db/schema";
import { asc, ilike, eq, and } from "drizzle-orm";

export type FindCityNameReturnDTO = {
  name: string;
  id: string;
};

export type SearchCityReturnDTO = {
  id: string;
  name: string;
  postalCode: string | null;
};

const cityRepository = {
  findUniqueCityNames: async () => {
    return db
      .selectDistinct({ name: cities.name, id: cities.id })
      .from(cities)
      .orderBy(asc(cities.name))
      .execute();
  },
  searchCities: async (searchTerm: string, countryId: string, limit = 10) => {
    return db
      .select({
        id: cities.id,
        name: cities.name,
        postalCode: cities.postalCode,
      })
      .from(cities)
      .where(
        and(
          ilike(cities.name, `%${searchTerm}%`),
          eq(cities.countryId, countryId),
        ),
      )
      .orderBy(asc(cities.name))
      .limit(limit)
      .execute();
  },
};

export default cityRepository;

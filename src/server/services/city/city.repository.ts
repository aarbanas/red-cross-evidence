import { db } from "~/server/db";
import { cities } from "~/server/db/schema";
import { asc, ilike, eq, and } from "drizzle-orm";
import { type CreateCityDTO } from "~/server/services/city/types";

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
  getOrCreate: async (data: CreateCityDTO) => {
    const existingCity = await db
      .select({
        id: cities.id,
        name: cities.name,
      })
      .from(cities)
      .where(
        and(
          eq(cities.name, data.name),
          eq(cities.postalCode, data.postalCode),
          eq(cities.countryId, data.countryId),
        ),
      )
      .execute();

    if (existingCity.length > 0) {
      return existingCity[0];
    }

    const newCity = await db
      .insert(cities)
      .values(data)
      .returning({ id: cities.id, name: cities.name })
      .execute();

    return newCity[0];
  },
};

export default cityRepository;

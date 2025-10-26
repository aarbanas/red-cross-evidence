import { and, asc, eq, ilike } from "drizzle-orm";
import { addresses, cities } from "~/server/db/schema";

import { db } from "~/server/db";
import type {
  CreateAddressDTO,
  FindAddressQuery,
  SearchAddressQuery,
} from "~/server/services/address/types";

const addressRepository = {
  find: async (query: FindAddressQuery) => {
    return db
      .select()
      .from(addresses)
      .innerJoin(cities, eq(addresses.cityId, cities.id))
      .where(ilike(addresses.street, query.street));
  },
  searchAddresses: async (query: SearchAddressQuery, limit = 10) => {
    const { searchTerm, cityId } = query;
    return db
      .select({
        id: addresses.id,
        street: addresses.street,
        streetNumber: addresses.streetNumber,
        cityId: addresses.cityId,
      })
      .from(addresses)
      .where(
        and(
          eq(addresses.cityId, cityId),
          ilike(addresses.street, `%${searchTerm}%`),
        ),
      )
      .orderBy(asc(addresses.street))
      .limit(limit)
      .execute();
  },
  create: async (data: CreateAddressDTO) => {
    return db
      .insert(addresses)
      .values(data)
      .returning({ id: addresses.id })
      .execute();
  },
};

export default addressRepository;

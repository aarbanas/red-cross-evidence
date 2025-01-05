import { eq, ilike } from "drizzle-orm";
import { addresses, cities } from "~/server/db/schema";

import { db } from "~/server/db";
import { type FindAddressQuery } from "~/server/services/address/types";

const addressRepository = {
  find: async (query: FindAddressQuery) => {
    return db
      .select()
      .from(addresses)
      .innerJoin(cities, eq(addresses.cityId, cities.id))
      .where(ilike(addresses.street, query.street));
  },
};

export default addressRepository;

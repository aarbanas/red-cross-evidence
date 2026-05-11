import { and, asc, eq, ilike } from 'drizzle-orm'
import { db } from '~/server/db'
import { addresses, cities } from '~/server/db/schema'
import type {
  CreateAddressDTO,
  FindAddressQuery,
  SearchAddressQuery,
} from '~/server/services/address/types'

const addressRepository = {
  find: async (query: FindAddressQuery) => {
    return db
      .select()
      .from(addresses)
      .innerJoin(cities, eq(addresses.cityId, cities.id))
      .where(ilike(addresses.street, query.street))
  },
  searchAddresses: async (query: SearchAddressQuery, limit = 10) => {
    const { searchTerm, cityId } = query
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
      .execute()
  },
  getOrCreate: async (data: CreateAddressDTO) => {
    const existingAddressId = await db
      .select({ id: addresses.id })
      .from(addresses)
      .where(
        and(
          eq(addresses.cityId, data.cityId),
          eq(addresses.street, data.street),
          eq(addresses.streetNumber, data.streetNumber),
          eq(addresses.type, data.type),
        ),
      )
      .limit(1)
      .execute()
    if (existingAddressId.length > 0) {
      return existingAddressId[0]
    }

    const newAddress = await db
      .insert(addresses)
      .values(data)
      .returning({ id: addresses.id })
      .execute()
    return newAddress[0]
  },
}

export default addressRepository

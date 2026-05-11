import { and, count, eq, ilike, type SQL } from 'drizzle-orm'
import { db } from '~/server/db'
import {
  addresses,
  cities,
  profileSkills,
  profiles,
  profilesAddresses,
  profilesLanguages,
  profilesLicences,
  sizes,
  users,
  workStatuses,
} from '~/server/db/schema'
import { prepareOrderBy, prepareWhere } from '~/server/db/utility'
import type { FindQueryDTO, FindReturnDTO } from '~/server/db/utility/types'
import type {
  CreateUserAddressIdsDTO,
  CreateUserDTO,
} from '~/server/services/user/types'

export type FindUserReturnDTO = {
  id: string
  email: string
  active: boolean | null
  createdAt: Date
  profile: {
    id: string
    firstName: string
    lastName: string
  } | null
  city: string | null
}

enum SortableKeys {
  ID = 'id',
  FIRSTNAME = 'firstname',
  LASTNAME = 'lastname',
  EMAIL = 'email',
  CITY = 'city',
  COUNTRY = 'country',
  ACTIVE = 'active',
}

enum FilterableKeys {
  FIRSTNAME = 'firstname',
  LASTNAME = 'lastname',
  EMAIL = 'email',
  CITY = 'city',
}

const mapFilterableKeyToConditional = (
  key: string,
  value: string,
): SQL | undefined => {
  if (
    key === FilterableKeys.FIRSTNAME.valueOf() ||
    key === FilterableKeys.LASTNAME.valueOf()
  )
    return ilike(mapKeyToColumn(key as FilterableKeys), `${value}%`)

  if (
    key === FilterableKeys.EMAIL.valueOf() ||
    (key === FilterableKeys.CITY.valueOf() && value !== '')
  )
    return eq(mapKeyToColumn(key), value)

  return undefined
}

const mapKeyToColumn = (key?: string) => {
  switch (key) {
    case SortableKeys.ID:
      return users.id
    case SortableKeys.FIRSTNAME:
      return profiles.firstName
    case SortableKeys.LASTNAME:
      return profiles.lastName
    case SortableKeys.EMAIL:
      return users.email
    case SortableKeys.ACTIVE:
      return users.active
    case SortableKeys.CITY:
      return cities.id
    default:
      return users.id
  }
}

const userRepository = {
  find: async (data: FindQueryDTO) => {
    const { page, limit, sort, filter } = data
    const orderBy = prepareOrderBy(
      mapKeyToColumn,
      SortableKeys,
      users.createdAt,
      sort,
    )
    const where = prepareWhere(
      filter,
      FilterableKeys,
      mapFilterableKeyToConditional,
    )

    const { totalCount, returnData } = await db.transaction(
      async (tx): Promise<FindReturnDTO<FindUserReturnDTO>> => {
        const [totalCount] = await tx
          .select({ count: count() })
          .from(users)
          .leftJoin(profiles, eq(users.id, profiles.userId))
          .leftJoin(
            profilesAddresses,
            and(
              eq(profiles.id, profilesAddresses.profileId),
              eq(profilesAddresses.isPrimary, true),
            ),
          )
          .leftJoin(addresses, eq(profilesAddresses.addressId, addresses.id))
          .leftJoin(cities, eq(addresses.cityId, cities.id))
          .where(where)

        const returnData = await tx
          .select({
            id: users.id,
            email: users.email,
            active: users.active,
            createdAt: users.createdAt,
            profile: {
              id: profiles.id,
              firstName: profiles.firstName,
              lastName: profiles.lastName,
            },
            city: cities.name,
          })
          .from(users)
          .leftJoin(profiles, eq(users.id, profiles.userId))
          .leftJoin(
            profilesAddresses,
            and(
              eq(profiles.id, profilesAddresses.profileId),
              eq(profilesAddresses.isPrimary, true),
            ),
          )
          .leftJoin(addresses, eq(profilesAddresses.addressId, addresses.id)) // Corrected join condition
          .leftJoin(cities, eq(addresses.cityId, cities.id))
          .where(where)
          .orderBy(...orderBy)
          .limit(limit ?? 10)
          .offset(page ? Number(page) * (limit ?? 10) : 0)

        return { totalCount: totalCount?.count ?? 0, returnData }
      },
    )

    return {
      data: returnData,
      meta: {
        count: totalCount,
        limit: limit ?? 10,
      },
    }
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
      .execute()
  },
  create: async (
    data: CreateUserDTO,
    password: string,
    addressIdCreationData: CreateUserAddressIdsDTO[],
  ) => {
    return db.transaction(async (tx) => {
      // Insert user
      const [newUser] = await tx
        .insert(users)
        .values({
          email: data.profile.email,
          active: true,
          password,
        })
        .returning({ id: users.id })
      if (!newUser) {
        throw new Error('Failed to create user')
      }

      // Insert profile (pass user id)
      const [newProfile] = await tx
        .insert(profiles)
        .values({
          firstName: data.profile.firstName,
          lastName: data.profile.lastName,
          oib: data.profile.oib,
          sex: data.profile.sex,
          birthDate: data.profile.birthDate,
          birthPlace: data.profile.birthPlace,
          parentName: data.profile.parentName,
          nationality: data.profile.nationality,
          phone: data.profile.phone,
          userId: newUser.id,
        })
        .returning({ id: profiles.id })
      if (!newProfile) {
        throw new Error('Failed to create profile')
      }

      // Insert size (pass profile id)
      await tx.insert(sizes).values({
        shoeSize: Number(data.size.shoeSize),
        clothingSize: data.size.clothingSize,
        height: data.size.height,
        weight: data.size.weight,
        profileId: newProfile.id,
      })

      // Insert work status (pass profile id)
      await tx.insert(workStatuses).values({
        status: data.workStatus.status,
        profession: data.workStatus.profession,
        institution: data.workStatus.institution,
        educationLevel: data.workStatus.educationLevel,
        profileId: newProfile.id,
      })

      // Insert profile addresses (profile id + address ids, mark primary)
      await tx.insert(profilesAddresses).values(
        addressIdCreationData.map((addrData) => ({
          profileId: newProfile.id,
          addressId: addrData.addressId,
          isPrimary: addrData.isPrimary,
        })),
      )

      // Insert profile languages (profile id + language ids + level)
      if (data.skills.selectedLanguages?.length) {
        await tx.insert(profilesLanguages).values(
          data.skills.selectedLanguages.map((language) => ({
            profileId: newProfile.id,
            languageId: language.id,
            level: language.level,
          })),
        )
      }

      // Insert profile licences (profile id + licence ids)
      if (data.skills.selectedLicences?.length) {
        await tx.insert(profilesLicences).values(
          data.skills.selectedLicences.map((licence) => ({
            profileId: newProfile.id,
            licenceId: licence.id,
          })),
        )
      }

      if (data.skills.otherSkills?.length) {
        await tx.insert(profileSkills).values(
          data.skills.otherSkills.map((skill) => ({
            profileId: newProfile.id,
            name: skill.name,
            description: skill.description,
          })),
        )
      }
    })
  },
}

export default userRepository

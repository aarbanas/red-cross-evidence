import type { AddressType } from '~/server/db/schema'
import type { FindQueryDTO } from '~/server/db/utility/types'
import addressRepository from '~/server/services/address/address.repository'
import cityRepository from '~/server/services/city/city.repository'
import type {
  CreateUserAddressesDTO,
  CreateUserAddressIdsDTO,
  CreateUserDTO,
} from '~/server/services/user/types'
import userRepository from '~/server/services/user/user.repository'
import { generateRandomHashedPassword } from '~/server/utils/password'

const userService = {
  getById: async (id: string) => {
    return userRepository.findById(id)
  },
  find: async (data: FindQueryDTO) => {
    return userRepository.find(data)
  },
  create: async (data: CreateUserDTO) => {
    try {
      validateUserCreation(data)

      const { hashedPassword } = await generateRandomHashedPassword()

      // prepare addresses with IDs
      const addressIds = await prepareAddresses(data.addresses)
      return userRepository.create(data, hashedPassword, addressIds)
    } catch (_) {}
  },
}

const validateUserCreation = (data: CreateUserDTO) => {
  if (Number.isNaN(Number(data.size.shoeSize))) {
    throw new Error('Shoe size must be a valid number')
  }
}

const prepareAddresses = async (
  data: CreateUserAddressesDTO,
): Promise<CreateUserAddressIdsDTO[]> => {
  const addressIds: CreateUserAddressIdsDTO[] = []

  for (const address of data) {
    let cityId: string | null = null
    if (typeof address.city === 'string') {
      const newCity = await cityRepository.getOrCreate({
        name: address.city,
        postalCode: address.postalCode,
        countryId: address.country,
      })
      if (!newCity?.id) {
        throw new Error('Failed to create new city')
      }

      cityId = newCity.id
    } else {
      cityId = address.city.id
    }

    const newAddress = await addressRepository.getOrCreate({
      cityId,
      street: address.street,
      streetNumber: address.streetNumber,
      type: address.type as AddressType,
    })
    if (!newAddress?.id) {
      throw new Error('Failed to create new address')
    }

    addressIds.push({
      addressId: newAddress.id,
      isPrimary: address.isPrimary,
    })
  }

  return addressIds
}

export default userService

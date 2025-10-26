import userRepository from "~/server/services/user/user.repository";
import type { FindQueryDTO } from "~/server/db/utility/types";
import type {
  CreateUserAddressesDTO,
  CreateUserAddressIdsDTO,
  CreateUserDTO,
} from "~/server/services/user/types";
import { generateRandomHashedPassword } from "~/server/utils/password";
import cityRepository from "~/server/services/city/city.repository";
import addressRepository from "~/server/services/address/address.repository";
import { type AddressType } from "~/server/db/schema";

const userService = {
  getById: async (id: string) => {
    return userRepository.findById(id);
  },
  find: async (data: FindQueryDTO) => {
    return userRepository.find(data);
  },
  create: async (data: CreateUserDTO) => {
    try {
      validateUserCreation(data);

      const { hashedPassword } = await generateRandomHashedPassword();

      // prepare addresses with IDs
      const addressIds = await prepareAddresses(data.addresses);
      return userRepository.create(data, hashedPassword, addressIds);
    } catch (e) {}
  },
};

const validateUserCreation = (data: CreateUserDTO) => {
  if (isNaN(Number(data.size.shoeSize))) {
    throw new Error("Shoe size must be a valid number");
  }
};

const prepareAddresses = async (
  data: CreateUserAddressesDTO,
): Promise<CreateUserAddressIdsDTO[]> => {
  const addressIds: CreateUserAddressIdsDTO[] = [];

  for (const address of data) {
    let cityId: string | null = null;
    if (typeof address.city === "string") {
      const newCity = await cityRepository.create({
        name: address.city,
        postalCode: address.postalCode,
        countryId: address.country,
      });
      if (!newCity[0]?.id) {
        throw new Error("Failed to create new city");
      }

      cityId = newCity[0].id;
    } else {
      cityId = address.city.id;
    }

    const newAddress = await addressRepository.create({
      cityId,
      street: address.street,
      streetNumber: address.streetNumber,
      type: address.type as AddressType,
    });
    if (!newAddress[0]?.id) {
      throw new Error("Failed to create new address");
    }

    addressIds.push({
      addressId: newAddress[0].id,
      isPrimary: address.isPrimary,
    });
  }

  return addressIds;
};

export default userService;

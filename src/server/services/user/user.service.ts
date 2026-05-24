import type {
  AddressType,
  ClothingSize,
  EducationLevel,
  LanguageLevel,
  Sex,
  UserType,
  WorkStatus,
} from '@/server/db/schema';
import type { FindQueryDTO } from '@/server/db/utility/types';
import addressRepository from '@/server/services/address/address.repository';
import cityRepository from '@/server/services/city/city.repository';
import type {
  CreateUserAddressesDTO,
  CreateUserAddressIdsDTO,
  CreateUserDTO,
} from '@/server/services/user/types';
import userRepository from '@/server/services/user/user.repository';
import { mapDbError } from '@/server/utils/db-error';
import { generateRandomHashedPassword } from '@/server/utils/password';

const userService = {
  getById: async (id: string) => {
    return userRepository.findById(id);
  },
  find: async (data: FindQueryDTO) => {
    return userRepository.find(data);
  },
  create: async (data: CreateUserDTO) => {
    validateUserCreation(data);

    const { hashedPassword } = await generateRandomHashedPassword();
    const addressIds = await prepareAddresses(data.addresses);

    try {
      return await userRepository.create(data, hashedPassword, addressIds);
    } catch (error) {
      throw mapDbError(error);
    }
  },
  getProfile: async (userId: string) => {
    return userRepository.getProfile(userId);
  },
  getAddresses: async (userId: string) => {
    return userRepository.getAddresses(userId);
  },
  getSizes: async (userId: string) => {
    return userRepository.getSizes(userId);
  },
  getRentedEquipment: async (userId: string) => {
    return userRepository.getRentedEquipment(userId);
  },
  getSkills: async (userId: string) => {
    return userRepository.getSkills(userId);
  },
  updateProfile: async (
    userId: string,
    profileData: {
      firstName: string;
      lastName: string;
      oib: string;
      sex: Sex;
      type: UserType;
      birthDate?: string | null;
      birthPlace?: string | null;
      parentName?: string | null;
      nationality?: string | null;
      phone?: string | null;
      societyId?: string | null;
      citySocietyId?: string | null;
    },
    workStatusData: {
      status: WorkStatus;
      profession?: string | null;
      institution?: string | null;
      educationLevel?: EducationLevel | null;
    },
  ) => {
    try {
      return await userRepository.updateProfile(
        userId,
        profileData,
        workStatusData,
      );
    } catch (error) {
      throw mapDbError(error);
    }
  },
  addAddress: async (
    userId: string,
    addressData: {
      street: string;
      streetNumber: string;
      type: AddressType;
      city: string | { id: string; name: string; postalCode?: string | null };
      postalCode: string;
      country: string;
      isPrimary: boolean;
    },
  ) => {
    const cityId = await resolveCityId(addressData);

    try {
      return await userRepository.addAddress(userId, {
        street: addressData.street,
        streetNumber: addressData.streetNumber,
        type: addressData.type,
        cityId,
        isPrimary: addressData.isPrimary,
      });
    } catch (error) {
      throw mapDbError(error);
    }
  },
  updateAddress: async (
    userId: string,
    oldAddressId: string,
    addressData: {
      street: string;
      streetNumber: string;
      type: AddressType;
      city: string | { id: string; name: string; postalCode?: string | null };
      postalCode: string;
      country: string;
      isPrimary: boolean;
    },
  ) => {
    const cityId = await resolveCityId(addressData);

    try {
      return await userRepository.updateAddress(userId, oldAddressId, {
        street: addressData.street,
        streetNumber: addressData.streetNumber,
        type: addressData.type,
        cityId,
        isPrimary: addressData.isPrimary,
      });
    } catch (error) {
      throw mapDbError(error);
    }
  },
  deleteAddress: async (userId: string, addressId: string) => {
    return userRepository.deleteAddress(userId, addressId);
  },
  setPrimaryAddress: async (userId: string, addressId: string) => {
    return userRepository.setPrimaryAddress(userId, addressId);
  },
  updateSizes: async (
    userId: string,
    sizeData: {
      shoeSize?: number | null;
      clothingSize?: ClothingSize | null;
      height?: number | null;
      weight?: number | null;
    },
  ) => {
    try {
      return await userRepository.updateSizes(userId, sizeData);
    } catch (error) {
      throw mapDbError(error);
    }
  },
  addRentedEquipment: async (
    userId: string,
    equipmentId: string,
    quantity: number,
    dateOfRent: string,
  ) => {
    try {
      return await userRepository.addRentedEquipment(
        userId,
        equipmentId,
        quantity,
        dateOfRent,
      );
    } catch (error) {
      throw mapDbError(error);
    }
  },
  removeRentedEquipment: async (userId: string, equipmentId: string) => {
    return userRepository.removeRentedEquipment(userId, equipmentId);
  },
  getEducationTerms: async (userId: string) => {
    return userRepository.getEducationTerms(userId);
  },
  addEducationTerm: async (userId: string, educationTermId: string) => {
    try {
      return await userRepository.addEducationTerm(userId, educationTermId);
    } catch (error) {
      throw mapDbError(error);
    }
  },
  removeEducationTerm: async (userId: string, educationTermId: string) => {
    return userRepository.removeEducationTerm(userId, educationTermId);
  },
  findByName: async (search: string) => {
    return userRepository.findByName(search);
  },
  updateSkills: async (
    userId: string,
    skillsData: {
      selectedLanguages: { id: string; level: LanguageLevel }[];
      selectedLicences: { id: string }[];
      otherSkills: { name: string; description: string }[];
    },
  ) => {
    try {
      return await userRepository.updateSkills(userId, skillsData);
    } catch (error) {
      throw mapDbError(error);
    }
  },
};

const resolveCityId = async (addressData: {
  city: string | { id: string; name: string; postalCode?: string | null };
  postalCode: string;
  country: string;
}): Promise<string> => {
  if (typeof addressData.city === 'string') {
    const newCity = await cityRepository.getOrCreate({
      name: addressData.city,
      postalCode: addressData.postalCode,
      countryId: addressData.country,
    });
    if (!newCity?.id) throw new Error('Failed to create new city');

    return newCity.id;
  }

  return addressData.city.id;
};

const validateUserCreation = (data: CreateUserDTO) => {
  if (Number.isNaN(Number(data.size.shoeSize))) {
    throw new Error('Shoe size must be a valid number');
  }
};

const prepareAddresses = async (
  data: CreateUserAddressesDTO,
): Promise<CreateUserAddressIdsDTO[]> => {
  const addressIds: CreateUserAddressIdsDTO[] = [];

  for (const address of data) {
    let cityId: string | null = null;
    if (typeof address.city === 'string') {
      const newCity = await cityRepository.getOrCreate({
        name: address.city,
        postalCode: address.postalCode,
        countryId: address.country,
      });
      if (!newCity?.id) {
        throw new Error('Failed to create new city');
      }

      cityId = newCity.id;
    } else {
      cityId = address.city.id;
    }

    const newAddress = await addressRepository.getOrCreate({
      cityId,
      street: address.street,
      streetNumber: address.streetNumber,
      type: address.type as AddressType,
    });
    if (!newAddress?.id) {
      throw new Error('Failed to create new address');
    }

    addressIds.push({
      addressId: newAddress.id,
      isPrimary: address.isPrimary,
    });
  }

  return addressIds;
};

export default userService;

import addressRepository from '~/server/services/address/address.repository';
import type {
  FindAddressQuery,
  SearchAddressQuery,
  SearchAddressReturnDTO,
} from '~/server/services/address/types';

const addressService = {
  search: async (query: FindAddressQuery) => {
    return addressRepository.find(query);
  },

  searchAddresses: async (
    query: SearchAddressQuery,
  ): Promise<SearchAddressReturnDTO[]> => {
    return addressRepository.searchAddresses(query);
  },
};

export default addressService;

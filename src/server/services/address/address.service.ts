import addressRepository from "~/server/services/address/address.repository";
import { type FindAddressQuery } from "~/server/services/address/types";

const addressService = {
  search: async (query: FindAddressQuery) => {
    return addressRepository.find(query);
  },
};

export default addressService;

import licenseRepository from "~/server/services/license/license.repository";
import { type FindUserQuery } from "~/server/services/user/types";

const licenseService = {
  getById: async (id: string) => {
    return licenseRepository.findById(id);
  },
  find: async (data: FindUserQuery) => {
    return licenseRepository.find(data);
  },
};

export default licenseService;

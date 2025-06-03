import licenseRepository from "~/server/services/license/license.repository";
import type { FindQueryDTO } from "~/server/db/utility/types";

const licenseService = {
  getById: async (id: string) => {
    return (await licenseRepository.findById(id))[0];
  },
  find: async (data: FindQueryDTO) => {
    return licenseRepository.find(data);
  },
  findUniqueTypes: async () => {
    return licenseRepository.findUniqueTypes();
  },
};

export default licenseService;

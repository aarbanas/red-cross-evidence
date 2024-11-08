import licenseRepository from "~/server/services/license/license.repository";
import type { FindQueryDTO } from "~/server/db/utility/types";

const licenseService = {
  getById: async (id: string) => {
    return licenseRepository.findById(id);
  },
  find: async (data: FindQueryDTO) => {
    return licenseRepository.find(data);
  },
};

export default licenseService;

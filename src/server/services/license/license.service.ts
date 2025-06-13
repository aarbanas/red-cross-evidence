import licenseRepository from "~/server/services/license/license.repository";
import type { FindQueryDTO } from "~/server/db/utility/types";
import type { LicencesFormData } from "~/app/(pages)/licenses/_components/LicencesForm";

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
  create: async (data: LicencesFormData) => {
    const values: LicencesFormData = {
      ...data,
      name: prettifyLicenseName(data.name),
    };

    return licenseRepository.create(values);
  },
};

const prettifyLicenseName = (name: string) => {
  return name
    .replace(/\s{2,}/g, " ") // Replace multiple spaces with a single space
    .trim() // Remove leading/trailing spaces
    .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first letter
};

export default licenseService;

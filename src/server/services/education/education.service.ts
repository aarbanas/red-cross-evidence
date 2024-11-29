import educationRepository from "~/server/services/education/education.repository";
import type { FindQueryDTO } from "~/server/db/utility/types";
import { EducationFormData } from "~/app/(pages)/educations/[id]/_components/EducationsForm";

const educationService = {
  getById: async (id: string) => {
    return (await educationRepository.findById(id))[0];
  },
  find: async (data: FindQueryDTO) => {
    return educationRepository.find(data);
  },
  getUniqueTypes: async () => {
    return educationRepository.findUniqueTypes();
  },
  deleteById: async (id: string) => {
    return educationRepository.deleteById(id);
  },
  create: async (data: EducationFormData) => {
    return educationRepository.create(data);
  },
  update: async (data: EducationFormData) => {
    return educationRepository.update(data);
  },
};

export default educationService;

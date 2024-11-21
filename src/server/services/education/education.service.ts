import educationRepository from "~/server/services/education/education.repository";
import type { FindQueryDTO } from "~/server/db/utility/types";

const educationService = {
  getById: async (id: string) => {
    return educationRepository.findById(id);
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
  create: async (type: string, title: string, description: string) => {
    return educationRepository.create(type, title, description);
  },
  update: async (
    id: string,
    type: string,
    title: string,
    description: string,
  ) => {
    return educationRepository.update(id, type, title, description);
  },
};

export default educationService;

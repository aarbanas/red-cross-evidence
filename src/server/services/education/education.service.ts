import educationRepository from "~/server/services/education/education.repository";
import type { FindQueryDTO } from "~/server/db/utility/types";
import { type EducationFormData } from "~/app/(pages)/educations/list/[id]/_components/EducationsForm";

const educationService = {
  list: {
    getById: async (id: string) => {
      return (await educationRepository.list.findById(id))[0];
    },
    find: async (data: FindQueryDTO) => {
      return educationRepository.list.find(data);
    },
    getUniqueTypes: async () => {
      return educationRepository.list.findUniqueTypes();
    },
    deleteById: async (id: string) => {
      return educationRepository.list.deleteById(id);
    },
    create: async (data: EducationFormData) => {
      return educationRepository.list.create(data);
    },
    update: async (data: EducationFormData) => {
      return educationRepository.list.update(data);
    },
  },
  term: {
    getById: async (id: string) => {
      return (await educationRepository.term.findById(id))[0];
    },
    find: async (data: FindQueryDTO) => {
      return educationRepository.term.find(data);
    },
    deleteById: async (id: string) => {
      return educationRepository.term.deleteById(id);
    },
  },
};

export default educationService;

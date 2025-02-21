import educationRepository from "~/server/services/education/education.repository";
import type { FindQueryDTO } from "~/server/db/utility/types";
import { type EducationFormData } from "~/app/(pages)/educations/list/[id]/_components/EducationsForm";
import { EducationTermFormData } from "~/app/(pages)/educations/term/_components/EducationsTermForm";
import { EducationType } from "~/server/db/schema";

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
    getAllTitles: async (type: EducationType) => {
      return educationRepository.list.getAllTitles(type);
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
    create: async (data: EducationTermFormData) => {
      return educationRepository.term.create(data);
    },
    update: async (data: EducationTermFormData) => {
      return educationRepository.term.update(data);
    },
  },
};

export default educationService;

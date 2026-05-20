import type { EducationFormData } from '~/app/(pages)/educations/list/[id]/_components/EducationsForm';
import type { EducationTermFormData } from '~/app/(pages)/educations/term/_components/EducationsTermForm';
import type { EducationType } from '~/server/db/schema';
import type { FindQueryDTO } from '~/server/db/utility/types';
import educationRepository from '~/server/services/education/education.repository';
import { mapDbError } from '~/server/utils/db-error';

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
      try {
        return await educationRepository.list.create(data);
      } catch (error) {
        throw mapDbError(error);
      }
    },
    update: async (data: EducationFormData) => {
      try {
        return await educationRepository.list.update(data);
      } catch (error) {
        throw mapDbError(error);
      }
    },
    getAllTitles: async (type?: EducationType) => {
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
      try {
        return await educationRepository.term.create(data);
      } catch (error) {
        throw mapDbError(error);
      }
    },
    update: async (data: EducationTermFormData) => {
      try {
        return await educationRepository.term.update(data);
      } catch (error) {
        throw mapDbError(error);
      }
    },
  },
};

export default educationService;

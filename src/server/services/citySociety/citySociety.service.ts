import type { FindQueryDTO } from '~/server/db/utility/types';
import citySocietyRepository, {
  type CitySocietyFormData,
} from './citySociety.repository';

const citySocietyService = {
  find: async (data: FindQueryDTO) => {
    return citySocietyRepository.find(data);
  },
  findById: async (id: string) => {
    return (await citySocietyRepository.findById(id))[0];
  },
  findAll: async (societyId?: string) => {
    return citySocietyRepository.findAll(societyId);
  },
  create: async (data: CitySocietyFormData) => {
    return citySocietyRepository.create(data);
  },
  update: async (data: CitySocietyFormData) => {
    return citySocietyRepository.update(data);
  },
  delete: async (id: string) => {
    return citySocietyRepository.deleteById(id);
  },
};

export default citySocietyService;

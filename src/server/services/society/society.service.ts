import type { FindQueryDTO } from '@/server/db/utility/types';
import { mapDbError } from '@/server/utils/db-error';
import societyRepository, { type SocietyFormData } from './society.repository';

const societyService = {
  find: async (data: FindQueryDTO) => {
    return societyRepository.find(data);
  },
  findById: async (id: string) => {
    return (await societyRepository.findById(id))[0];
  },
  findAll: async () => {
    return societyRepository.findAll();
  },
  create: async (data: SocietyFormData) => {
    try {
      return await societyRepository.create(data);
    } catch (error) {
      throw mapDbError(error);
    }
  },
  update: async (data: SocietyFormData) => {
    try {
      return await societyRepository.update(data);
    } catch (error) {
      throw mapDbError(error);
    }
  },
  delete: async (id: string) => {
    return societyRepository.deleteById(id);
  },
};

export default societyService;

import type { FindQueryDTO } from '~/server/db/utility/types';
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
    return societyRepository.create(data);
  },
  update: async (data: SocietyFormData) => {
    return societyRepository.update(data);
  },
  delete: async (id: string) => {
    return societyRepository.deleteById(id);
  },
};

export default societyService;

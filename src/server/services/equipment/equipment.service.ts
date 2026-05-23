import type { FindQueryDTO } from '~/server/db/utility/types';
import equipmentRepository, {
  type EquipmentFormData,
} from '~/server/services/equipment/equipment.repository';
import { mapDbError } from '~/server/utils/db-error';

const equipmentService = {
  getById: async (id: string) => {
    return (await equipmentRepository.findById(id))[0];
  },
  find: async (data: FindQueryDTO) => {
    return equipmentRepository.find(data);
  },
  findAll: async () => {
    return equipmentRepository.findAll();
  },
  create: async (data: EquipmentFormData) => {
    try {
      return await equipmentRepository.create(data);
    } catch (error) {
      throw mapDbError(error);
    }
  },
  update: async (data: EquipmentFormData) => {
    try {
      return await equipmentRepository.update(data);
    } catch (error) {
      throw mapDbError(error);
    }
  },
  delete: async (id: string) => {
    return equipmentRepository.deleteById(id);
  },
};

export default equipmentService;

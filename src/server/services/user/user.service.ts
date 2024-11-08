import userRepository from "~/server/services/user/user.repository";
import type { FindQueryDTO } from "~/server/db/utility/types";

const userService = {
  getById: async (id: string) => {
    return userRepository.findById(id);
  },
  find: async (data: FindQueryDTO) => {
    return userRepository.find(data);
  },
};

export default userService;

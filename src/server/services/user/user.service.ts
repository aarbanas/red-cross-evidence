import userRepository from "~/server/services/user/user.repository";
import { type FindUserQuery } from "~/server/services/user/types";

const userService = {
  getById: async (id: string) => {
    return userRepository.findById(id);
  },
  find: async (data: FindUserQuery) => {
    return userRepository.find(data);
  },
};

export default userService;

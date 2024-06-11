import userRepository from "~/server/services/user/user.repository";

const userService = {
  getById: async (id: string) => {
    return userRepository.findById(id);
  },
  find: async () => {
    return userRepository.find();
  },
};

export default userService;

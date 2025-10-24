import userRepository from "~/server/services/user/user.repository";
import type { FindQueryDTO } from "~/server/db/utility/types";
import { type CreateUserDTO } from "~/server/services/user/types";
import { generateRandomHashedPassword } from "~/server/utils/password";

const userService = {
  getById: async (id: string) => {
    return userRepository.findById(id);
  },
  find: async (data: FindQueryDTO) => {
    return userRepository.find(data);
  },
  create: async (data: CreateUserDTO) => {
    validateUserCreation(data);

    const { hashedPassword } = await generateRandomHashedPassword();

    return userRepository.create(data, hashedPassword);
  },
};

const validateUserCreation = (data: CreateUserDTO) => {
  if (isNaN(Number(data.size.shoeSize))) {
    throw new Error("Shoe size must be a valid number");
  }
};

export default userService;

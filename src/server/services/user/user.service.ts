import { PrismaClient } from "@prisma/client";
import { type FindUserQuery } from "~/server/services/user/types";
import userRepository from "~/server/services/user/user.repository";
import { TRPCError } from "@trpc/server";
const prisma = new PrismaClient();

const userService = {
  get: async (id: string) => {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  },
  find: async (query: FindUserQuery) => {
    try {
      const { users, meta } = await userRepository.find(query);
      return {
        data: users,
        meta,
      };
    } catch (e) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
  },
};

export default userService;

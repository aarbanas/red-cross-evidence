import { z } from 'zod';
import { createUserSchema, paginationQuerySchema } from '~/server/api/schema';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import userService from '~/server/services/user/user.service';

export const userRouter = createTRPCRouter({
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await userService.getById(input.id);

      return result[0];
    }),
  find: protectedProcedure
    .input(paginationQuerySchema)
    .query(async ({ input }) => {
      return userService.find(input);
    }),
  create: protectedProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      return userService.create(input);
    }),
});

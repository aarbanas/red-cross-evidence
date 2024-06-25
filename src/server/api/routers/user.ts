import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import userService from "~/server/services/user/user.service";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await userService.getById(input.id);

      return result;
    }),
  find: protectedProcedure.query(async () => {
    const result = await userService.find();

    return result;
  }),
});

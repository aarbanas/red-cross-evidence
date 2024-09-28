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
  find: protectedProcedure
    .input(
      z.object({
        page: z.coerce.number(),
        limit: z.coerce.number().min(1).max(50),
        sort: z.string().or(z.array(z.string())).optional(),
        filter: z.record(z.string(), z.string()).optional(),
      }),
    )
    .query(async ({ input }) => {
      return userService.find(input);
    }),
});

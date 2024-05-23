import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import userService from "~/server/services/user/user.service";

export const userRouter = createTRPCRouter({
  find: protectedProcedure
    .input(
      z.object({
        page: z.string(),
        limit: z.string(),
        sort: z.string(),
        dir: z.string(),
        filter: z.any(),
      }),
    )
    .query(async ({ input }) => {
      const { data, meta } = await userService.find({ ...input });
      return { data, meta };
    }),
});

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import userService from "~/server/services/user/user.service";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

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
        page: z.string(),
        limit: z.string(),
        sort: z.string().or(z.array(z.string())),
        // filter: z.any(),
      }),
    )
    .query(async ({ input }) => {
      const { page, limit, sort } = input;
      if (isNaN(Number(page)) || isNaN(Number(limit)) || Number(limit) > 50) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid page or limit",
        });
      }

      return userService.find({
        page: Number(page),
        limit: Number(limit),
        sort,
      });
    }),
});

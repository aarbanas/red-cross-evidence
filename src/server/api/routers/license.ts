import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import licenseService from "~/server/services/license/license.service";

export const licenseRouter = createTRPCRouter({
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await licenseService.getById(input.id);

      return result;
    }),
  find: protectedProcedure
    .input(
      z.object({
        page: z.string(),
        limit: z.string(),
        sort: z.string().or(z.array(z.string())).optional(),
        filter: z.record(z.string(), z.string()).optional(),
      }),
    )
    .query(async ({ input }) => {
      const { page, limit, sort, filter } = input;
      if (isNaN(Number(page)) || isNaN(Number(limit)) || Number(limit) > 50) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid page or limit",
        });
      }

      return licenseService.find({
        page: Number(page),
        limit: Number(limit),
        sort,
        filter,
      });
    }),
});

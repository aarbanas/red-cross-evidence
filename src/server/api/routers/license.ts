import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
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
        page: z.coerce.number(),
        limit: z.coerce.number().min(1).max(50),
        sort: z.string().or(z.array(z.string())).optional(),
        filter: z.record(z.string(), z.string()).optional(),
      }),
    )
    .query(async ({ input }) => {
      return licenseService.find(input);
    }),
});

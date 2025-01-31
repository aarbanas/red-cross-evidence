import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { paginationQuerySchema } from "~/server/api/schema";
import licenseService from "~/server/services/license/license.service";

export const licenseRouter = createTRPCRouter({
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return licenseService.getById(input.id);
    }),
  find: protectedProcedure
    .input(paginationQuerySchema)
    .query(async ({ input }) => {
      return licenseService.find(input);
    }),
  findUniqueTypes: protectedProcedure.query(async () => {
    return licenseService.findUniqueTypes();
  }),
});

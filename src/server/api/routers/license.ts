import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { paginationQuerySchema } from "~/server/api/schema";
import licenseService from "~/server/services/license/license.service";

const licenseFormDataSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

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
  create: protectedProcedure
    .input(licenseFormDataSchema)
    .mutation(async ({ input }) => {
      return licenseService.create(input);
    }),
});

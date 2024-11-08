import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { paginationQuerySchema } from "~/server/api/schema";
import educationService from "~/server/services/education/education.service";

export const educationRouter = createTRPCRouter({
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await educationService.getById(input.id);

      return result;
    }),
  find: protectedProcedure
    .input(paginationQuerySchema)
    .query(async ({ input }) => {
      return educationService.find(input);
    }),
  getUniqueTypes: protectedProcedure.query(async () => {
    return educationService.getUniqueTypes();
  }),
});

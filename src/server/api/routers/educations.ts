import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { paginationQuerySchema } from "~/server/api/schema";
import educationService from "~/server/services/education/education.service";

export const educationRouter = createTRPCRouter({
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await educationService.getById(input.id);

      return result[0];
    }),
  find: protectedProcedure
    .input(paginationQuerySchema)
    .query(async ({ input }) => {
      return educationService.find(input);
    }),
  getUniqueTypes: protectedProcedure.query(async () => {
    return educationService.getUniqueTypes();
  }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await educationService.deleteById(input.id);
      return { success: true };
    }),
  create: protectedProcedure
    .input(
      z.object({
        type: z.string(),
        title: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await educationService.create(
        input.type,
        input.title,
        input.description,
      );
      return result;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.string(),
        title: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await educationService.update(
        input.id,
        input.type,
        input.title,
        input.description,
      );
      return result;
    }),
});

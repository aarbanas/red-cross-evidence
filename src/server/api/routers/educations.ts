import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { paginationQuerySchema } from "~/server/api/schema";
import educationService from "~/server/services/education/education.service";

export const educationFormDataSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  title: z.string(),
  description: z.string(),
  precondition: z.string().optional(),
  duration: z.string().optional(),
  lecturers: z.string().optional(),
  courseDuration: z.string().optional(),
  renewalDuration: z.string().optional(),
  topics: z.string().optional(),
});

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
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await educationService.deleteById(input.id);
      return { success: true };
    }),
  create: protectedProcedure
    .input(educationFormDataSchema)
    .mutation(async ({ input }) => {
      const result = await educationService.create(input);
      return result;
    }),
  update: protectedProcedure
    .input(educationFormDataSchema)
    .mutation(async ({ input }) => {
      const result = await educationService.update(input);
      return result;
    }),
});

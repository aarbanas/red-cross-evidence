import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { paginationQuerySchema } from "~/server/api/schema";
import educationService from "~/server/services/education/education.service";

const educationFormDataSchema = z.object({
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

const educationTermFormDataSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  dateFrom: z.string(),
  dateTo: z.string(),
  maxParticipants: z.number(),
  lecturers: z.string(),
  location: z.string(),
  educationId: z.string(),
});

export const educationRouter = createTRPCRouter({
  list: {
    findById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const result = await educationService.list.getById(input.id);

        return result;
      }),
    find: protectedProcedure
      .input(paginationQuerySchema)
      .query(async ({ input }) => {
        return educationService.list.find(input);
      }),
    getUniqueTypes: protectedProcedure.query(async () => {
      return educationService.list.getUniqueTypes();
    }),
    deleteById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await educationService.list.deleteById(input.id);
        return { success: true };
      }),
    create: protectedProcedure
      .input(educationFormDataSchema)
      .mutation(async ({ input }) => {
        const result = await educationService.list.create(input);
        return result;
      }),
    update: protectedProcedure
      .input(educationFormDataSchema)
      .mutation(async ({ input }) => {
        const result = await educationService.list.update(input);
        return result;
      }),
  },
  term: {
    findById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const result = await educationService.term.getById(input.id);

        return result;
      }),
    find: protectedProcedure
      .input(paginationQuerySchema)
      .query(async ({ input }) => {
        return educationService.term.find(input);
      }),
    deleteById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await educationService.term.deleteById(input.id);
        return { success: true };
      }),
    create: protectedProcedure
      .input(educationTermFormDataSchema)
      .mutation(async ({ input }) => {
        return educationService.term.create(input);
      }),
    update: protectedProcedure
      .input(educationTermFormDataSchema)
      .mutation(async ({ input }) => {
        return educationService.term.update(input);
      }),
  },
});

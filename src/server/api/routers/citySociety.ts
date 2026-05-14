import { z } from 'zod';
import { paginationQuerySchema } from '~/server/api/schema';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import citySocietyService from '~/server/services/citySociety/citySociety.service';

const citySocietyFormDataSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  address: z.string().min(1),
  director: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  cityId: z.string().optional(),
  societyId: z.string().optional(),
});

export const citySocietyRouter = createTRPCRouter({
  find: protectedProcedure
    .input(paginationQuerySchema)
    .query(async ({ input }) => {
      return citySocietyService.find(input);
    }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return citySocietyService.findById(input.id);
    }),
  findAll: protectedProcedure
    .input(z.object({ societyId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return citySocietyService.findAll(input?.societyId);
    }),
  create: protectedProcedure
    .input(citySocietyFormDataSchema)
    .mutation(async ({ input }) => {
      return citySocietyService.create(input);
    }),
  update: protectedProcedure
    .input(citySocietyFormDataSchema)
    .mutation(async ({ input }) => {
      return citySocietyService.update(input);
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return citySocietyService.delete(input.id);
    }),
});

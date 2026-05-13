import { z } from 'zod';
import { paginationQuerySchema } from '~/server/api/schema';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import societyService from '~/server/services/society/society.service';

const societyFormDataSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  address: z.string().min(1),
  director: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  cityId: z.string().optional(),
});

export const societyRouter = createTRPCRouter({
  find: protectedProcedure
    .input(paginationQuerySchema)
    .query(async ({ input }) => {
      return societyService.find(input);
    }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return societyService.findById(input.id);
    }),
  findAll: protectedProcedure.query(async () => {
    return societyService.findAll();
  }),
  create: protectedProcedure
    .input(societyFormDataSchema)
    .mutation(async ({ input }) => {
      return societyService.create(input);
    }),
  update: protectedProcedure
    .input(societyFormDataSchema)
    .mutation(async ({ input }) => {
      return societyService.update(input);
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return societyService.delete(input.id);
    }),
});

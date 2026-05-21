import { z } from 'zod';
import { paginationQuerySchema } from '~/server/api/schema';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import equipmentService from '~/server/services/equipment/equipment.service';

const equipmentFormDataSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  size: z.string(),
  quantity: z.number().int().positive(),
});

export const equipmentRouter = createTRPCRouter({
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return equipmentService.getById(input.id);
    }),
  find: protectedProcedure
    .input(paginationQuerySchema)
    .query(async ({ input }) => {
      return equipmentService.find(input);
    }),
  findAll: protectedProcedure.query(async () => {
    return equipmentService.findAll();
  }),
  create: protectedProcedure
    .input(equipmentFormDataSchema)
    .mutation(async ({ input }) => {
      return equipmentService.create(input);
    }),
  update: protectedProcedure
    .input(equipmentFormDataSchema)
    .mutation(async ({ input }) => {
      return equipmentService.update(input);
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return equipmentService.delete(input.id);
    }),
});

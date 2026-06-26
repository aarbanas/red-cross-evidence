import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import llmUsageService from '@/server/services/config/llmUsage.service';

export const configRouter = createTRPCRouter({
  getLlmUsage: protectedProcedure.query(async () => {
    return llmUsageService.getCurrentUsage();
  }),

  setMonthlyLimit: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100000) }))
    .mutation(async ({ input }) => {
      await llmUsageService.setMonthlyLimit(input.limit);
    }),
});

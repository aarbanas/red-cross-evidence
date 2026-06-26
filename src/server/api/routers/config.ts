import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import appConfigService from '@/server/services/config/appConfig.service';
import llmUsageService from '@/server/services/config/llmUsage.service';

const appConfigEntrySchema = z.object({
  key: z.string(),
  value: z.string().url(),
  metadata: z.string().nullable(),
});

export const configRouter = createTRPCRouter({
  getLlmUsage: protectedProcedure.query(async () => {
    return llmUsageService.getCurrentUsage();
  }),

  setMonthlyLimit: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100000) }))
    .mutation(async ({ input }) => {
      await llmUsageService.setMonthlyLimit(input.limit);
    }),

  getAppConfig: protectedProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      return appConfigService.getByKey(input.key);
    }),

  updateAppConfig: protectedProcedure
    .input(z.object({ entries: z.array(appConfigEntrySchema) }))
    .mutation(async ({ input }) => {
      await appConfigService.updateBatch(input.entries);
    }),
});

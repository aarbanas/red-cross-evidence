import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { paginationQuerySchema } from '@/server/api/schema';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import societyService from '@/server/services/society/society.service';
import synchronisationParserService from '@/server/services/synchronisationParser/synchronisationParser.service';
import {
  clearProgress,
  getProgress,
  setProgress,
} from '@/server/utils/syncProgress';
import {
  checkSyncAllowed,
  markSyncCompleted,
  SOCIETY_SYNC_KEY,
} from '@/server/utils/syncRateLimiter';

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
  syncProgress: protectedProcedure.query(async () => {
    return getProgress(SOCIETY_SYNC_KEY);
  }),
  sync: protectedProcedure.mutation(async () => {
    const check = await checkSyncAllowed(SOCIETY_SYNC_KEY);

    if (!check.allowed) {
      const nextSync = check.nextSyncAt.toLocaleString('hr-HR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: `Sinkronizacija je već pokrenuta danas. Sljedeća dostupna sinkronizacija: ${nextSync}.`,
      });
    }

    try {
      setProgress(SOCIETY_SYNC_KEY, 0, 0);
      const result = await synchronisationParserService.syncSocieties(
        (current, total) => {
          setProgress(SOCIETY_SYNC_KEY, current, total);
        },
      );
      await markSyncCompleted(SOCIETY_SYNC_KEY);

      return result;
    } catch (e) {
      console.error('Error during society synchronization:', e);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Došlo je do pogreške prilikom sinkronizacije društava.',
      });
    } finally {
      clearProgress(SOCIETY_SYNC_KEY);
    }
  }),
});

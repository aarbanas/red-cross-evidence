import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { paginationQuerySchema } from '@/server/api/schema';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { EducationType } from '@/server/db/schema';
import educationService from '@/server/services/education/education.service';
import synchronisationParserService from '@/server/services/synchronisationParser/synchronisationParser.service';
import {
  clearProgress,
  getProgress,
  setProgress,
} from '@/server/utils/syncProgress';
import {
  checkSyncAllowed,
  EDUCATION_SYNC_KEY,
  markSyncCompleted,
} from '@/server/utils/syncRateLimiter';

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
    getAllTitles: protectedProcedure
      .input(z.nativeEnum(EducationType).optional())
      .query(async ({ input }) => {
        return educationService.list.getAllTitles(input);
      }),
    syncProgress: protectedProcedure.query(async () => {
      return getProgress(EDUCATION_SYNC_KEY);
    }),
    sync: protectedProcedure.mutation(async () => {
      const check = await checkSyncAllowed(EDUCATION_SYNC_KEY);

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
        setProgress(EDUCATION_SYNC_KEY, 0, 0);
        const result = await synchronisationParserService.syncEducations(
          (current, total) => {
            setProgress(EDUCATION_SYNC_KEY, current, total);
          },
        );
        await markSyncCompleted(EDUCATION_SYNC_KEY);

        return result;
      } catch (e) {
        console.error('Error during education synchronization:', e);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'Došlo je do pogreške prilikom sinkronizacije obrazovnih oblika.',
        });
      } finally {
        clearProgress(EDUCATION_SYNC_KEY);
      }
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
    getParticipants: protectedProcedure
      .input(z.object({ termId: z.string() }))
      .query(async ({ input }) => {
        return educationService.term.getParticipants(input.termId);
      }),
    addParticipant: protectedProcedure
      .input(z.object({ termId: z.string(), profileId: z.string() }))
      .mutation(async ({ input }) => {
        await educationService.term.addParticipant(
          input.termId,
          input.profileId,
        );
        return { success: true };
      }),
    removeParticipant: protectedProcedure
      .input(z.object({ termId: z.string(), profileId: z.string() }))
      .mutation(async ({ input }) => {
        await educationService.term.removeParticipant(
          input.termId,
          input.profileId,
        );
        return { success: true };
      }),
    findByEducationId: protectedProcedure
      .input(
        z.object({
          educationId: z.string(),
          excludeProfileId: z.string().optional(),
        }),
      )
      .query(async ({ input }) => {
        return educationService.term.findByEducationId(
          input.educationId,
          input.excludeProfileId,
        );
      }),
  },
});

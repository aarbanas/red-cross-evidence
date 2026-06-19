import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { env } from '@/env';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { buildSystemPrompt } from '@/server/search/buildSearchPrompt';
import { volunteerSearchQuerySchema } from '@/server/search/volunteerSearchFields';
import userService from '@/server/services/user/user.service';

export const searchRouter = createTRPCRouter({
  parsePrompt: protectedProcedure
    .input(z.object({ prompt: z.string().min(1) }))
    .mutation(async ({ input }) => {
      let responseText: string;

      try {
        const response = await fetch(`${env.OLLAMA_BASE_URL}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: env.OLLAMA_MODEL,
            prompt: input.prompt,
            system: buildSystemPrompt(),
            format: 'json',
            stream: false,
            options: { temperature: 0.1 },
          }),
        });

        if (!response.ok) {
          throw new Error(`Ollama returned ${response.status}`);
        }

        const json = (await response.json()) as { response: string };
        responseText = json.response;
        console.log(responseText);
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Nije moguće obraditi upit. Pokušajte ga preformulirati.',
        });
      }

      const parsed = volunteerSearchQuerySchema.safeParse(
        JSON.parse(responseText),
      );

      if (!parsed.success) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Nije moguće obraditi upit. Pokušajte ga preformulirati.',
        });
      }

      return parsed.data;
    }),

  advancedSearch: protectedProcedure
    .input(
      z.object({
        filters: volunteerSearchQuerySchema,
        page: z.number().default(0),
        limit: z.number().min(1).max(50).default(10),
      }),
    )
    .query(async ({ input }) => {
      return userService.advancedSearch(input);
    }),
});

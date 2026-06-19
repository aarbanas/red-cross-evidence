import { TRPCError } from '@trpc/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { env } from '@/env';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { buildSystemPrompt } from '@/server/search/buildSearchPrompt';
import { volunteerSearchQuerySchema } from '@/server/search/volunteerSearchFields';
import userService from '@/server/services/user/user.service';

const OLLAMA_MODEL = 'llama3.2:3b';
const OPENAI_MODEL = 'gpt-4o-mini';
let client: OpenAI | null = null;

const getLLMResponse = async (prompt: string): Promise<string> => {
  if (env.LLM_PROVIDER === 'openai') {
    if (!client) {
      client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    }

    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    return completion.choices[0]?.message.content ?? '';
  }

  const response = await fetch(`${env.OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
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

  return json.response;
};

export const searchRouter = createTRPCRouter({
  parsePrompt: protectedProcedure
    .input(z.object({ prompt: z.string().min(1) }))
    .mutation(async ({ input }) => {
      let responseText: string;

      try {
        responseText = await getLLMResponse(input.prompt);
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

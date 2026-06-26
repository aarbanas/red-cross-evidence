import 'server-only';

import { TRPCError } from '@trpc/server';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/server/db';
import { llmConfig, llmUsage } from '@/server/db/schema';

const DEFAULT_MONTHLY_LIMIT = 100;

const getCurrentYearMonth = () => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
};

const getMonthlyLimit = async (): Promise<number> => {
  const [config] = await db.select().from(llmConfig);
  return config?.monthlyLimit ?? DEFAULT_MONTHLY_LIMIT;
};

const checkAndIncrementUsage = async (): Promise<void> => {
  const { year, month } = getCurrentYearMonth();
  const limit = await getMonthlyLimit();

  const [current] = await db
    .select()
    .from(llmUsage)
    .where(and(eq(llmUsage.year, year), eq(llmUsage.month, month)));

  if (current && current.callCount >= limit) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message:
        'Dostignut je mjesečni limit pretraživanja. Pokušajte ponovo sljedeći mjesec.',
    });
  }

  await db
    .insert(llmUsage)
    .values({ year, month, callCount: 1 })
    .onConflictDoUpdate({
      target: [llmUsage.year, llmUsage.month],
      set: { callCount: sql`${llmUsage.callCount} + 1` },
    });
};

const getCurrentUsage = async (): Promise<{
  callCount: number;
  limit: number;
  year: number;
  month: number;
}> => {
  const { year, month } = getCurrentYearMonth();
  const limit = await getMonthlyLimit();

  const [current] = await db
    .select()
    .from(llmUsage)
    .where(and(eq(llmUsage.year, year), eq(llmUsage.month, month)));

  return {
    callCount: current?.callCount ?? 0,
    limit,
    year,
    month,
  };
};

const setMonthlyLimit = async (limit: number): Promise<void> => {
  const [existing] = await db.select().from(llmConfig);

  if (existing) {
    await db.update(llmConfig).set({ monthlyLimit: limit });
  } else {
    await db.insert(llmConfig).values({ monthlyLimit: limit });
  }
};

const llmUsageService = {
  checkAndIncrementUsage,
  getCurrentUsage,
  setMonthlyLimit,
};

export default llmUsageService;

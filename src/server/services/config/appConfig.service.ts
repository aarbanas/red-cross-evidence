import 'server-only';

import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { appConfig } from '@/server/db/schema';

export type AppConfigEntry = {
  id: string;
  key: string;
  value: string;
  metadata: string | null;
};

const getByKey = async (key: string): Promise<AppConfigEntry[]> => {
  return db.select().from(appConfig).where(eq(appConfig.key, key));
};

const getRequiredByKey = async (key: string): Promise<AppConfigEntry[]> => {
  const rows = await getByKey(key);

  if (!rows.length) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `Konfiguracija '${key}' nije pronađena. Pokrenite db:seed:config.`,
    });
  }

  return rows;
};

const getSingle = async (key: string): Promise<string> => {
  const rows = await getRequiredByKey(key);
  return rows[0]!.value;
};

const updateBatch = async (
  entries: { key: string; value: string; metadata: string | null }[],
): Promise<void> => {
  await db.transaction(async (tx) => {
    for (const entry of entries) {
      if (entry.metadata !== null) {
        await tx
          .update(appConfig)
          .set({ value: entry.value })
          .where(
            and(
              eq(appConfig.key, entry.key),
              eq(appConfig.metadata, entry.metadata),
            ),
          );
      } else {
        await tx
          .update(appConfig)
          .set({ value: entry.value })
          .where(and(eq(appConfig.key, entry.key)));
      }
    }
  });
};

const appConfigService = {
  getByKey,
  getRequiredByKey,
  getSingle,
  updateBatch,
};

export default appConfigService;

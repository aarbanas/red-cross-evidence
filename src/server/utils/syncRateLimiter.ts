import 'server-only';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const TTL_SECONDS = 24 * 60 * 60;

export const EDUCATION_SYNC_KEY = 'sync:educations';
export const SOCIETY_SYNC_KEY = 'sync:societies';

export const checkSyncAllowed = async (
  key: string,
): Promise<{ allowed: true } | { allowed: false; nextSyncAt: Date }> => {
  const ttlMs = await redis.pttl(key);

  // ttlMs > 0 means key exists with a TTL
  if (ttlMs > 0) {
    return { allowed: false, nextSyncAt: new Date(Date.now() + ttlMs) };
  }

  return { allowed: true };
};

export const markSyncCompleted = async (key: string): Promise<void> => {
  await redis.set(key, 1, { ex: TTL_SECONDS });
};

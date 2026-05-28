import 'server-only';

type ProgressState = { current: number; total: number };

const store = new Map<string, ProgressState>();

export const setProgress = (key: string, current: number, total: number) => {
  store.set(key, { current, total });
};

export const getProgress = (key: string): ProgressState | null => {
  return store.get(key) ?? null;
};

export const clearProgress = (key: string) => {
  store.delete(key);
};

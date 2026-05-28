'use client';
import { RefreshCw } from 'lucide-react';

type Props = {
  current: number;
  total: number;
};

const SyncProgressOverlay = ({ current, total }: Props) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-8 shadow-xl">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="font-semibold text-lg">Sinkronizacija u tijeku...</p>
        {percentage !== null ? (
          <>
            <div className="h-2 w-64 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-gray-500 text-sm">
              {current} / {total} ({percentage}%)
            </p>
          </>
        ) : (
          <p className="text-gray-500 text-sm">Prikupljanje podataka...</p>
        )}
      </div>
    </div>
  );
};

export default SyncProgressOverlay;

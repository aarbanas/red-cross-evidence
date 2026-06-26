'use client';

import { memo, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/mainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { api } from '@/trpc/react';

const MONTH_NAMES = [
  'Siječanj',
  'Veljača',
  'Ožujak',
  'Travanj',
  'Svibanj',
  'Lipanj',
  'Srpanj',
  'Kolovoz',
  'Rujan',
  'Listopad',
  'Studeni',
  'Prosinac',
];

const ConfigPage = () => {
  const { data, isLoading, refetch } = api.config.getLlmUsage.useQuery();
  const [limitInput, setLimitInput] = useState('');

  useEffect(() => {
    if (data) {
      setLimitInput(String(data.limit));
    }
  }, [data]);

  const setLimit = api.config.setMonthlyLimit.useMutation({
    onSuccess: async () => {
      await refetch();
      toast.success('Limit je uspješno ažuriran.');
    },
    onError: () => {
      toast.error('Greška pri ažuriranju limita.');
    },
  });

  const handleSaveLimit = () => {
    const val = Number(limitInput);

    if (!Number.isInteger(val) || val < 1 || val > 100000) return;

    setLimit.mutate({ limit: val });
  };

  const monthName = data ? (MONTH_NAMES[data.month - 1] ?? '') : '';
  const percentage = data ? Math.round((data.callCount / data.limit) * 100) : 0;

  return (
    <MainLayout headerChildren={<span>Konfiguracija</span>}>
      <Card className="p-6">
        <h2 className="mb-4 font-semibold text-lg">Korištenje ChatGPT-a</h2>

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Učitavanje...</p>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-muted-foreground text-sm">
              {monthName} {data?.year}
            </p>
            <Progress value={percentage} className="h-2" />
            <p className="text-sm">
              <span className="font-medium">{data?.callCount}</span>
              <span className="text-muted-foreground">
                {' '}
                / {data?.limit} poziva
              </span>
            </p>
            <div className="flex items-end gap-2 pt-2">
              <div className="flex flex-col gap-1">
                <Label className="text-sm">Mjesečni limit</Label>
                <Input
                  type="number"
                  min={1}
                  max={100000}
                  value={limitInput}
                  onChange={(e) => setLimitInput(e.target.value)}
                  className="w-36"
                />
              </div>
              <Button
                onClick={handleSaveLimit}
                disabled={setLimit.isPending}
                size="sm"
              >
                {setLimit.isPending ? 'Spremanje...' : 'Spremi'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </MainLayout>
  );
};

export default memo(ConfigPage);

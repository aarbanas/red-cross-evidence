'use client';

import { memo, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/mainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const URL_REGEX = /^https?:\/\/.+/;

type ConfigEntry = {
  id: string;
  key: string;
  value: string;
  metadata: string | null;
};

type HckUrlsTabProps = {
  overviewKey: string;
  scrapeKey: string;
  successMessage: string;
};

const HckUrlsTab = ({
  overviewKey,
  scrapeKey,
  successMessage,
}: HckUrlsTabProps) => {
  const { data: overviewData, isLoading: overviewLoading } =
    api.config.getAppConfig.useQuery({ key: overviewKey });
  const { data: scrapeData, isLoading: scrapeLoading } =
    api.config.getAppConfig.useQuery({ key: scrapeKey });

  const allRows: ConfigEntry[] = [
    ...(overviewData ?? []),
    ...(scrapeData ?? []),
  ];

  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const rows = [...(overviewData ?? []), ...(scrapeData ?? [])];
    if (!rows.length) return;
    setValues((prev) => {
      const next = { ...prev };
      for (const row of rows) {
        if (!(row.id in next)) {
          next[row.id] = row.value;
        }
      }
      return next;
    });
  }, [overviewData, scrapeData]);

  const updateMutation = api.config.updateAppConfig.useMutation({
    onSuccess: () => toast.success(successMessage),
    onError: () => toast.error('Greška pri ažuriranju konfiguracije.'),
  });

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    for (const row of allRows) {
      const val = values[row.id] ?? '';
      if (!URL_REGEX.test(val)) {
        newErrors[row.id] = 'Unesite ispravan HTTP/HTTPS URL.';
      }
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    updateMutation.mutate({
      entries: allRows.map((row) => ({
        key: row.key,
        value: values[row.id] ?? row.value,
        metadata: row.metadata,
      })),
    });
  };

  const isLoading = overviewLoading || scrapeLoading;

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Učitavanje...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {allRows.map((row) => (
        <div key={row.id} className="flex flex-col gap-1">
          <Label className="text-sm">{row.metadata ?? 'URL pregleda'}</Label>
          <Input
            value={values[row.id] ?? ''}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, [row.id]: e.target.value }))
            }
            className={errors[row.id] ? 'border-destructive' : ''}
          />
          {errors[row.id] && (
            <p className="text-destructive text-xs">{errors[row.id]}</p>
          )}
        </div>
      ))}
      <Button
        onClick={handleSave}
        disabled={updateMutation.isPending}
        size="sm"
        className="mt-2 self-start"
      >
        {updateMutation.isPending ? 'Spremanje...' : 'Spremi sve'}
      </Button>
    </div>
  );
};

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
      <Tabs defaultValue="llm">
        <TabsList>
          <TabsTrigger value="llm">LLM</TabsTrigger>
          <TabsTrigger value="societies">Društva</TabsTrigger>
          <TabsTrigger value="educations">Edukacije</TabsTrigger>
        </TabsList>

        <TabsContent value="llm">
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
        </TabsContent>

        <TabsContent value="societies">
          <Card className="p-6">
            <h2 className="mb-4 font-semibold text-lg">URL-ovi društava</h2>
            <HckUrlsTab
              overviewKey="society_overview_url"
              scrapeKey="society_scrape_url"
              successMessage="URL-ovi društava su uspješno ažurirani."
            />
          </Card>
        </TabsContent>

        <TabsContent value="educations">
          <Card className="p-6">
            <h2 className="mb-4 font-semibold text-lg">URL-ovi edukacija</h2>
            <HckUrlsTab
              overviewKey="education_overview_url"
              scrapeKey="education_category_url"
              successMessage="URL-ovi edukacija su uspješno ažurirani."
            />
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default memo(ConfigPage);

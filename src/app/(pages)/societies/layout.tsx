'use client';

import { Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { toast } from 'react-toastify';
import Tabs, { type TabProp } from '@/components/atoms/Tabs';
import MainLayout from '@/components/layout/mainLayout';
import SyncProgressOverlay from '@/components/organisms/SyncProgressOverlay';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';

const SocietiesLayout: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const syncMutation = api.society.sync.useMutation({
    onSuccess: ({ societiesCount, citySocietiesCount }) =>
      toast.success(
        `Sinkronizirano ${societiesCount} društava i ${citySocietiesCount} gradskih društava.`,
      ),
    onError: (error) =>
      toast.error(
        error.data?.code === 'TOO_MANY_REQUESTS'
          ? error.message
          : 'Greška pri sinkronizaciji.',
      ),
  });

  const { data: syncProgress } = api.society.syncProgress.useQuery(undefined, {
    enabled: syncMutation.isPending,
    refetchInterval: syncMutation.isPending ? 500 : false,
  });

  const tabsData: TabProp[] = [
    {
      label: 'Županijska društva',
      link: 'list',
    },
    {
      label: 'Gradska društva',
      link: 'city',
    },
  ];

  const createHref = pathname.includes('/societies/city')
    ? '/societies/city/create'
    : '/societies/list/create';

  const createLabel = pathname.includes('/societies/city')
    ? 'Novo gradsko društvo'
    : 'Novo županijsko društvo';

  return (
    <>
      {syncMutation.isPending && (
        <SyncProgressOverlay
          current={syncProgress?.current ?? 0}
          total={syncProgress?.total ?? 0}
        />
      )}
      <MainLayout
        headerChildren={
          <div className="flex w-full items-center gap-2">
            Društva
            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                size="sm"
                showLoading={syncMutation.isPending}
                disabled={syncMutation.isPending}
                onClick={() => syncMutation.mutate()}
              >
                <RefreshCw className="h-4 w-4" />
                Sinkroniziraj
              </Button>
              <Button asChild size="sm">
                <Link href={createHref}>
                  <Plus className="h-4 w-4" />
                  {createLabel}
                </Link>
              </Button>
            </div>
          </div>
        }
      >
        <div>
          <Tabs tabs={tabsData} basePath="/societies" />
          <main>{children}</main>
        </div>
      </MainLayout>
    </>
  );
};

export default SocietiesLayout;

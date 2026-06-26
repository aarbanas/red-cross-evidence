'use client';
import { Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type FC, type PropsWithChildren, useState } from 'react';
import { toast } from 'react-toastify';
import Tabs, { type TabProp } from '@/components/atoms/Tabs';
import MainLayout from '@/components/layout/mainLayout';
import SyncProgressOverlay from '@/components/organisms/SyncProgressOverlay';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { api } from '@/trpc/react';

const TERM_DETAIL_REGEX = /\/educations\/term\/[0-9a-f-]{36}(\/|$)/;
const LIST_DETAIL_REGEX = /\/educations\/list\/([0-9a-f-]{36}|create)(\/|$)/;

const EducationLayout: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const { data: overviewConfig } = api.config.getAppConfig.useQuery({
    key: 'education_overview_url',
  });
  const educationOverviewUrl = overviewConfig?.[0]?.value;
  const syncMutation = api.education.list.sync.useMutation({
    onSuccess: ({ count }) =>
      toast.success(`Sinkronizirano ${count} edukacija.`),
    onError: (error) =>
      toast.error(
        error.data?.code === 'TOO_MANY_REQUESTS'
          ? error.message
          : 'Greška pri sinkronizaciji.',
      ),
  });

  const { data: syncProgress } = api.education.list.syncProgress.useQuery(
    undefined,
    {
      enabled: syncMutation.isPending,
      refetchInterval: syncMutation.isPending ? 500 : false,
    },
  );

  const tabsData: TabProp[] = [
    {
      label: 'Termini',
      link: 'term',
    },
    {
      label: 'Popis',
      link: 'list',
    },
  ];

  const createHref = pathname.includes('/educations/list')
    ? '/educations/list/create'
    : '/educations/term/create';

  const createLabel = pathname.includes('/educations/list')
    ? 'Nova edukacija'
    : 'Novi termin';

  const isTermDetail =
    TERM_DETAIL_REGEX.test(pathname) || LIST_DETAIL_REGEX.test(pathname);

  return (
    <>
      {syncMutation.isPending && (
        <SyncProgressOverlay
          current={syncProgress?.current ?? 0}
          total={syncProgress?.total ?? 0}
        />
      )}
      <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sinkronizacija edukacija</DialogTitle>
            <DialogDescription>
              Pokretanjem sinkronizacije preuzet će se sve edukacije sa stranice{' '}
              {educationOverviewUrl && (
                <Link
                  href={educationOverviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer underline"
                >
                  {educationOverviewUrl}
                </Link>
              )}{' '}
              i usporediti s postojećim podacima u bazi. Nove edukacije bit će
              dodane, a postojeće ažurirane. Ovaj proces može potrajati nekoliko
              minuta.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSyncDialogOpen(false)}>
              Odustani
            </Button>
            <Button
              onClick={() => {
                setSyncDialogOpen(false);
                syncMutation.mutate();
              }}
            >
              Sinkroniziraj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <MainLayout
        headerChildren={
          <div className="flex w-full items-center gap-2">
            Edukacije
            <div className="ml-auto flex gap-2">
              {pathname.includes('/educations/list') &&
                !LIST_DETAIL_REGEX.test(pathname) && (
                  <Button
                    variant="outline"
                    size="sm"
                    showLoading={syncMutation.isPending}
                    disabled={syncMutation.isPending}
                    onClick={() => setSyncDialogOpen(true)}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Sinkroniziraj
                  </Button>
                )}
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
          {!isTermDetail && <Tabs tabs={tabsData} basePath="/educations" />}
          <main>{children}</main>
        </div>
      </MainLayout>
    </>
  );
};

export default EducationLayout;

'use client';
import { Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { toast } from 'react-toastify';
import Tabs, { type TabProp } from '@/components/atoms/Tabs';
import MainLayout from '@/components/layout/mainLayout';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';

const TERM_DETAIL_REGEX = /\/educations\/term\/[0-9a-f-]{36}(\/|$)/;
const LIST_DETAIL_REGEX = /\/educations\/list\/([0-9a-f-]{36}|create)(\/|$)/;

const EducationLayout: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const syncMutation = api.education.list.sync.useMutation({
    onSuccess: ({ count }) =>
      toast.success(`Sinkronizirano ${count} edukacija.`),
    onError: () => toast.error('Greška pri sinkronizaciji.'),
  });

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
    <MainLayout
      headerChildren={
        <div className="flex w-full items-center gap-2">
          Edukacije
          <div className="ml-auto flex gap-2">
            {pathname.includes('/educations/list') && (
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
  );
};

export default EducationLayout;

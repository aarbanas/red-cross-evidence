'use client';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import Tabs, { type TabProp } from '@/components/atoms/Tabs';
import MainLayout from '@/components/layout/mainLayout';
import { Button } from '@/components/ui/button';

const TERM_DETAIL_REGEX = /\/educations\/term\/[0-9a-f-]{36}(\/|$)/;
const LIST_DETAIL_REGEX = /\/educations\/list\/([0-9a-f-]{36}|create)(\/|$)/;

const EducationLayout: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();

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
        <div className="flex w-full">
          Edukacije
          <Button asChild size="sm" className="ml-auto gap-2">
            <Link href={createHref}>
              <Plus className="h-4 w-4" />
              {createLabel}
            </Link>
          </Button>
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

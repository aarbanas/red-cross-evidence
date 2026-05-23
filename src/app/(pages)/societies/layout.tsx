'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { Button } from '~/components/atoms/Button';
import Tabs, { type TabProp } from '~/components/atoms/Tabs';
import MainLayout from '~/components/layout/mainLayout';

const SocietiesLayout: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();

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
    <MainLayout
      headerChildren={
        <div className="flex w-full">
          Društva
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
        <Tabs tabs={tabsData} basePath="/societies" />
        <main>{children}</main>
      </div>
    </MainLayout>
  );
};

export default SocietiesLayout;

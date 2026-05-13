'use client';

import type { FC, PropsWithChildren } from 'react';
import Tabs, { type TabProp } from '~/components/atoms/Tabs';
import MainLayout from '~/components/layout/mainLayout';

const SocietiesLayout: FC<PropsWithChildren> = ({ children }) => {
  const tabsData: TabProp[] = [
    {
      label: 'Društva',
      link: 'list',
    },
    {
      label: 'Gradska društva',
      link: 'city',
    },
  ];

  return (
    <MainLayout headerChildren={<div>Društva</div>}>
      <div>
        <Tabs tabs={tabsData} basePath="/societies" />
        <main>{children}</main>
      </div>
    </MainLayout>
  );
};

export default SocietiesLayout;

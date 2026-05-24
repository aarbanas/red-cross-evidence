'use client';
import { useParams } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import Tabs, { type TabProp } from '@/components/atoms/Tabs';

const EducationTermEditLayout: FC<PropsWithChildren> = ({ children }) => {
  const { id } = useParams<{ id: string }>();

  const tabsData: TabProp[] = [
    { label: 'Termin', link: 'edit' },
    { label: 'Sudionici', link: 'participants' },
  ];

  return (
    <div>
      <Tabs tabs={tabsData} basePath={`/educations/term/${id}`} />
      <main className="pt-4">{children}</main>
    </div>
  );
};

export default EducationTermEditLayout;

'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import Tabs, { type TabProp } from '@/components/atoms/Tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { api } from '@/trpc/react';

const EducationTermEditLayout: FC<PropsWithChildren> = ({ children }) => {
  const { id } = useParams<{ id: string }>();

  const { data: term } = api.education.term.findById.useQuery({ id });

  const tabsData: TabProp[] = [
    { label: 'Termin', link: 'edit' },
    { label: 'Sudionici', link: 'participants' },
  ];

  return (
    <div>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/educations/term">Termini</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{term?.title ?? '...'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Tabs tabs={tabsData} basePath={`/educations/term/${id}`} />
      <main className="pt-4">{children}</main>
    </div>
  );
};

export default EducationTermEditLayout;

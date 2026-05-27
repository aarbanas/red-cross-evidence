'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { api } from '@/trpc/react';

const EducationListDetailLayout: FC<PropsWithChildren> = ({ children }) => {
  const { id } = useParams<{ id: string }>();

  const { data: education } = api.education.list.findById.useQuery(
    { id },
    { enabled: id !== 'create' },
  );

  const pageLabel =
    id === 'create' ? 'Nova edukacija' : (education?.title ?? '...');

  return (
    <div>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/educations/list">Popis</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{pageLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <main>{children}</main>
    </div>
  );
};

export default EducationListDetailLayout;

'use client';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useCallback, useMemo, useState } from 'react';
import Licences from '@/app/(pages)/licenses/_components/Licences';
import LicencesSearch from '@/app/(pages)/licenses/_components/LicencesSearch';
import type { DropdownOption } from '@/components/atoms/Dropdown';
import MainLayout from '@/components/layout/mainLayout';
import LoadingSpinner from '@/components/organisms/loadingSpinner/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';

const LicencePage = () => {
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );

  const { data } = api.license.findUniqueTypes.useQuery();
  const types: DropdownOption[] | undefined = useMemo(
    () =>
      data?.map(({ type }) => ({
        value: type,
        key: type,
      })),
    [data],
  );

  const handleSearch = useCallback((newFilter?: Record<string, string>) => {
    setFilter(newFilter);
  }, []);

  return (
    <MainLayout
      headerChildren={
        <div className="flex w-full">
          Licence
          <Button asChild size="sm" className="ml-auto gap-2">
            <Link href="/licenses/create">
              <Plus className="h-4 w-4" />
              Nova licence
            </Link>
          </Button>
        </div>
      }
    >
      <div className="flex">
        <LicencesSearch onSearch={handleSearch} types={types} />
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <Licences filter={filter} />
      </Suspense>
    </MainLayout>
  );
};

export default LicencePage;

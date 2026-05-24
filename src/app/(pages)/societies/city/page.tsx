'use client';

import { Suspense, useCallback, useMemo, useState } from 'react';
import CitySocieties from '@/app/(pages)/societies/_components/CitySocieties';
import CitySocietiesSearch from '@/app/(pages)/societies/_components/CitySocietiesSearch';
import type { DropdownOption } from '@/components/atoms/Dropdown';
import TabLayout from '@/components/layout/tabLayout';
import LoadingSpinner from '@/components/organisms/loadingSpinner/LoadingSpinner';
import { api } from '@/trpc/react';

const CitySocietiesPage = () => {
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );

  const { data } = api.society.findAll.useQuery();
  const societies: DropdownOption[] | undefined = useMemo(
    () =>
      data?.map(({ name, id }) => ({
        value: name,
        key: id,
      })),
    [data],
  );

  const handleSearch = useCallback((newFilter?: Record<string, string>) => {
    setFilter(newFilter);
  }, []);

  return (
    <TabLayout>
      <div className="flex">
        <CitySocietiesSearch onSearch={handleSearch} societies={societies} />
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <CitySocieties filter={filter} />
      </Suspense>
    </TabLayout>
  );
};

export default CitySocietiesPage;

'use client';

import { Suspense, useCallback, useState } from 'react';
import Societies from '@/app/(pages)/societies/_components/Societies';
import SocietiesSearch from '@/app/(pages)/societies/_components/SocietiesSearch';
import TabLayout from '@/components/layout/tabLayout';
import LoadingSpinner from '@/components/organisms/loadingSpinner/LoadingSpinner';

const SocietiesListPage = () => {
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );

  const handleSearch = useCallback((newFilter?: Record<string, string>) => {
    setFilter(newFilter);
  }, []);

  return (
    <TabLayout>
      <div className="flex">
        <SocietiesSearch onSearch={handleSearch} />
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <Societies filter={filter} />
      </Suspense>
    </TabLayout>
  );
};

export default SocietiesListPage;

'use client';

import { CirclePlus } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import Societies from '~/app/(pages)/societies/_components/Societies';
import SocietiesSearch from '~/app/(pages)/societies/_components/SocietiesSearch';
import TabLayout from '~/components/layout/tabLayout';

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

        <div className="ml-auto rounded-md border px-2">
          <Link
            className="flex gap-2"
            href={{ pathname: '/societies/list/create' }}
          >
            <CirclePlus />
            Kreiraj novo društvo
          </Link>
        </div>
      </div>

      <Societies filter={filter} />
    </TabLayout>
  );
};

export default SocietiesListPage;

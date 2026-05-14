'use client';

import { CirclePlus } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import CitySocieties from '~/app/(pages)/societies/_components/CitySocieties';
import CitySocietiesSearch from '~/app/(pages)/societies/_components/CitySocietiesSearch';
import type { DropdownOption } from '~/components/atoms/Dropdown';
import TabLayout from '~/components/layout/tabLayout';
import { api } from '~/trpc/react';

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

        <div className="ml-auto rounded-md border px-2">
          <Link
            className="flex gap-2"
            href={{ pathname: '/societies/city/create' }}
          >
            <CirclePlus />
            Kreiraj novo gradsko društvo
          </Link>
        </div>
      </div>

      <CitySocieties filter={filter} />
    </TabLayout>
  );
};

export default CitySocietiesPage;

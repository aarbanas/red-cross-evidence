'use client';
import { CirclePlus } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { translateEducationType } from '~/app/(pages)/educations/utils';
import type { DropdownOption } from '~/components/atoms/Dropdown';
import TabLayout from '~/components/layout/tabLayout';
import type { EducationType } from '~/server/db/schema';
import { api } from '~/trpc/react';
import EducationsList from './EducationsList';
import EducationsListSearch from './EducationsListSearch';

const EducationsListTab = () => {
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );

  const { data } = api.education.list.getUniqueTypes.useQuery();
  const types: DropdownOption[] | undefined = useMemo(
    () =>
      data?.map(({ type }) => ({
        value: translateEducationType(type as EducationType),
        key: type,
      })),
    [data],
  );

  const handleSearch = (newFilter: Record<string, string> | undefined) => {
    setFilter(newFilter);
  };

  return (
    <TabLayout>
      <div className="flex">
        <EducationsListSearch onSearch={handleSearch} types={types} />
        <div className="ml-auto rounded-md border px-2">
          <Link
            className="flex gap-2"
            href={{
              pathname: `/educations/list/create`,
            }}
          >
            <CirclePlus />
            Kreiraj novu edukaciju
          </Link>
        </div>
      </div>

      <EducationsList filter={filter} />
    </TabLayout>
  );
};

export default EducationsListTab;

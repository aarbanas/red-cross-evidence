'use client';
import { Suspense, useMemo, useState } from 'react';
import { translateEducationType } from '~/app/(pages)/educations/utils';
import type { DropdownOption } from '~/components/atoms/Dropdown';
import TabLayout from '~/components/layout/tabLayout';
import LoadingSpinner from '~/components/organisms/loadingSpinner/LoadingSpinner';
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
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <EducationsList filter={filter} />
      </Suspense>
    </TabLayout>
  );
};

export default EducationsListTab;

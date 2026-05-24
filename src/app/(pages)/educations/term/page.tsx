'use client';
import { Suspense, useState } from 'react';
import EducationsTerm from '@/app/(pages)/educations/term/EducationsTerm';
import EducationsTermSearch from '@/app/(pages)/educations/term/EducationsTermSearch';
import TabLayout from '@/components/layout/tabLayout';
import LoadingSpinner from '@/components/organisms/loadingSpinner/LoadingSpinner';

const EducationsEvidencePage = () => {
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );

  const handleSearch = (newFilter: Record<string, string> | undefined) => {
    setFilter(newFilter);
  };

  return (
    <TabLayout>
      <div className="flex">
        <EducationsTermSearch onSearch={handleSearch} />
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <EducationsTerm filter={filter} />
      </Suspense>
    </TabLayout>
  );
};

export default EducationsEvidencePage;

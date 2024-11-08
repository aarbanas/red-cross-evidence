"use client";
import { PaginationProvider } from "~/components/organisms/pagination/PaginationContext";
import { useMemo, useState } from "react";
import EducationsListSearch from "~/app/(pages)/educations/_components/List/EducationsListSearch";
import EducationsList from "~/app/(pages)/educations/_components/List/EducationsList";
import TabLayout from "~/components/layout/tabLayout";
import { api } from "~/trpc/react";

const EducationsListTab = () => {
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );

  const { data } = api.education.getUniqueTypes.useQuery();
  const types = useMemo(() => data?.map(({ type }) => type), [data]);

  const handleSearch = (newFilter: Record<string, string> | undefined) => {
    setFilter(newFilter);
  };

  return (
    <TabLayout>
      <EducationsListSearch onSearch={handleSearch} types={types} />

      <PaginationProvider>
        <EducationsList filter={filter} />
      </PaginationProvider>
    </TabLayout>
  );
};

export default EducationsListTab;

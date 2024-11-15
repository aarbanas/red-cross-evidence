"use client";
import { PaginationProvider } from "~/components/organisms/pagination/PaginationContext";
import { useMemo, useState } from "react";
import EducationsListSearch from "~/app/(pages)/educations/_components/List/EducationsListSearch";
import EducationsList from "~/app/(pages)/educations/_components/List/EducationsList";
import TabLayout from "~/components/layout/tabLayout";
import { api } from "~/trpc/react";
import { translateEducationType } from "~/app/(pages)/educations/utils";
import { type EducationType } from "~/server/db/schema";
import type { DropdownOption } from "~/components/atoms/Dropdown";

const EducationsListTab = () => {
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );

  const { data } = api.education.getUniqueTypes.useQuery();
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
      <EducationsListSearch onSearch={handleSearch} types={types} />

      <PaginationProvider>
        <EducationsList filter={filter} />
      </PaginationProvider>
    </TabLayout>
  );
};

export default EducationsListTab;

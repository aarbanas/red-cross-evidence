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
import { CirclePlus } from "lucide-react";
import Link from "next/link";

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
      <div className="flex">
        <EducationsListSearch onSearch={handleSearch} types={types} />
        <div className="ml-auto rounded-md border px-2">
          <Link
            className="flex gap-2"
            href={{
              pathname: `/educations/create`,
            }}
          >
            <CirclePlus />
            Kreiraj novu edukaciju
          </Link>
        </div>
      </div>
      <PaginationProvider>
        <EducationsList filter={filter} />
      </PaginationProvider>
    </TabLayout>
  );
};

export default EducationsListTab;

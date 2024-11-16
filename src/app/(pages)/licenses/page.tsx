"use client";
import MainLayout from "~/components/layout/mainLayout";
import { PaginationProvider } from "~/components/organisms/pagination/PaginationContext";
import LicencesSearch from "~/app/(pages)/licenses/_components/LicencesSearch";
import { useCallback, useMemo, useState } from "react";
import Licences from "~/app/(pages)/licenses/_components/Licences";
import { api } from "~/trpc/react";
import type { DropdownOption } from "~/components/atoms/Dropdown";

const LicencePage = () => {
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );

  const { data } = api.license.findUniqueTypes.useQuery();
  const types: DropdownOption[] | undefined = useMemo(
    () =>
      data?.map(({ type }) => ({
        value: type,
        key: type,
      })),
    [data],
  );

  const handleSearch = useCallback((newFilter?: Record<string, string>) => {
    setFilter(newFilter);
  }, []);

  return (
    <MainLayout headerChildren={<div>Licence</div>}>
      <LicencesSearch onSearch={handleSearch} types={types} />

      <PaginationProvider>
        <Licences filter={filter} />
      </PaginationProvider>
    </MainLayout>
  );
};

export default LicencePage;

"use client";
import { useCallback, useMemo, useState } from "react";
import MainLayout from "~/components/layout/mainLayout";
import UsersSearch from "~/app/(pages)/users/_components/UsersSearch";
import { PaginationProvider } from "~/components/organisms/pagination/PaginationContext";
import Users from "~/app/(pages)/users/_components/Users";
import { api } from "~/trpc/react";

const UsersPage = () => {
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );
  const { data } = api.city.findUniqueCityNames.useQuery();
  const cityNames = useMemo(() => data?.map((city) => city.name), [data]);

  const handleSearch = useCallback(
    (newFilter: Record<string, string> | undefined) => {
      setFilter(newFilter);
    },
    [],
  );

  return (
    <MainLayout headerChildren={<div>Volonteri</div>}>
      <UsersSearch onSearch={handleSearch} cityNames={cityNames} />

      <PaginationProvider>
        <Users filter={filter} />
      </PaginationProvider>
    </MainLayout>
  );
};

export default UsersPage;

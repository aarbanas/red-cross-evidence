"use client";
import { memo, useCallback, useMemo, useState } from "react";
import MainLayout from "~/components/layout/mainLayout";
import UsersSearch from "~/app/(pages)/users/_components/UsersSearch";
import Users from "~/app/(pages)/users/_components/Users";
import { api } from "~/trpc/react";
import { type DropdownOption } from "~/components/atoms/Dropdown";

const UsersPage = () => {
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );

  const { data } = api.city.findUniqueCityNames.useQuery();

  const cities: DropdownOption[] | undefined = useMemo(
    () =>
      data?.map((city) => ({
        value: city.name,
        key: city.id,
      })),
    [data],
  );

  const handleSearch = useCallback((newFilter?: Record<string, string>) => {
    setFilter(newFilter);
  }, []);

  return (
    <MainLayout headerChildren={<div>Volonteri</div>}>
      <UsersSearch onSearch={handleSearch} cities={cities} />

      <Users filter={filter} />
    </MainLayout>
  );
};

export default memo(UsersPage);

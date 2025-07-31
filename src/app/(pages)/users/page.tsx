"use client";
import { memo, useCallback, useMemo, useState } from "react";
import MainLayout from "~/components/layout/mainLayout";
import { api } from "~/trpc/react";
import { type DropdownOption } from "~/components/atoms/Dropdown";
import UsersSearch from "~/app/(pages)/users/_components/UsersSearch";
import Users from "~/app/(pages)/users/_components/Users";
import Link from "next/link";
import { CirclePlus } from "lucide-react";

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
      <div className="flex">
        <UsersSearch onSearch={handleSearch} cities={cities} />

        <div className="ml-auto rounded-md border px-2">
          <Link
            className="flex gap-2"
            href={{
              pathname: `/users/create`,
            }}
          >
            <CirclePlus />
            Kreiraj novog volontera
          </Link>
        </div>
      </div>

      <Users filter={filter} />
    </MainLayout>
  );
};

export default memo(UsersPage);

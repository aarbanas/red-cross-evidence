"use client";
import MainLayout from "~/components/layout/mainLayout";
import LicencesSearch from "~/app/(pages)/licenses/_components/LicencesSearch";
import { useCallback, useMemo, useState } from "react";
import Licences from "~/app/(pages)/licenses/_components/Licences";
import { api } from "~/trpc/react";
import type { DropdownOption } from "~/components/atoms/Dropdown";
import Link from "next/link";
import { CirclePlus } from "lucide-react";

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
      <div className="flex">
        <LicencesSearch onSearch={handleSearch} types={types} />

        <div className="ml-auto rounded-md border px-2">
          <Link
            className="flex gap-2"
            href={{
              pathname: `/licenses/create`,
            }}
          >
            <CirclePlus />
            Kreiraj novu licencu
          </Link>
        </div>
      </div>

      <Licences filter={filter} />
    </MainLayout>
  );
};

export default LicencePage;

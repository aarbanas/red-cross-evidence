import useTotalPageNumber from "~/hooks/useTotalPageNumber";
import { usePagination } from "~/components/organisms/pagination/PaginationContext";
import { api } from "~/trpc/react";
import React, { useMemo } from "react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import LicencesTable from "~/app/(pages)/licenses/_components/LicencesTable";
import useResetPageOnFilterChange from "~/hooks/useResetPageOnFilterChange";

type Props = {
  filter: Record<string, string> | undefined;
};

const Licences: React.FC<Props> = ({ filter }) => {
  const { page, setPage } = usePagination();
  const memoizedFilter = useMemo(() => filter, [filter]);
  useResetPageOnFilterChange(setPage, memoizedFilter);

  const { data, isLoading, error } = api.license.find.useQuery({
    page,
    limit: 10,
    sort: ["name:asc"],
    filter: memoizedFilter,
  });

  const { totalPageNumber } = useTotalPageNumber(data);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && <div>Greška</div>}
      <LicencesTable data={data?.data} totalPageNumber={totalPageNumber} />
    </>
  );
};

export default Licences;

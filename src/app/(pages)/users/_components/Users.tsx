import { usePagination } from "~/components/organisms/pagination/PaginationContext";
import { api } from "~/trpc/react";
import React, { useMemo } from "react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import UsersTable from "~/app/(pages)/users/_components/UsersTable";
import useTotalPageNumber from "~/hooks/useTotalPageNumber";
import useResetPageOnFilterChange from "~/hooks/useResetPageOnFilterChange";

type Props = {
  filter: Record<string, string> | undefined;
};

const Users: React.FC<Props> = ({ filter }) => {
  const { page, setPage } = usePagination();
  const memoizedFilter = useMemo(() => filter, [filter]);
  useResetPageOnFilterChange(setPage, memoizedFilter);

  const { data, isLoading, error } = api.user.find.useQuery({
    page,
    limit: 10,
    sort: ["createdAt:asc"],
    filter: memoizedFilter,
  });

  const { totalPageNumber } = useTotalPageNumber(data);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && <div>Greška</div>}
      <UsersTable data={data?.data} totalPageNumber={totalPageNumber} />
    </>
  );
};

export default Users;

import { usePagination } from "~/components/organisms/pagination/PaginationContext";
import { api } from "~/trpc/react";
import React, { useMemo } from "react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import UsersTable from "~/app/(pages)/users/_components/UsersTable";
import useTotalPageNumber from "~/hooks/useTotalPageNumber";

type Props = {
  filter: Record<string, string> | undefined;
};

const Users: React.FC<Props> = ({ filter }) => {
  const { page } = usePagination();
  const memoizedFilter = useMemo(() => filter, [filter]);

  const { data, isLoading, error } = api.user.find.useQuery({
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
      <UsersTable data={data?.data} totalPageNumber={totalPageNumber} />
    </>
  );
};

export default Users;

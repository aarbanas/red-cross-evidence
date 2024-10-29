import { usePagination } from "~/components/organisms/pagination/PaginationContext";
import { api } from "~/trpc/react";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import UsersTable from "~/app/(pages)/users/_components/UsersTable";

type Props = {
  filter: Record<string, string> | undefined;
};
const Users: React.FC<Props> = ({ filter }) => {
  const [totalPageNumber, setTotalPageNumber] = useState<number>(1);
  const { page } = usePagination();

  const { data, isLoading, error } = api.user.find.useQuery({
    page,
    limit: 10,
    sort: ["name:asc"],
    filter,
  });

  useEffect(() => {
    if (data?.meta) {
      setTotalPageNumber(Math.ceil(data.meta.count / data.meta.limit));
    }
  }, [data]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && <div>Greška</div>}
      <UsersTable data={data?.data} totalPageNumber={totalPageNumber} />
    </>
  );
};

export default Users;

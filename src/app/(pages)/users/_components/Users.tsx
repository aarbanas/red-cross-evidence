import { api } from "~/trpc/react";
import React from "react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import UsersTable from "~/app/(pages)/users/_components/UsersTable";
import useTotalPageNumber from "~/hooks/useTotalPageNumber";
import usePagination from "~/hooks/usePagination";

type Props = {
  filter: Record<string, string> | undefined;
};

const Users: React.FC<Props> = ({ filter }) => {
  const { page } = usePagination(filter);

  const { data, isLoading, error } = api.user.find.useQuery({
    page,
    limit: 10,
    sort: ["createdAt:asc"],
    filter,
  });

  const { totalPageNumber } = useTotalPageNumber(data);

  if (isLoading) return <LoadingSpinner />;

  if (error) return <div>Greška</div>;

  return <UsersTable data={data?.data} totalPageNumber={totalPageNumber} />;
};

export default Users;

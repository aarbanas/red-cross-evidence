import { type FC, useEffect, useMemo } from "react";
import { usePagination } from "~/components/organisms/pagination/PaginationContext";
import { api } from "~/trpc/react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import EducationsListTable from "~/app/(pages)/educations/_components/List/EducationsListTable";
import useTotalPageNumber from "~/hooks/useTotalPageNumber";
import useResetPageOnFilterChange from "~/hooks/useResetPageOnFilterChange";

type Props = {
  filter: Record<string, string> | undefined;
};

const EducationsList: FC<Props> = ({ filter }) => {
  const { page, setPage } = usePagination();
  const memoizedFilter = useMemo(() => filter, [filter]);
  useResetPageOnFilterChange(setPage, memoizedFilter);

  const { data, isLoading, error } = api.education.find.useQuery({
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
      <EducationsListTable
        data={data?.data}
        totalPageNumber={totalPageNumber}
      />
    </>
  );
};

export default EducationsList;

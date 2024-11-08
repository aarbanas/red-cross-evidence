import { type FC, useEffect, useState } from "react";
import { usePagination } from "~/components/organisms/pagination/PaginationContext";
import { api } from "~/trpc/react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import EducationsListTable from "~/app/(pages)/educations/_components/List/EducationsListTable";

type Props = {
  filter: Record<string, string> | undefined;
};

const EducationsList: FC<Props> = ({ filter }) => {
  const [totalPageNumber, setTotalPageNumber] = useState<number>(1);
  const { page } = usePagination();

  const { data, isLoading, error } = api.education.find.useQuery({
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
      <EducationsListTable
        data={data?.data}
        totalPageNumber={totalPageNumber}
      />
    </>
  );
};

export default EducationsList;

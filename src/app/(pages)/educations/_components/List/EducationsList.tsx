import { type FC } from "react";
import { api } from "~/trpc/react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import EducationsListTable from "~/app/(pages)/educations/_components/List/EducationsListTable";
import useTotalPageNumber from "~/hooks/useTotalPageNumber";
import usePagination from "~/hooks/usePagination";

type Props = {
  filter: Record<string, string> | undefined;
};

const EducationsList: FC<Props> = ({ filter }) => {
  const { page } = usePagination(filter);

  const { data, isLoading, error, refetch } = api.education.find.useQuery({
    page,
    limit: 10,
    sort: ["name:asc"],
    filter,
  });

  const { totalPageNumber } = useTotalPageNumber(data);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && <div>Greška</div>}
      <EducationsListTable
        data={data?.data}
        totalPageNumber={totalPageNumber}
        refetch={refetch}
      />
    </>
  );
};

export default EducationsList;

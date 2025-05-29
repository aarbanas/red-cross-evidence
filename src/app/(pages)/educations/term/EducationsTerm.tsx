import React, { type FC } from "react";
import usePagination from "~/hooks/usePagination";
import { api } from "~/trpc/react";
import useTotalPageNumber from "~/hooks/useTotalPageNumber";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import EducationTermTable from "~/app/(pages)/educations/term/EducationTermTable";

type Props = {
  filter: Record<string, string> | undefined;
};

const EducationsTerm: FC<Props> = ({ filter }) => {
  const { page } = usePagination(filter);

  const { data, isLoading, error, refetch } = api.education.term.find.useQuery({
    page,
    limit: 10,
    sort: ["name:asc"],
    filter,
  });

  const { totalPageNumber } = useTotalPageNumber(data);

  if (isLoading) return <LoadingSpinner />;

  if (error) return <div>Greška</div>;

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && <div>Greška</div>}
      <EducationTermTable
        data={data?.data}
        totalPageNumber={totalPageNumber}
        refetch={refetch}
      />
    </>
  );
};

export default EducationsTerm;

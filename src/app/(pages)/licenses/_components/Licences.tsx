import LicencesTable from "~/app/(pages)/licenses/_components/LicencesTable";
import { usePagination } from "~/components/organisms/pagination/PaginationContext";
import { api } from "~/trpc/react";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";

type Props = {
  filter: Record<string, string> | undefined;
};

const Licences: React.FC<Props> = ({ filter }) => {
  const [totalPageNumber, setTotalPageNumber] = useState<number>(1);
  const { page } = usePagination();

  const { data, isLoading, error } = api.license.find.useQuery({
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
      <LicencesTable data={data?.data} totalPageNumber={totalPageNumber} />
    </>
  );
};

export default Licences;

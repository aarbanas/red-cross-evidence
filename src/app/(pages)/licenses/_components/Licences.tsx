import type React from 'react';
import LicencesTable from '~/app/(pages)/licenses/_components/LicencesTable';
import LoadingSpinner from '~/components/organisms/loadingSpinner/LoadingSpinner';
import usePagination from '~/hooks/usePagination';
import useTotalPageNumber from '~/hooks/useTotalPageNumber';
import { api } from '~/trpc/react';

type Props = {
  filter: Record<string, string> | undefined;
};

const Licences: React.FC<Props> = ({ filter }) => {
  const { page } = usePagination(filter);

  const { data, isLoading, error } = api.license.find.useQuery({
    page,
    limit: 10,
    sort: ['name:asc'],
    filter,
  });

  const { totalPageNumber } = useTotalPageNumber(data);

  if (isLoading) return <LoadingSpinner />;

  if (error) return <div>Greška</div>;

  return <LicencesTable data={data?.data} totalPageNumber={totalPageNumber} />;
};

export default Licences;

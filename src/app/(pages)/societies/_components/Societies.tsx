import type React from 'react';
import SocietiesTable from '~/app/(pages)/societies/_components/SocietiesTable';
import LoadingSpinner from '~/components/organisms/loadingSpinner/LoadingSpinner';
import usePagination from '~/hooks/usePagination';
import useTotalPageNumber from '~/hooks/useTotalPageNumber';
import { api } from '~/trpc/react';

type Props = {
  filter: Record<string, string> | undefined;
};

const Societies: React.FC<Props> = ({ filter }) => {
  const { page } = usePagination(filter);

  const { data, isLoading, error } = api.society.find.useQuery({
    page,
    limit: 10,
    sort: ['name:asc'],
    filter,
  });

  const { totalPageNumber } = useTotalPageNumber(data);

  if (isLoading) return <LoadingSpinner />;

  if (error) return <div>Greška</div>;

  return <SocietiesTable data={data?.data} totalPageNumber={totalPageNumber} />;
};

export default Societies;

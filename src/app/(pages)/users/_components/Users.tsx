import type React from 'react';
import { useEffect, useRef } from 'react';
import UsersTable from '@/app/(pages)/users/_components/UsersTable';
import LoadingSpinner from '@/components/organisms/loadingSpinner/LoadingSpinner';
import usePagination from '@/hooks/usePagination';
import useTotalPageNumber from '@/hooks/useTotalPageNumber';
import type { VolunteerSearchQuery } from '@/server/search/volunteerSearchFields';
import { api } from '@/trpc/react';

type Props = {
  filter: Record<string, string> | undefined;
  advancedFilters: VolunteerSearchQuery | null;
};

const Users: React.FC<Props> = ({ filter, advancedFilters }) => {
  const { page, handlePageChange } = usePagination(filter);

  const prevAdvancedFilters = useRef(advancedFilters);

  useEffect(() => {
    if (prevAdvancedFilters.current !== advancedFilters) {
      handlePageChange(0);
      prevAdvancedFilters.current = advancedFilters;
    }
  }, [advancedFilters, handlePageChange]);

  const {
    data: regularData,
    isLoading: regularLoading,
    error: regularError,
  } = api.user.find.useQuery(
    { page, limit: 10, sort: ['createdAt:asc'], filter },
    { enabled: !advancedFilters },
  );

  const {
    data: advancedData,
    isLoading: advancedLoading,
    error: advancedError,
  } = api.search.advancedSearch.useQuery(
    { filters: advancedFilters!, page, limit: 10 },
    { enabled: !!advancedFilters },
  );

  const data = advancedFilters ? advancedData : regularData;
  const isLoading = advancedFilters ? advancedLoading : regularLoading;
  const error = advancedFilters ? advancedError : regularError;

  const { totalPageNumber } = useTotalPageNumber(data);

  if (isLoading) return <LoadingSpinner />;

  if (error) return <div>Greška</div>;

  return <UsersTable data={data?.data} totalPageNumber={totalPageNumber} />;
};

export default Users;

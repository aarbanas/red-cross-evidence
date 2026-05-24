'use client';
import type React from 'react';
import EquipmentTable from '@/app/(pages)/equipment/_components/EquipmentTable';
import LoadingSpinner from '@/components/organisms/loadingSpinner/LoadingSpinner';
import usePagination from '@/hooks/usePagination';
import useTotalPageNumber from '@/hooks/useTotalPageNumber';
import { api } from '@/trpc/react';

type Props = {
  filter: Record<string, string> | undefined;
};

const EquipmentList: React.FC<Props> = ({ filter }) => {
  const { page } = usePagination(filter);

  const { data, isLoading, error } = api.equipment.find.useQuery({
    page,
    limit: 10,
    sort: ['name:asc'],
    filter,
  });

  const { totalPageNumber } = useTotalPageNumber(data);

  if (isLoading) return <LoadingSpinner />;

  if (error) return <div>Greška</div>;

  return <EquipmentTable data={data?.data} totalPageNumber={totalPageNumber} />;
};

export default EquipmentList;

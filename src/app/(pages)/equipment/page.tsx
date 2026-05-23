'use client';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useCallback, useState } from 'react';
import EquipmentList from '~/app/(pages)/equipment/_components/EquipmentList';
import { Button } from '~/components/atoms/Button';
import MainLayout from '~/components/layout/mainLayout';
import LoadingSpinner from '~/components/organisms/loadingSpinner/LoadingSpinner';

const EquipmentPage = () => {
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );

  const _handleSearch = useCallback((newFilter?: Record<string, string>) => {
    setFilter(newFilter);
  }, []);

  return (
    <MainLayout
      headerChildren={
        <div className="flex w-full">
          Oprema
          <Button asChild size="sm" className="ml-auto gap-2">
            <Link href="/equipment/create">
              <Plus className="h-4 w-4" />
              Nova oprema
            </Link>
          </Button>
        </div>
      }
    >
      <Suspense fallback={<LoadingSpinner />}>
        <EquipmentList filter={filter} />
      </Suspense>
    </MainLayout>
  );
};

export default EquipmentPage;

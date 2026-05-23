'use client';
import { CirclePlus } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useCallback, useState } from 'react';
import EquipmentList from '~/app/(pages)/equipment/_components/EquipmentList';
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
    <MainLayout headerChildren={<div>Oprema</div>}>
      <div className="flex">
        <div className="ml-auto rounded-md border px-2">
          <Link className="flex gap-2" href="/equipment/create">
            <CirclePlus />
            Kreiraj novu opremu
          </Link>
        </div>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <EquipmentList filter={filter} />
      </Suspense>
    </MainLayout>
  );
};

export default EquipmentPage;

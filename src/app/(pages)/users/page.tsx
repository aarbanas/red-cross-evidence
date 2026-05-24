'use client';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import Users from '@/app/(pages)/users/_components/Users';
import UsersSearch from '@/app/(pages)/users/_components/UsersSearch';
import type { DropdownOption } from '@/components/atoms/Dropdown';
import MainLayout from '@/components/layout/mainLayout';
import LoadingSpinner from '@/components/organisms/loadingSpinner/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';

const UsersPageContent = () => {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast('Korisnik uspješno kreiran', {
        type: 'success',
      });

      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      window.history.replaceState({}, document.title, url.toString());
    }
  }, [searchParams]);

  const { data } = api.city.findUniqueCityNames.useQuery();

  const cities: DropdownOption[] | undefined = useMemo(
    () =>
      data?.map((city) => ({
        value: city.name,
        key: city.id,
      })),
    [data],
  );

  const handleSearch = useCallback((newFilter?: Record<string, string>) => {
    setFilter(newFilter);
  }, []);

  return (
    <MainLayout
      headerChildren={
        <div className="flex w-full">
          Korisnici
          <Button asChild size="sm" className="ml-auto gap-2">
            <Link href="/users/create">
              <Plus className="h-4 w-4" />
              Novi korisnik
            </Link>
          </Button>
        </div>
      }
    >
      <div className="flex">
        <UsersSearch onSearch={handleSearch} cities={cities} />
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <Users filter={filter} />
      </Suspense>
    </MainLayout>
  );
};

const UsersPage = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <UsersPageContent />
  </Suspense>
);

export default memo(UsersPage);

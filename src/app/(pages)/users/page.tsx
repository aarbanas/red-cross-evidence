'use client';
import { Plus, X } from 'lucide-react';
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
import AdvancedSearchDialog from '@/app/(pages)/users/_components/AdvancedSearchDialog';
import Users from '@/app/(pages)/users/_components/Users';
import UsersSearch from '@/app/(pages)/users/_components/UsersSearch';
import type { DropdownOption } from '@/components/atoms/Dropdown';
import MainLayout from '@/components/layout/mainLayout';
import LoadingSpinner from '@/components/organisms/loadingSpinner/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { VolunteerSearchQuery } from '@/server/search/volunteerSearchFields';
import { api } from '@/trpc/react';

const UsersPageContent = () => {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );
  const [advancedFilters, setAdvancedFilters] =
    useState<VolunteerSearchQuery | null>(null);

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

  const handleFiltersApplied = useCallback((filters: VolunteerSearchQuery) => {
    setAdvancedFilters(filters);
  }, []);

  const handleClearAdvancedFilters = useCallback(() => {
    setAdvancedFilters(null);
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
      <div className="flex items-center gap-5">
        <UsersSearch onSearch={handleSearch} cities={cities} />
        <AdvancedSearchDialog onFiltersApplied={handleFiltersApplied} />
      </div>

      {advancedFilters && (
        <div className="mt-2">
          <Badge variant="outline" className="gap-1">
            Aktivno napredno pretraživanje
            <button type="button" onClick={handleClearAdvancedFilters}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}

      <Suspense fallback={<LoadingSpinner />}>
        <Users filter={filter} advancedFilters={advancedFilters} />
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

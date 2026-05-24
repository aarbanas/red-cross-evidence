'use client';
import { useParams } from 'next/navigation';
import AddressesEditForm from '@/app/(pages)/users/[id]/_components/AddressesEditForm';
import TabLayout from '@/components/layout/tabLayout';
import LoadingSpinner from '@/components/organisms/loadingSpinner/LoadingSpinner';
import type { AddressType } from '@/server/db/schema';
import { api } from '@/trpc/react';

const AddressesTab = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: addresses,
    isLoading,
    error,
  } = api.user.getAddresses.useQuery({ userId: id });
  const { data: countries, isLoading: isLoadingCountries } =
    api.country.getAllCountries.useQuery();

  if (isLoading || isLoadingCountries) return <LoadingSpinner />;

  if (error) return <div>Greška</div>;

  return (
    <TabLayout>
      <AddressesEditForm
        userId={id}
        addresses={
          addresses?.map((a) => ({ ...a, type: a.type as AddressType })) ?? []
        }
        countries={countries ?? []}
      />
    </TabLayout>
  );
};

export default AddressesTab;

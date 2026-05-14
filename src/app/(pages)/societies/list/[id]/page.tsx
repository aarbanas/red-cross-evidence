'use client';

import { useParams } from 'next/navigation';
import SocietyForm from '~/app/(pages)/societies/_components/SocietyForm';
import TabLayout from '~/components/layout/tabLayout';
import LoadingSpinner from '~/components/organisms/loadingSpinner/LoadingSpinner';
import { api } from '~/trpc/react';

const UpdateSocietyPage = () => {
  const { id } = useParams();

  const { data, isLoading, error } = api.society.findById.useQuery({
    id: id as string,
  });

  if (isLoading) return <LoadingSpinner />;

  if (error) return <div>Greška</div>;

  if (!data) return <div>Podaci nisu pronađeni</div>;

  return (
    <TabLayout>
      <SocietyForm
        action="update"
        formData={{
          id: data.id,
          name: data.name,
          address: data.address,
          director: data.director,
          phone: data.phone ?? '',
          email: data.email ?? '',
          website: data.website ?? '',
          cityId: data.cityId ?? '',
          cityName: data.cityName ?? '',
        }}
      />
    </TabLayout>
  );
};

export default UpdateSocietyPage;

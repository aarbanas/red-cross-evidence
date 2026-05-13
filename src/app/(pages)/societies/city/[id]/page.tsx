'use client';

import { useParams } from 'next/navigation';
import CitySocietyForm from '~/app/(pages)/societies/_components/CitySocietyForm';
import TabLayout from '~/components/layout/tabLayout';
import LoadingSpinner from '~/components/organisms/loadingSpinner/LoadingSpinner';
import { api } from '~/trpc/react';

const UpdateCitySocietyPage = () => {
  const { id } = useParams();

  const { data, isLoading, error } = api.citySociety.findById.useQuery({
    id: id as string,
  });

  if (isLoading) return <LoadingSpinner />;

  if (error) return <div>Greška</div>;

  if (!data) return <div>Podaci nisu pronađeni</div>;

  return (
    <TabLayout>
      <CitySocietyForm
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
          societyId: data.societyId ?? '',
        }}
      />
    </TabLayout>
  );
};

export default UpdateCitySocietyPage;

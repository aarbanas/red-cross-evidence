'use client';
import { useParams } from 'next/navigation';
import EquipmentForm from '@/app/(pages)/equipment/_components/EquipmentForm';
import MainLayout from '@/components/layout/mainLayout';
import LoadingSpinner from '@/components/organisms/loadingSpinner/LoadingSpinner';
import { api } from '@/trpc/react';

const UpdateEquipmentPage = () => {
  const { id } = useParams();

  const { data, isLoading, error } = api.equipment.findById.useQuery({
    id: id as string,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Greška</div>;
  }

  if (!data) {
    return <div>Podaci nisu pronađeni</div>;
  }

  return (
    <MainLayout headerChildren={<h1>Ažuriraj opremu</h1>}>
      <EquipmentForm
        action="update"
        formData={{
          id: data.id,
          name: data.name,
          type: data.type,
          size: data.size,
          quantity: data.quantity,
        }}
      />
    </MainLayout>
  );
};

export default UpdateEquipmentPage;

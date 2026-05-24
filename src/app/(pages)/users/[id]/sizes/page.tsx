'use client';
import { useParams } from 'next/navigation';
import RentedEquipmentTable from '@/app/(pages)/users/[id]/_components/RentedEquipmentTable';
import SizesEditForm from '@/app/(pages)/users/[id]/_components/SizesEditForm';
import TabLayout from '@/components/layout/tabLayout';
import LoadingSpinner from '@/components/organisms/loadingSpinner/LoadingSpinner';
import { api } from '@/trpc/react';

const SizesTab = () => {
  const { id } = useParams<{ id: string }>();

  const { data: sizes, isLoading: isLoadingSizes } = api.user.getSizes.useQuery(
    { userId: id },
  );
  const {
    data: rentedEquipment,
    isLoading: isLoadingEquipment,
    error,
  } = api.user.getRentedEquipment.useQuery({ userId: id });

  if (isLoadingSizes || isLoadingEquipment) return <LoadingSpinner />;

  if (error) return <div>Greška</div>;

  return (
    <TabLayout>
      <SizesEditForm
        userId={id}
        defaultValues={{
          shoeSize: sizes?.shoeSize ?? null,
          clothingSize: sizes?.clothingSize ?? '',
          height: sizes?.height ?? null,
          weight: sizes?.weight ?? null,
        }}
      />

      <hr className="my-6 border-gray-200" />

      <RentedEquipmentTable userId={id} items={rentedEquipment ?? []} />
    </TabLayout>
  );
};

export default SizesTab;

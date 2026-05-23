'use client';
import type { NextPage } from 'next';
import EquipmentForm from '~/app/(pages)/equipment/_components/EquipmentForm';
import MainLayout from '~/components/layout/mainLayout';

const CreateEquipmentPage: NextPage = () => {
  return (
    <MainLayout headerChildren={<h1>Kreiraj novu opremu</h1>}>
      <EquipmentForm action="create" />
    </MainLayout>
  );
};

export default CreateEquipmentPage;

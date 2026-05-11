'use client';
import LicencesForm from '~/app/(pages)/licenses/_components/LicencesForm';
import MainLayout from '~/components/layout/mainLayout';

const CreateLicensePage = () => {
  return (
    <MainLayout headerChildren={<h1>Kreiraj novu licencu</h1>}>
      <LicencesForm action={'create'} />
    </MainLayout>
  );
};

export default CreateLicensePage;

"use client";
import MainLayout from "~/components/layout/mainLayout";
import LicencesForm from "~/app/(pages)/licenses/[id]/_components/LicencesForm";

const CreateUpdateLicensePage = () => {
  return (
    <MainLayout headerChildren={<h1>Licence</h1>}>
      <LicencesForm />
    </MainLayout>
  );
};

export default CreateUpdateLicensePage;

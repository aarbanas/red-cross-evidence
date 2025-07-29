"use client";
import MainLayout from "~/components/layout/mainLayout";
import LicencesForm from "~/app/(pages)/licenses/_components/LicencesForm";

const CreateLicensePage = () => {
  return (
    <MainLayout headerChildren={<h1>Kreiraj novu licencu</h1>}>
      <LicencesForm action={"create"} />
    </MainLayout>
  );
};

export default CreateLicensePage;

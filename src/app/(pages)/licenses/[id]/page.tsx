"use client";
import MainLayout from "~/components/layout/mainLayout";
import LicencesForm from "~/app/(pages)/licenses/_components/LicencesForm";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";

const UpdateLicensePage = () => {
  const { id } = useParams();

  const { data, isLoading, error } = api.license.findById.useQuery({
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
    <MainLayout headerChildren={<h1>Ažuriraj licencu</h1>}>
      <LicencesForm
        action={"update"}
        formData={{
          id: data.id,
          name: data.name,
          type: data.type,
        }}
      />
    </MainLayout>
  );
};

export default UpdateLicensePage;

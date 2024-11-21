"use client";
import MainLayout from "~/components/layout/mainLayout";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import EducationForm from "~/app/(pages)/educations/[id]/_components/EducationsForm";

export default function EducationDetailPage() {
  const { id } = useParams();

  // Fetch user data by ID
  const { data, isLoading, error } = api.education.findById.useQuery({
    id: id as string,
  });

  return (
    <MainLayout headerChildren={<div>Uređivanje edukacije {data?.title}</div>}>
      <div>
        {isLoading && <LoadingSpinner />}
        {error && <div>Greška</div>}
        {data && (
          <EducationForm
            id={id as string}
            formData={{
              type: data?.type ?? "",
              title: data?.title ?? "",
              description: data?.description ?? "",
            }}
          />
        )}
      </div>
    </MainLayout>
  );
}

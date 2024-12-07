"use client";
import MainLayout from "~/components/layout/mainLayout";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import EducationForm from "~/app/(pages)/educations/list/[id]/_components/EducationsForm";

export default function EducationDetailPage() {
  const { id } = useParams();

  // Fetch unique types
  const { data: uniqueTypesData } = api.education.getUniqueTypes.useQuery();

  // Conditionally fetch data only if the id is not "create"
  const { data, isLoading, error } =
    id !== "create"
      ? api.education.findById.useQuery({ id: id as string })
      : {};

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Greška</div>;
  }

  const uniqueTypes = uniqueTypesData ?? [];

  return (
    <>
      <div>
        {id === "create"
          ? "Kreiranje nove edukacije"
          : `Uređivanje edukacije ${data?.title}`}
      </div>
      <div>
        {(id === "create" || data) && (
          <EducationForm
            id={id as string}
            formData={{
              type: data?.type ?? "",
              title: data?.title ?? "",
              description: data?.description ?? "",
              precondition: data?.precondition ?? "",
              duration: data?.duration ?? "",
              lecturers: data?.lecturers ?? "",
              courseDuration: data?.courseDuration ?? "",
              renewalDuration: data?.renewalDuration ?? "",
              topics: data?.topics ?? "",
            }}
            uniqueTypes={uniqueTypes}
          />
        )}
      </div>
    </>
  );
}

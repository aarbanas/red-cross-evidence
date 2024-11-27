"use client";
import MainLayout from "~/components/layout/mainLayout";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import EducationForm from "~/app/(pages)/educations/[id]/_components/EducationsForm";

export default function EducationDetailPage() {
  const { id } = useParams();

  // Conditionally fetch data only if the id is not "create"
  const { data, isLoading, error } =
    id !== "create"
      ? api.education.findById.useQuery({ id: id as string })
      : { data: null, isLoading: false, error: null };

  return (
    <MainLayout
      headerChildren={
        <div>
          {id === "create"
            ? "Kreiranje nove edukacije"
            : `Uređivanje edukacije ${data?.title}`}
        </div>
      }
    >
      <div>
        {isLoading && <LoadingSpinner />}
        {error && <div>Greška</div>}
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
          />
        )}
      </div>
    </MainLayout>
  );
}

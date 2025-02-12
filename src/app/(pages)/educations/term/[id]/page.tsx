"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import TabLayout from "~/components/layout/tabLayout";
import EducationsTermForm from "~/app/(pages)/educations/term/_components/EducationsTermForm";

const UpdateEducationTermPage = () => {
  const { id } = useParams();

  const { data, isLoading, error } = api.education.term.findById.useQuery({
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

  console.log(data);

  return (
    <TabLayout>
      <div>
        <EducationsTermForm
          action={"create"}
          educationTermId={id}
          formData={{
            title: data.title,
            dateFrom: data.dateFrom.toISOString(),
            dateTo: data.dateTo.toISOString(),
            maxParticipants: data.maxParticipants,
            lecturers: data.lecturers,
            location: data.location,
            educationId: data.education?.id,
          }}
        />
      </div>
    </TabLayout>
  );
};

export default UpdateEducationTermPage;

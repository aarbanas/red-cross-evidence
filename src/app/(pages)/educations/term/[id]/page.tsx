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

  const { data: educationTpes } = api.education.list.getUniqueTypes.useQuery();

  if (!educationTpes?.length) {
    return <div>No unique types found</div>;
  }

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
    <TabLayout>
      <div>
        <EducationsTermForm
          action={"update"}
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
          educationTypes={educationTpes}
        />
      </div>
    </TabLayout>
  );
};

export default UpdateEducationTermPage;

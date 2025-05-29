"use client";
import TabLayout from "~/components/layout/tabLayout";
import EducationsTermForm from "~/app/(pages)/educations/term/_components/EducationsTermForm";
import { api } from "~/trpc/react";

const CreateEducationTerm = () => {
  const { data: educationTpes } = api.education.list.getUniqueTypes.useQuery();

  if (!educationTpes?.length) {
    return <div>No unique types found</div>;
  }

  return (
    <TabLayout>
      <div>
        <EducationsTermForm action={"create"} educationTypes={educationTpes} />
      </div>
    </TabLayout>
  );
};

export default CreateEducationTerm;

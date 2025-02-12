import TabLayout from "~/components/layout/tabLayout";
import EducationsTermForm from "~/app/(pages)/educations/term/_components/EducationsTermForm";

const CreateEducationTerm = () => {
  return (
    <TabLayout>
      <div>
        <EducationsTermForm action={"create"} />
      </div>
    </TabLayout>
  );
};

export default CreateEducationTerm;

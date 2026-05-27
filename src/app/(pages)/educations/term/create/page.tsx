'use client';
import { useState } from 'react';
import EducationsTermForm from '@/app/(pages)/educations/term/_components/EducationsTermForm';
import TermParticipantsStagingSection, {
  type StagedParticipant,
} from '@/app/(pages)/educations/term/_components/TermParticipantsStagingSection';
import TabLayout from '@/components/layout/tabLayout';
import { api } from '@/trpc/react';

const CreateEducationTerm = () => {
  const [pendingParticipants, setPendingParticipants] = useState<
    StagedParticipant[]
  >([]);
  const { data: educationTypes } = api.education.list.getUniqueTypes.useQuery();

  if (!educationTypes?.length) {
    return <div>No unique types found</div>;
  }

  return (
    <TabLayout>
      <div className="space-y-6">
        <EducationsTermForm
          action={'create'}
          educationTypes={educationTypes}
          pendingParticipants={pendingParticipants}
        />
        <TermParticipantsStagingSection
          participants={pendingParticipants}
          onChange={setPendingParticipants}
        />
      </div>
    </TabLayout>
  );
};

export default CreateEducationTerm;

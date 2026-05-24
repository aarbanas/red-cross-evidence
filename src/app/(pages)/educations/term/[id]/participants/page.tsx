'use client';

import { useParams } from 'next/navigation';
import TabLayout from '@/components/layout/tabLayout';
import LoadingSpinner from '@/components/organisms/loadingSpinner/LoadingSpinner';
import { api } from '@/trpc/react';
import TermParticipantsTable from './TermParticipantsTable';

const TermParticipantsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: term, isLoading: termLoading } =
    api.education.term.findById.useQuery({ id });

  const { data: participants, isLoading: participantsLoading } =
    api.education.term.getParticipants.useQuery({ termId: id });

  if (termLoading || participantsLoading) {
    return <LoadingSpinner />;
  }

  if (!term) {
    return <div>Podaci nisu pronađeni</div>;
  }

  return (
    <TabLayout>
      <TermParticipantsTable
        termId={id}
        maxParticipants={term.maxParticipants}
        participants={participants ?? []}
      />
    </TabLayout>
  );
};

export default TermParticipantsPage;

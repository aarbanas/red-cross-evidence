'use client';

import { useParams } from 'next/navigation';
import UserEducationsTable from '@/app/(pages)/users/[id]/_components/UserEducationsTable';
import TabLayout from '@/components/layout/tabLayout';
import LoadingSpinner from '@/components/organisms/loadingSpinner/LoadingSpinner';
import { api } from '@/trpc/react';

const UserEducationsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = api.user.getEducationTerms.useQuery({
    userId: id,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <TabLayout>
      <UserEducationsTable userId={id} items={data ?? []} />
    </TabLayout>
  );
};

export default UserEducationsPage;

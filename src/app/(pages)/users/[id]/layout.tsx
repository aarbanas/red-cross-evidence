'use client';
import { useParams } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import Tabs, { type TabProp } from '@/components/atoms/Tabs';
import MainLayout from '@/components/layout/mainLayout';
import { api } from '@/trpc/react';

const UserEditLayout: FC<PropsWithChildren> = ({ children }) => {
  const { id } = useParams<{ id: string }>();

  const { data } = api.user.getProfile.useQuery({ userId: id });

  const fullName = data?.profile
    ? `${data.profile.firstName} ${data.profile.lastName}`
    : 'Uredi korisnika';

  const tabsData: TabProp[] = [
    { label: 'Osobni podaci', link: 'personal-information' },
    { label: 'Adrese', link: 'addresses' },
    { label: 'Odjeća i obuća', link: 'sizes' },
    { label: 'Znanja i vještine', link: 'skills' },
    { label: 'Edukacije', link: 'educations' },
  ];

  return (
    <MainLayout headerChildren={<div>{fullName}</div>}>
      <div>
        <Tabs tabs={tabsData} basePath={`/users/${id}`} />
        <main className="pt-4">{children}</main>
      </div>
    </MainLayout>
  );
};

export default UserEditLayout;

'use client';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProfileEditForm from '@/app/(pages)/users/[id]/_components/ProfileEditForm';
import TabLayout from '@/components/layout/tabLayout';
import LoadingSpinner from '@/components/organisms/loadingSpinner/LoadingSpinner';
import { UserRole } from '@/server/db/schema';
import { api } from '@/trpc/react';

const ProfileTab = () => {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === UserRole.ADMIN;

  const { data, isLoading, error } = api.user.getProfile.useQuery({
    userId: id,
  });

  if (isLoading) return <LoadingSpinner />;

  if (error) return <div>Greška</div>;

  if (!data) return <div>Korisnik nije pronađen</div>;

  return (
    <TabLayout>
      <ProfileEditForm
        userId={id}
        email={data.email ?? ''}
        active={data.active ?? null}
        role={(data.role as UserRole | undefined) ?? UserRole.USER}
        isAdmin={isAdmin}
        defaultValues={{
          profile: {
            firstName: data.profile?.firstName ?? '',
            lastName: data.profile?.lastName ?? '',
            oib: data.profile?.oib ?? '',
            sex: data.profile?.sex ?? '',
            type: data.type ?? '',
            birthDate: data.profile?.birthDate ?? '',
            birthPlace: data.profile?.birthPlace ?? '',
            parentName: data.profile?.parentName ?? '',
            nationality: data.profile?.nationality ?? '',
            phone: data.profile?.phone ?? '',
            societyId: data.profile?.societyId ?? '',
            citySocietyId: data.profile?.citySocietyId ?? '',
          },
          workStatus: {
            status: data.workStatus?.status ?? '',
            educationLevel: data.workStatus?.educationLevel ?? '',
            profession: data.workStatus?.profession ?? '',
            institution: data.workStatus?.institution ?? '',
          },
        }}
      />
    </TabLayout>
  );
};

export default ProfileTab;

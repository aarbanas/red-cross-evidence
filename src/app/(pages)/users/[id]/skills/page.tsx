'use client';
import { useParams } from 'next/navigation';
import SkillsEditForm from '@/app/(pages)/users/[id]/_components/SkillsEditForm';
import TabLayout from '@/components/layout/tabLayout';
import LoadingSpinner from '@/components/organisms/loadingSpinner/LoadingSpinner';
import { api } from '@/trpc/react';

const SkillsTab = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: skills,
    isLoading: isLoadingSkills,
    error,
  } = api.user.getSkills.useQuery({ userId: id });
  const { data: languages, isLoading: isLoadingLanguages } =
    api.skill.languages.getAll.useQuery();
  const { data: licences, isLoading: isLoadingLicences } =
    api.license.findAll.useQuery();

  if (isLoadingSkills || isLoadingLanguages || isLoadingLicences)
    return <LoadingSpinner />;

  if (error) return <div>Greška</div>;

  return (
    <TabLayout>
      <SkillsEditForm
        userId={id}
        languages={languages ?? []}
        licences={licences ?? []}
        defaultValues={{
          selectedLanguages:
            skills?.languages.map((l) => ({
              id: l.id,
              level: l.level,
            })) ?? [],
          selectedLicences:
            skills?.licences.map((l) => ({
              id: l.id,
              name: licences?.find((lic) => lic.id === l.id)?.name ?? '',
              type: licences?.find((lic) => lic.id === l.id)?.type ?? '',
            })) ?? [],
          otherSkills:
            skills?.otherSkills.map((s) => ({
              name: s.name,
              description: s.description,
            })) ?? [],
        }}
      />
    </TabLayout>
  );
};

export default SkillsTab;

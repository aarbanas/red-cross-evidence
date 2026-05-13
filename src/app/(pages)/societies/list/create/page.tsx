'use client';

import SocietyForm from '~/app/(pages)/societies/_components/SocietyForm';
import TabLayout from '~/components/layout/tabLayout';

const CreateSocietyPage = () => {
  return (
    <TabLayout>
      <SocietyForm action="create" />
    </TabLayout>
  );
};

export default CreateSocietyPage;

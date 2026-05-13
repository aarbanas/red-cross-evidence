'use client';

import CitySocietyForm from '~/app/(pages)/societies/_components/CitySocietyForm';
import TabLayout from '~/components/layout/tabLayout';

const CreateCitySocietyPage = () => {
  return (
    <TabLayout>
      <CitySocietyForm action="create" />
    </TabLayout>
  );
};

export default CreateCitySocietyPage;

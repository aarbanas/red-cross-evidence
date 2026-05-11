'use client';
import type { NextPage } from 'next';
import CreateUserForm from '~/app/(pages)/users/createUserForm';
import MainLayout from '~/components/layout/mainLayout';

const CreateUserPage: NextPage = () => {
  return (
    <MainLayout headerChildren={<div>Volonteri</div>}>
      <CreateUserForm />
    </MainLayout>
  );
};

export default CreateUserPage;

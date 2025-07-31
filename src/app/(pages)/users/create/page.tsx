"use client";
import MainLayout from "~/components/layout/mainLayout";
import { type NextPage } from "next";
import CreateUserForm from "~/app/(pages)/users/createUserForm";

const CreateUserPage: NextPage = () => {
  return (
    <MainLayout headerChildren={<div>Volonteri</div>}>
      <CreateUserForm />
    </MainLayout>
  );
};

export default CreateUserPage;

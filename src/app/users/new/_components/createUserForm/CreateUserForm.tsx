"use client";

import { type FC } from "react";

import { ProfileForm } from "~/app/users/_components/profile/ProfileForm";

const CreateUserForm: FC = () => {
  const submit = (v: unknown) => {
    console.log(v);
  };

  return <ProfileForm onSubmit={submit} />;
};

export default CreateUserForm;

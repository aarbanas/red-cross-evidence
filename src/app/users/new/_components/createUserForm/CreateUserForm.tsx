"use client";

import { type FC } from "react";

import { ProfileForm } from "~/app/users/_components/profile/ProfileForm";
import { WorkStatusForm } from "~/app/users/_components/profile/WorkStatusForm";

const CreateUserForm: FC = () => {
  const submit = (v: unknown) => {
    console.log(v);
  };

  return (
    <div className="mx-auto w-1/2">
      <ProfileForm onSubmit={submit} />
      <WorkStatusForm onSubmit={submit}></WorkStatusForm>
    </div>
  );
};

export default CreateUserForm;

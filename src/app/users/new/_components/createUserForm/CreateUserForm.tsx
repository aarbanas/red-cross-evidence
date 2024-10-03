"use client";

import { type FC } from "react";
import { LicenseSelectorForm } from "~/app/users/_components/profile/LicenseSelectorForm";
import { ProfileForm } from "~/app/users/_components/profile/ProfileForm";

const CreateUserForm: FC = () => {
  const submit = (v: unknown) => {
    alert(JSON.stringify(v));
    console.log(v);
  };

  return (
    <div className="mx-auto w-1/2">
      <ProfileForm onSubmit={submit} />
      <LicenseSelectorForm onSubmit={submit} />
    </div>
  );
};

export default CreateUserForm;

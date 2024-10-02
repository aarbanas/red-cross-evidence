"use client";

import { type FC } from "react";
import { LanguagesForm } from "~/app/users/_components/profile/LanguagesForm";

import { ProfileForm } from "~/app/users/_components/profile/ProfileForm";
import { WorkStatusForm } from "~/app/users/_components/profile/WorkStatusForm";
import { LanguageLevel } from "~/server/db/schema";

const CreateUserForm: FC = () => {
  const submit = (v: unknown) => {
    alert(JSON.stringify(v));
    console.log(v);
  };

  return (
    <div className="mx-auto w-1/2">
      <ProfileForm onSubmit={submit} />
      <WorkStatusForm onSubmit={submit} />
      <LanguagesForm
        onSubmit={submit}
        items={[
          { id: "d9881f70-608c-4649-825c-ef7bb6defa70", name: "Hrvatski" },
          { id: "64013437-0c9e-4bd9-938e-52ae22c2a67d", name: "Njemački" },
          { id: "64013437-0c9e-4bd9-938e-52ae22c2a67c", name: "Talijanski" },
        ]}
        initialValues={{
          selectedLanguages: [
            {
              id: "64013437-0c9e-4bd9-938e-52ae22c2a67d",
              level: LanguageLevel.A1,
            },
          ],
        }}
      />
    </div>
  );
};

export default CreateUserForm;

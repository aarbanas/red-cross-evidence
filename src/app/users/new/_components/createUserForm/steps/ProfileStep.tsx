import { useCreateUserFormContext } from "~/app/users/new/_components/createUserForm/context/CreateUserFormContext";
import { ProfileForm } from "~/app/users/_components/profile/ProfileForm";
import { useCallback } from "react";
import { type ProfileSchemaType } from "~/server/services/user/profile/schemas";

export const ProfileStep = () => {
  const { updateFormValues, setCurrentStep, formValues } =
    useCreateUserFormContext();

  const handleSubmit = useCallback(
    (profile: ProfileSchemaType) => {
      updateFormValues({
        profile,
      });
      setCurrentStep(2);
    },

    [setCurrentStep, updateFormValues],
  );

  return (
    <div>
      <ProfileForm
        onSubmit={handleSubmit}
        initialValues={formValues?.profile}
      />
    </div>
  );
};

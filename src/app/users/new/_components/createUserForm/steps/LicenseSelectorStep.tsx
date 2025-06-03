import { type FC, useCallback } from "react";
import { useCreateUserFormContext } from "~/app/users/new/_components/createUserForm/context/CreateUserFormContext";
import { LicenseSelectorForm } from "~/app/users/_components/profile/LicenseSelectorForm";

export const LicenseSelectorStep: FC = () => {
  const { updateFormValues, formValues, setCurrentStep } =
    useCreateUserFormContext();

  const handleSubmit = useCallback(
    (data: { selectedItems: Array<string> }) => {
      const { selectedItems } = data;
      updateFormValues({
        licenses: selectedItems,
      });
      setCurrentStep((step) => step + 1);
    },

    [updateFormValues, setCurrentStep],
  );

  return (
    <LicenseSelectorForm
      onSubmit={handleSubmit}
      initialValues={{
        selectedItems: formValues?.licenses ?? [],
      }}
    />
  );
};

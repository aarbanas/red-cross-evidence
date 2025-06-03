"use client";

import { type FC } from "react";
import { Button } from "~/components/atoms/Button";
import {
  CreateUserFormProvider,
  useCreateUserFormContext,
} from "~/app/users/new/_components/createUserForm/context/CreateUserFormContext";
import { ProfileStep } from "~/app/users/new/_components/createUserForm/steps/ProfileStep";
import { LicenseSelectorStep } from "~/app/users/new/_components/createUserForm/steps/LicenseSelectorStep";

const CreateUserForm: FC = () => {
  return (
    <CreateUserFormProvider>
      <FormContent />
      <ActionButton />
    </CreateUserFormProvider>
  );
};

const FormContent: FC = () => {
  const createUserFormContext = useCreateUserFormContext();
  const { currentStep, formValues } = createUserFormContext;

  return (
    <div className="flex flex-col">
      {currentStep === 1 && <ProfileStep />}
      {currentStep === 2 && <LicenseSelectorStep />}
      <pre>{JSON.stringify(formValues, undefined, 4)}</pre>
    </div>
  );
};

const ActionButton: FC = () => {
  const createUserFormContext = useCreateUserFormContext();
  const { setCurrentStep, currentStep, formValues } = createUserFormContext;

  const goToPreviousStep = () => {
    if (currentStep <= 1) return;

    setCurrentStep((prevState) => prevState - 1);
  };

  const handleSubmit = () => {
    console.log(formValues);
  };

  return (
    <div className="flex flex-row gap-3">
      {currentStep}
      <Button onClick={goToPreviousStep} disabled={currentStep === 1}>
        Previous
      </Button>

      {currentStep === 3 && <Button onClick={handleSubmit}>Submit</Button>}
    </div>
  );
};

export default CreateUserForm;

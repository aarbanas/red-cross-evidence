"use client";

import React, { ReactElement, useState } from "react";
import { Button } from "~/components/atoms/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import FormComponent from "../form/formComponent/FormComponent";

export interface FormStep {
  name: string;
  form: ReactElement;
}

type Inputs = {
  username: string;
  password: string;
  password2: string;
  email: string;
  phone: string;
  creditCard: string;
  billingAddr: string;
};

interface FormProps {
  forms: FormStep[];
  onSubmit: (data: Inputs) => void;
}

const MultiStepForm: React.FC<FormProps> = ({ forms, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  let isLastStep = false;
  let newStep = currentStep;

  const methods = useForm<Inputs>({
    //shouldUseNativeValidation: true,
    // reValidateMode: "onSubmit",
    mode: "all",
  });
  console.log(newStep);
  const numSteps = forms.length;

  const nextStep = () => {
    if (currentStep < numSteps - 1) {
      newStep += 1;

      setCurrentStep(currentStep + 1);
    } else isLastStep = true;
  };

  const prevStep = () => {
    if (currentStep > 0) {
      newStep -= 1;
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = (data: Inputs) => {
    //nextStep();
    //console.log(typeof data);
    if (currentStep == numSteps - 1 && isLastStep) onSubmit(data);
    // Add submission logic here
  };

  const progressPercentage = ((currentStep + 1) / numSteps) * 100;

  return (
    <div className="mx-auto flex w-1/3 flex-col items-center rounded-lg border bg-white p-4">
      <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200">
        <div
          className="h-2.5 rounded-full bg-gray-900/90 duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* form navbar */}
      <nav className="mb-4 flex space-x-4 pb-3">
        {forms.map((formStep, index) => (
          <Button
            key={index}
            variant={`${currentStep === index ? "default" : "ghost"}`}
            onClick={() => setCurrentStep(index)}
          >
            {index + 1}. {formStep.name}
          </Button>
        ))}
      </nav>

      {/* form contents */}
      <div className="flex items-center justify-center">
        <FormComponent form={methods} onSubmit={handleFormSubmit}>
          <div className="w-96 space-y-10 pb-6">{forms[currentStep]!.form}</div>

          {/* form navigaiton and submission */}
          <div className="flex items-center justify-center space-x-4">
            {currentStep > 0 && (
              <Button onClick={prevStep} variant="outline">
                Back
              </Button>
            )}

            <Button type="submit" onClick={nextStep} variant="default">
              {currentStep < numSteps - 1 ? "Continue" : "Submit"}
            </Button>
          </div>
        </FormComponent>
      </div>
    </div>
  );
};

export default MultiStepForm;

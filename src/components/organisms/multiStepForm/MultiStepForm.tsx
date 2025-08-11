"use client";

import React, { type ReactElement, useState, useEffect } from "react";
import { Button } from "~/components/atoms/Button";
import { useForm, type FieldValues, type DefaultValues } from "react-hook-form";
import FormComponent from "../form/formComponent/FormComponent";

export interface FormStep {
  name: string;
  form: ReactElement;
}

function generateForm<T extends FieldValues>(
  forms: FormStep[],
  onSubmit: (data: T) => void,
  saveToLocalStorage = false,
): ReactElement {
  interface FormProps {
    forms: FormStep[];
    onSubmit: (data: T) => void;
    saveToLocalStorage: boolean;
  }

  const MultiStepForm: React.FC<FormProps> = ({
    forms,
    onSubmit,
    saveToLocalStorage,
  }) => {
    const [currentStep, setCurrentStep] = useState(0);
    let isLastStep = false;
    let newStep = currentStep;

    const methods = useForm<T>({
      //shouldUseNativeValidation: true,
      // reValidateMode: "onSubmit",
      mode: "all",
      defaultValues: saveToLocalStorage
        ? (JSON.parse(
            localStorage.getItem("multiStepFormData") ?? "{}",
          ) as DefaultValues<T>)
        : undefined,
    });
    const watchedValues = methods.watch();

    useEffect(() => {
      if (saveToLocalStorage) {
        localStorage.setItem(
          "multiStepFormData",
          JSON.stringify(watchedValues),
        );
      }
    }, [saveToLocalStorage, watchedValues]);

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

    const handleFormSubmit = (data: T) => {
      //nextStep();
      //console.log(typeof data);
      if (isLastStep) {
        onSubmit(data);
        // Clear localStorage after successful submission
        if (saveToLocalStorage) {
          localStorage.removeItem("multiStepFormData");
        }
      }
      // Add submission logic here
    };

    const progressPercentage = ((currentStep + 1) / numSteps) * 100;

    return (
      <div className="mx-auto flex w-full flex-col items-center rounded-lg border bg-white p-4">
        <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200">
          <div
            className="h-2.5 rounded-full bg-red-700 duration-500"
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
        <div className="flex w-full items-center justify-center">
          <FormComponent form={methods} onSubmit={handleFormSubmit}>
            <div className="w-full space-y-10 pb-6">
              {forms[currentStep]!.form}
            </div>

            {/* form navigaiton and submission */}
            <div className="flex items-center justify-center space-x-4">
              {currentStep > 0 && (
                <Button onClick={prevStep} variant="outline">
                  Nazad
                </Button>
              )}

              <Button type="submit" onClick={nextStep} variant="default">
                {currentStep < numSteps - 1 ? "Naprijed" : "Spremi"}
              </Button>
            </div>
          </FormComponent>
        </div>
      </div>
    );
  };

  return (
    <MultiStepForm
      forms={forms}
      onSubmit={onSubmit}
      saveToLocalStorage={saveToLocalStorage}
    />
  );
}
export default generateForm;

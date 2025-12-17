/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { type ReactElement, useState, useEffect } from "react";
import { Button } from "~/components/atoms/Button";
import { useForm, type FieldValues, type DefaultValues } from "react-hook-form";
import FormComponent from "../form/formComponent/FormComponent";
import { type ZodObject } from "zod";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";

export interface FormStep {
  name: string;
  form: ReactElement;
}

function generateForm<T extends FieldValues>(
  forms: FormStep[],
  onSubmit: (data: T) => void | Promise<void>,
  schema: ZodObject<any>,
  saveToLocalStorage = false,
): ReactElement {
  interface FormProps {
    forms: FormStep[];
    schema: ZodObject<any>;
    onSubmit: (data: T) => void | Promise<void>;
    saveToLocalStorage: boolean;
  }

  const MultiStepForm: React.FC<FormProps> = ({
    forms,
    schema,
    onSubmit,
    saveToLocalStorage,
  }) => {
    const schemaKeys: string[] = schema.keyof()._def.values;
    const numberOfFields = schemaKeys.length;
    if (numberOfFields !== forms.length)
      console.error("Amount of steps and fields in schema do not match");

    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    let isLastStep = false;

    const methods = useForm<T>({
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
        setCurrentStep(currentStep + 1);
      } else isLastStep = true;
    };

    const prevStep = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };

    const handleFormSubmit = async (data: T) => {
      if (isLastStep) {
        const parse = schema.safeParse(methods.getValues());
        if (!parse.success) {
          // Find the first error and navigate to its step
          const firstErrorPath = parse.error.issues[0]?.path[0];
          if (firstErrorPath) {
            const errorStepIndex = schemaKeys.indexOf(firstErrorPath as string);
            if (errorStepIndex !== -1) {
              setCurrentStep(errorStepIndex);
            }
          }
          return;
        }

        if (saveToLocalStorage) {
          localStorage.removeItem("multiStepFormData");
        }

        setIsSubmitting(true);
        try {
          await onSubmit(data);
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    const progressPercentage = ((currentStep + 1) / numSteps) * 100;

    return (
      <div className="relative mx-auto flex w-full flex-col items-center rounded-lg border bg-white p-4">
        {isSubmitting && (
          <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-white bg-opacity-50">
            <LoadingSpinner />
          </div>
        )}
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
              disabled={isSubmitting}
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

            {/* form navigation and submission */}
            <div className="flex items-center justify-center space-x-4">
              {currentStep > 0 && (
                <Button
                  onClick={prevStep}
                  variant="outline"
                  disabled={isSubmitting}
                >
                  Nazad
                </Button>
              )}

              <Button
                type="submit"
                onClick={nextStep}
                variant="default"
                disabled={!methods.formState.isValid || isSubmitting}
              >
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
      schema={schema}
      saveToLocalStorage={saveToLocalStorage}
    />
  );
}
export default generateForm;

"use client";

import React, { useState } from "react";
import { Button } from "~/components/atoms/Button";
import FormInput from "../form/formInput/FormInput";
import { useForm } from "react-hook-form";
import FormComponent from "../form/formComponent/FormComponent";

export interface Fields {
  type: "text" | "password" | "email" | "number" | "tel" | "url" | "search";
  label: string;
  placeholder: string;
}

export interface FormStep {
  name: string;
  fields: Fields[];
}

interface FormProps {
  form: FormStep[];
}

const MultiStepForm: React.FC<FormProps> = ({ form }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const numSteps = form.length;

  const nextStep = () => {
    if (currentStep < numSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    setFormData({
      ...formData,
      [`${currentStep}-${index}`]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    // Add submission logic here
  };

  const progressPercentage = ((currentStep + 1) / numSteps) * 100;
  const methods = useForm();

  return (
    <div className="mx-auto flex w-1/3 flex-col items-center rounded-lg border bg-white p-4">
      <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200">
        <div
          className="h-2.5 rounded-full bg-gray-900/90 duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <nav className="mb-4 flex space-x-4 pb-3">
        {form.map((formStep, index) => (
          <Button
            key={index}
            variant={`${currentStep === index ? "default" : "ghost"}`}
            onClick={() => setCurrentStep(index)}
          >
            {index + 1}. {formStep.name}
          </Button>
        ))}
      </nav>
      <div className="pb-6">
        <FormComponent form={methods} onSubmit={handleSubmit}>
          {form[currentStep]!.fields.map((input, index) => (
            <FormInput
              key={index}
              id={`${currentStep}-${index}`}
              type={input.type}
              placeholder={input.placeholder}
              value={formData[`${currentStep}-${index}`] ?? ""}
              onChange={(e) => handleChange(e, index)}
              className="w-96"
              label={input.label}
            />
          ))}
        </FormComponent>
      </div>
      <div className="flex space-x-4">
        {currentStep > 0 && (
          <Button onClick={prevStep} variant="outline">
            Back
          </Button>
        )}
        {currentStep < numSteps - 1 ? (
          <Button onClick={nextStep} variant="default">
            Continue
          </Button>
        ) : (
          <Button onClick={handleSubmit} variant="default">
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;

"use client";

import {
  SignUpForm,
  UserCredentials,
} from "./_components/formComponents/SignUp";
import { ContactInfo, DetailsForm } from "./_components/formComponents/Details";
import { BillingForm, PaymentInfo } from "./_components/formComponents/Billing";
import generateForm from "~/components/organisms/multiStepForm/MultiStepForm";
import { FormStep } from "~/components/organisms/multiStepForm/MultiStepForm";

const CustomForm = () => {
  const test: FormStep[] = [
    {
      name: "Sign Up",
      form: <SignUpForm />,
    },
    {
      name: "Details",
      form: <DetailsForm />,
    },
    {
      name: "Billing",
      form: <BillingForm />,
    },
  ];
  interface Inputs extends UserCredentials, ContactInfo, PaymentInfo {}
  const onSubmit = (data: Inputs) => {
    //nextStep();
    //console.log(typeof data);
    alert(JSON.stringify(data));
    // Add submission logic here
  };
  //return <MultiStepForm forms={test} onSubmit={onSubmit} />;
  return generateForm<Inputs>(test, onSubmit);
};
export default CustomForm;

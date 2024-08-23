"use client";

/**
 * This is a boilerplate for a multi-step form.
 */
import {
  SignUpForm,
  type UserCredentials,
} from "./_components/formComponents/SignUp";
import {
  type ContactInfo,
  DetailsForm,
} from "./_components/formComponents/Details";
import {
  BillingForm,
  type PaymentInfo,
} from "./_components/formComponents/Billing";
import generateForm from "~/components/organisms/multiStepForm/MultiStepForm";
import { type FormStep } from "~/components/organisms/multiStepForm/MultiStepForm";

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

"use client";

import FormInput from "../form/formInput/FormInput";
import { useFormContext } from "react-hook-form";

export function BillingForm() {
  const { register } = useFormContext();
  return (
    <>
      <FormInput
        id="creditCard"
        label="Credit Card Number"
        type="text"
        {...register("creditCard")}
        /*defaultValue={"Your credit card number goes here"}*/
      />

      <FormInput
        id="billingAddr"
        label="Billing Address"
        type="text"
        {...register("billingAddr")}
        /*defaultValue={"Your billing address goes here"}*/
      />
    </>
  );
}

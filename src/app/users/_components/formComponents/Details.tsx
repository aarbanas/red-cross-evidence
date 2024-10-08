"use client";

import FormInput from "~/components/organisms/form/formInput/FormInput";
import { useFormContext } from "react-hook-form";

export interface ContactInfo {
  email: string;
  phone: string;
}

export function DetailsForm() {
  const { register } = useFormContext();
  return (
    <>
      <FormInput
        id="email"
        label="Email Address"
        type="email"
        {...register("email")}
        /*defaultValue={"Your email goes here"}*/
      />

      <FormInput
        id="phone"
        label="Phone Number"
        type="text"
        {...register("phone")}
        /*defaultValue={"Your phone number goes here"}*/
      />
    </>
  );
}

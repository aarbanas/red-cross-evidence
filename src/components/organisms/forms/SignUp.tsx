"use client";

import FormInput from "../form/formInput/FormInput";
import { useFormContext } from "react-hook-form";

export function SignUpForm() {
  const { register } = useFormContext();
  return (
    <>
      <>
        <FormInput
          id="username"
          label="Username"
          type="text"
          {...register("username", {
            required: "Please enter your username.",
          })}
          /*defaultValue={"Your username goes here"}*/
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          {...register("password")}
          /*defaultValue={"Your password goes here"}*/
        />

        <FormInput
          id="password2"
          label="Repeat Password"
          type="password"
          {...register("password2")}
          /*defaultValue="Repeat your password here"*/
        />
      </>
    </>
  );
}

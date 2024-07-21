/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-base-to-string */
import { type ComponentProps } from "react";
import {
  type FieldValues,
  FormProvider,
  type SubmitHandler,
  type UseFormReturn,
  useFormContext,
} from "react-hook-form";

import styles from "./FormComponent.module.scss";

interface FormProps<T extends FieldValues>
  extends Omit<ComponentProps<"form">, "onSubmit"> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
}

const FormComponent = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  ...props
}: FormProps<T>) => {
  return (
    <FormProvider {...form}>
      <form
        className={styles.container}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
};

export default FormComponent;

export const FieldError = ({ name }: { name?: string }) => {
  const {
    formState: { errors },
  } = useFormContext();

  if (!name) {
    return null;
  }

  const error = errors[name];

  if (!error?.message) {
    return null;
  }

  return (
    <small className={styles.error}>
      <span role="alert">{error.message.toString()}</span>
    </small>
  );
};

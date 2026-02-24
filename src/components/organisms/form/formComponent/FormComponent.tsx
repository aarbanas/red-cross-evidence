/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-base-to-string */
import { type ComponentProps } from "react";
import {
  type FieldValues,
  FormProvider,
  type SubmitHandler,
  useFormContext,
  type UseFormReturn,
} from "react-hook-form";

import styles from "./FormComponent.module.css";

interface FormProps<
  T extends FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined,
> extends Omit<ComponentProps<"form">, "onSubmit"> {
  form: UseFormReturn<T, TContext, TTransformedValues>;
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
    getFieldState,
  } = useFormContext();

  if (!name) {
    return null;
  }

  // Try react-hook-form's built-in error lookup first
  try {
    const fieldState = getFieldState(name);
    if (fieldState?.error?.message) {
      return (
        <small className={styles.error}>
          <span role="alert">{fieldState.error.message}</span>
        </small>
      );
    }
  } catch (e) {
    console.log("getFieldState failed:", e);
  }

  // Fallback to manual traversal
  const nameParts = name.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let error: any = errors;

  // Traverse through each part of the nested path
  for (const part of nameParts) {
    if (error && typeof error === "object" && part in error) {
      error = error[part];
    } else {
      error = null;
      break;
    }
  }

  // Handle different error object structures
  if (!error) {
    return null;
  }

  // Check if error has message directly
  if (error?.message) {
    return (
      <small className={styles.error}>
        <span role="alert">{error.message.toString()}</span>
      </small>
    );
  }

  // Check if error is the message itself (string)
  if (typeof error === "string") {
    return (
      <small className={styles.error}>
        <span role="alert">{error}</span>
      </small>
    );
  }

  // Check if error has a type and message property (react-hook-form structure)
  if (error?.type && error?.message) {
    return (
      <small className={styles.error}>
        <span role="alert">{error.message.toString()}</span>
      </small>
    );
  }

  return null;
};

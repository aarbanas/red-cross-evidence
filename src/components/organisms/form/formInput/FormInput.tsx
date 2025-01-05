import React, { type ComponentProps, forwardRef } from "react";

import styles from "./FormInput.module.scss";
import { FieldError } from "~/components/organisms/form/formComponent/FormComponent";

interface FormInputProps extends ComponentProps<"input"> {
  id: string;
  label: string;
  className?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, label, type = "text", className, ...props }, ref) => {
    if (type === "checkbox") {
      return (
        <div className={styles.checkboxContainer}>
          <label htmlFor={id} className={styles.checkboxLabel}>
            <input
              id={id}
              ref={ref}
              type={type}
              className={styles.checkboxInput}
              {...props}
            />
            {label}
          </label>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <label htmlFor={id} className={className ?? styles.label}>
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          type={type}
          className={styles.input}
          {...props}
        />
        <FieldError name={props.name} />
      </div>
    );
  },
);

FormInput.displayName = "FormInput";

export default FormInput;

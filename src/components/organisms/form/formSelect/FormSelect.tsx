import React, {
  type ComponentProps,
  type ReactElement,
  forwardRef,
} from "react";

import styles from "./FormSelect.module.scss";
import { FieldError } from "~/components/organisms/form/formComponent/FormComponent";

const DEFAULT_VALUE = "none";

interface FormSelectProps extends ComponentProps<"select"> {
  id: string;
  label: string;
  children?: ReactElement<HTMLOptionElement>[];
  labelClassName?: string;
  placeholder?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    { id, label, value = DEFAULT_VALUE, children, labelClassName, ...props },
    ref,
  ) => {
    return (
      <div className={styles.container}>
        <label htmlFor={id} className={labelClassName ?? styles.label}>
          {label}
        </label>
        <select id={id} ref={ref} className={styles.select} {...props}>
          <option value={value} disabled>
            {props.placeholder!}
          </option>
          {children}
        </select>
        <FieldError name={props.name} />
      </div>
    );
  },
);

FormSelect.displayName = "FormSelect";

export default FormSelect;

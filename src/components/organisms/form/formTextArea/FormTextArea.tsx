import styles from "./FormTextArea.module.scss";
import { FieldError } from "~/components/organisms/form/formComponent/FormComponent";
import { forwardRef, ComponentProps } from "react";

interface FormTextAreaProps extends ComponentProps<"textarea"> {
  id: string;
  label: string;
  className?: string;
}

const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ id, label, className, ...props }, ref) => {
    return (
      <div className={styles.container}>
        <label htmlFor={id} className={className ?? styles.label}>
          {label}
        </label>
        <textarea id={id} ref={ref} className={styles.textarea} {...props} />
        <FieldError name={props.name} />
      </div>
    );
  },
);

FormTextArea.displayName = "FormTextarea";

export default FormTextArea;

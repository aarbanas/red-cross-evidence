import React, { forwardRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./FormDatePicker.module.scss";
import { FieldError } from "~/components/organisms/form/formComponent/FormComponent";
import { hr } from "date-fns/locale/hr";
import moment from "moment";

registerLocale("hr", hr);

interface FormDatePickerProps {
  id: string;
  label: string;
  className?: string;
  name?: string;
  partOfDay?: "START" | "END";
  onChange?: (event: { target: { value: Date | null; name?: string } }) => void;
}

const FormDatePicker = forwardRef<DatePicker, FormDatePickerProps>(
  ({ id, label, className, onChange, name, partOfDay, ...props }, ref) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const handleChange = (date: Date | null) => {
      onChange?.({
        target: {
          value: date,
          name,
        },
      });
    };

    return (
      <div className={styles.container}>
        <label htmlFor={id} className={className ?? styles.label}>
          {label}
        </label>
        <DatePicker
          id={id}
          selected={selectedDate}
          locale={"hr"}
          dateFormat="dd.MM.yyyy"
          onChange={(date: Date | null) => {
            const formattedDate = !partOfDay
              ? moment(date).toDate()
              : partOfDay === "START"
                ? moment(date).startOf("day").toDate()
                : moment(date).endOf("day").toDate();
            handleChange(formattedDate);
            setSelectedDate(formattedDate);
          }}
          className={styles.datepicker}
          ref={ref}
          {...props}
        />
        <FieldError name={name} />
      </div>
    );
  },
);

FormDatePicker.displayName = "FormDatePicker";

export default FormDatePicker;

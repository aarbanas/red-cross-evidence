import { zodResolver } from "@hookform/resolvers/zod";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/atoms/Button";

import FormComponent from "~/components/organisms/form/formComponent/FormComponent";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import { EducationLevel, WorkStatus } from "~/server/db/schema";
import {
  WorkStatusSchema,
  type WorkStatusType,
} from "~/server/services/user/profile/schemas";

interface WorkStatusFormProps {
  initialValues?: Partial<WorkStatusType>;
  onSubmit: (
    values: Partial<WorkStatusType> | WorkStatusType,
  ) => void | Promise<void>;
}

export const WorkStatusForm: FC<WorkStatusFormProps> = ({
  initialValues,
  onSubmit,
}) => {
  const form = useForm({
    values: initialValues,
    resolver: zodResolver(WorkStatusSchema),
  });
  const { register } = form;

  return (
    <FormComponent form={form} onSubmit={onSubmit}>
      <FormSelect
        id="status"
        label="Work Status"
        placeholder="Odaberite status"
        {...register("status")}
      >
        {Object.entries(WorkStatus).map(([key, value]) => {
          return (
            <option key={key} value={value}>
              {key}
            </option>
          );
        })}
      </FormSelect>

      <FormSelect
        id="educationLevel"
        label="Education Level"
        placeholder="Odaberite education level"
        {...register("educationLevel")}
      >
        {Object.entries(EducationLevel).map(([key, value]) => {
          return (
            <option key={key} value={value}>
              {key}
            </option>
          );
        })}
      </FormSelect>

      <Button type="submit">Spremi</Button>
    </FormComponent>
  );
};

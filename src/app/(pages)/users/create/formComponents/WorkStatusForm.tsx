import { useFormContext } from "react-hook-form";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import { EducationLevel, WorkStatus } from "~/server/db/schema";
import {
  translateEducationLevel,
  translateWorkStatus,
} from "~/app/(pages)/users/create/utils";

export type WorkStatusFormProps = {
  status: WorkStatus;
  educationLevel: EducationLevel;
  profession?: string;
  institution?: string;
};

const WorkStatusForm = () => {
  const { register } = useFormContext();

  return (
    <>
      <FormSelect id="status" label="Status*" {...register("status")}>
        {Object.entries(WorkStatus).map(([key, value]) => {
          return (
            <option key={key} value={value}>
              {translateWorkStatus(value)}
            </option>
          );
        })}
      </FormSelect>

      <FormSelect
        id="educationLevel"
        label="Stupanj obrazovanja*"
        {...register("educationLevel")}
      >
        {Object.entries(EducationLevel).map(([key, value]) => {
          return (
            <option key={key} value={value}>
              {translateEducationLevel(value)}
            </option>
          );
        })}
      </FormSelect>

      <FormInput
        id="profession"
        label="Zanimanje"
        {...register("profession")}
      />

      <FormInput id="institution" label="Zvanje" {...register("institution")} />
    </>
  );
};

export default WorkStatusForm;

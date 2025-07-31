import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, type FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "~/components/atoms/Button";
import FormComponent from "~/components/organisms/form/formComponent/FormComponent";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import {
  AddOtherSkillsSchema,
  type AddOtherSkillsType,
} from "~/server/services/user/profile/schemas";

interface OtherSkillsFormProps {
  initialValues?: AddOtherSkillsType;
  onSubmit: (values: AddOtherSkillsType) => void | Promise<void>;
}

export const OtherSkillsForm: FC<OtherSkillsFormProps> = ({
  initialValues,
  onSubmit,
}) => {
  const form = useForm<AddOtherSkillsType>({
    values: initialValues,
    resolver: zodResolver(AddOtherSkillsSchema),
  });
  const { register, control, watch } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "otherSkills",
    rules: { minLength: 1 },
  });

  const otherSkills = watch("otherSkills");

  useEffect(() => console.log(otherSkills), [otherSkills]);

  return (
    <FormComponent form={form} onSubmit={onSubmit}>
      {fields.length === 0 ? (
        <p>Ako imate dodatne vještine molim vas dodatje ih</p>
      ) : (
        fields.map((field, index) => {
          return (
            <div className="flex flex-col gap-5" key={field.id}>
              <FormInput
                id={`name-${index}`}
                label="Naziv"
                placeholder="Unesite naziv"
                {...register(`otherSkills.${index}.name`)}
              ></FormInput>

              <FormInput
                id={`description-${index}`}
                label="Opis"
                placeholder="Opis"
                {...register(`otherSkills.${index}.description`)}
              ></FormInput>

              <Button
                type="button"
                variant={"default"}
                onClick={() => remove(index)}
              >
                Ukloni
              </Button>
            </div>
          );
        })
      )}

      <div className="flex gap-5">
        <Button
          type="button"
          variant={"default"}
          onClick={() =>
            append({ name: "", description: "" }, { shouldFocus: true })
          }
        >
          Dodaj novu vještinu
        </Button>
      </div>

      <Button type="submit">Submit</Button>
    </FormComponent>
  );
};

import { zodResolver } from "@hookform/resolvers/zod";
import { type FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "~/components/atoms/Button";
import FormComponent from "~/components/organisms/form/formComponent/FormComponent";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import { LanguageLevel } from "~/server/db/schema";
import {
  AddLanguagesToProfileSchema,
  type AddLanguagesToProfileType,
  type LanguageType,
} from "~/server/services/user/profile/schemas";

interface LanguagesFormProps {
  items: LanguageType[];
  initialValues?: AddLanguagesToProfileType;
  onSubmit: (values: AddLanguagesToProfileType) => void | Promise<void>;
}

export const LanguagesForm: FC<LanguagesFormProps> = ({
  initialValues,
  onSubmit,
  items,
}) => {
  const form = useForm({
    values: initialValues,
    resolver: zodResolver(AddLanguagesToProfileSchema),
  });
  const { register, control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "selectedLanguages",
    rules: { minLength: 1, maxLength: items.length },
  });

  return (
    <FormComponent form={form} onSubmit={onSubmit}>
      {fields.map((field, index) => {
        return (
          <div className="flex items-center gap-5" key={field.id}>
            <FormSelect
              id={`language-${index}`}
              label="Jezik"
              placeholder="Odaberite jezik"
              {...register(`selectedLanguages.${index}.id`)}
            >
              {items
                .map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
            </FormSelect>

            <FormSelect
              id={`languageLevel-${index}`}
              label="Razina znanja"
              placeholder="Odaberite razinu znanja"
              {...register(`selectedLanguages.${index}.level`)}
            >
              {Object.entries(LanguageLevel).map(([key, value]) => {
                return (
                  <option key={key} value={value}>
                    {key}
                  </option>
                );
              })}
            </FormSelect>
          </div>
        );
      })}

      <div className="flex gap-5">
        {fields.length < items.length && (
          <Button
            type="button"
            variant={"default"}
            onClick={() =>
              append(
                { id: "none", level: LanguageLevel.A1 },
                { shouldFocus: true },
              )
            }
          >
            Dodaj
          </Button>
        )}
        {fields.length > 1 && (
          <Button
            type="button"
            variant={"default"}
            onClick={() => remove(fields.length - 1)}
          >
            Ukloni
          </Button>
        )}
      </div>
      <Button type="submit">Submit</Button>
    </FormComponent>
  );
};

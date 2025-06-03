import React, { type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "~/components/atoms/Button";
import FormComponent from "~/components/organisms/form/formComponent/FormComponent";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import { Sex } from "~/server/db/schema";
import {
  ProfileSchema,
  type ProfileSchemaType,
} from "~/server/services/user/profile/schemas";

interface ProfileFormProps {
  initialValues?: Partial<ProfileSchemaType>;
  onSubmit: (values: ProfileSchemaType) => void | Promise<void>;
}

export const ProfileForm: FC<ProfileFormProps> = ({
  initialValues,
  onSubmit,
}) => {
  const form = useForm<ProfileSchemaType>({
    defaultValues: {
      sex: "none" as Sex,
      ...initialValues,
    },
    resolver: zodResolver(ProfileSchema),
  });
  const { register } = form;

  return (
    <FormComponent form={form} onSubmit={onSubmit}>
      <div className="flex gap-10">
        <FormInput id="firstName" label="Ime" {...register("firstName")} />
        <FormInput id="lastName" label="Prezime" {...register("lastName")} />
      </div>

      <div className="flex gap-10">
        <FormInput id="oib" label="OIB" {...register("oib")} />
        <FormSelect
          id="sex"
          label="Spol"
          placeholder="Odaberite spol"
          {...register("sex")}
        >
          {Object.entries(Sex).map(([key, value]) => (
            <option key={key} value={value}>
              {key}
            </option>
          ))}
        </FormSelect>
      </div>

      <div className="flex gap-10">
        <FormInput
          id="parentName"
          label="Ime roditelja"
          {...register("parentName")}
        />

        <FormInput
          id="nationality"
          label="Nacionalnost"
          {...register("nationality")}
        />
      </div>

      <div className="flex gap-10">
        <FormInput
          id="birthDate"
          type="date"
          label="Datum rođenja"
          {...register("birthDate")}
        />

        <FormInput
          id="birthPlace"
          label="Mjesto rođenja"
          {...register("birthPlace")}
        />
      </div>

      <Button type="submit">Spremi</Button>
    </FormComponent>
  );
};

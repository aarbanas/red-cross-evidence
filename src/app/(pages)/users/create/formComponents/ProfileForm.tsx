import { useFormContext } from "react-hook-form";

import FormInput from "~/components/organisms/form/formInput/FormInput";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import { Sex } from "~/server/db/schema";
import { translateSex } from "~/app/(pages)/users/create/utils";

export type ProfileFormProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  oib: string;
  sex: string;
  parentName: string;
  nationality: string;
  birthDate: string;
  birthPlace: string;
};

export const ProfileForm = () => {
  const { register } = useFormContext();

  return (
    <>
      <div className="flex gap-10">
        <FormInput
          id="firstName"
          label="Ime*"
          {...register("firstName", {
            required: "Ime je obavezno polje",
          })}
        />
        <FormInput
          id="lastName"
          label="Prezime*"
          {...register("lastName", {
            required: "Prezime je obavezno polje",
          })}
        />
      </div>

      <div className="flex gap-10">
        <FormInput
          id="oib"
          label="OIB*"
          type="number"
          {...register("oib", {
            required: "OIB je obavezno polje",
            minLength: {
              value: 11,
              message: "Oib mora imati 11 znamenki",
            },
            maxLength: {
              value: 11,
              message: "Oib mora imati 11 znamenki",
            },
          })}
        />
        <FormSelect
          id="sex"
          label="Spol*"
          placeholder="Odaberite spol"
          {...register("sex", {
            required: "Spol je obavezno polje",
          })}
        >
          {Object.entries(Sex).map(([key, value]) => (
            <option key={key} value={value}>
              {translateSex(value)}
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

      <div className="flex gap-10">
        <FormInput
          id="email"
          label="Email*"
          {...register("email", {
            required: "Email je obavezno polje",
          })}
        />
        <FormInput id="phone" label="Broj telefona" {...register("phone")} />
      </div>
    </>
  );
};

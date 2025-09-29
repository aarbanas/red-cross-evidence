import { useFormContext } from "react-hook-form";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import { AddressType } from "~/server/db/schema";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import { translateAddressType } from "~/app/(pages)/users/create/utils";
import { type FC } from "react";

export type AddressFormProps = {
  type: AddressType;
  street: string;
  streetNumber: string;
  city: string;
  postalCode: string;
  country: string;
};

type Props = {
  countries: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date | null;
  }[];
};

const AddressForm: FC<Props> = ({ countries }) => {
  const { register } = useFormContext();

  return (
    <>
      <FormSelect
        id="type"
        label="Vrsta*"
        {...register("address.type", {
          required: "Tip adrese je obavezno polje",
        })}
      >
        {Object.entries(AddressType).map(([key, value]) => {
          return (
            <option key={key} value={value}>
              {translateAddressType(value)}
            </option>
          );
        })}
      </FormSelect>

      <div className="flex gap-10">
        <FormInput
          id="street"
          label="Ulica*"
          {...register("address.street", {
            required: "Ulica je obavezno polje",
          })}
        />
        <FormInput
          id="streetNumber"
          label="Kućni broj*"
          {...register("address.streetNumber", {
            required: "Kućni broj je obavezno polje",
          })}
        />
      </div>

      <div className="flex gap-10">
        <FormInput
          id="city"
          label="Grad*"
          {...register("address.city", {
            required: "Grad je obavezno polje",
          })}
        />
        <FormInput
          id="postalCode"
          label="Poštanski broj*"
          {...register("address.postalCode", {
            required: "Poštanski broj je obavezno polje",
          })}
        />
      </div>

      <FormSelect
        id="country"
        label="Država*"
        {...register("address.country", {
          required: "Država je obavezno polje",
        })}
      >
        {countries.map(({ id, name }) => {
          return (
            <option key={id} value={name}>
              {name}
            </option>
          );
        })}
      </FormSelect>
    </>
  );
};

export default AddressForm;

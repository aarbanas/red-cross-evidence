import { useFormContext } from "react-hook-form";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import { AddressType } from "~/server/db/schema";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import FormCitySearch from "~/components/organisms/form/formCitySearch/FormCitySearch";
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
  const { register, watch } = useFormContext();

  const selectedCountry = watch("address.country") as string;

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

      <FormSelect
        id="country"
        label="Država*"
        {...register("address.country", {
          required: "Država je obavezno polje",
        })}
      >
        {countries.map(({ id, name }) => {
          return (
            <option key={id} value={id}>
              {name}
            </option>
          );
        })}
      </FormSelect>

      <div className="flex gap-10">
        <div className="flex-1">
          <FormCitySearch
            id="city"
            label="Grad*"
            cityFieldName="address.city"
            postalCodeFieldName="address.postalCode"
            countryId={selectedCountry}
          />
        </div>
        <div className="flex-1">
          <FormInput
            id="postalCode"
            label="Poštanski broj*"
            {...register("address.postalCode", {
              required: "Poštanski broj je obavezno polje",
            })}
            placeholder="Unesite poštanski broj"
          />
        </div>
      </div>

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
    </>
  );
};

export default AddressForm;

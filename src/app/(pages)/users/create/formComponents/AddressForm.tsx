import { useFormContext } from "react-hook-form";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import { AddressType } from "~/server/db/schema";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import FormCitySearch from "~/components/organisms/form/formCitySearch/FormCitySearch";
import FormStreetSearch from "~/components/organisms/form/formStreetSearch/FormStreetSearch";
import { translateAddressType } from "~/app/(pages)/users/create/utils";
import { type FC } from "react";
import { type SearchCityReturnDTO } from "~/server/services/city/city.repository";

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
  const selectedCity = watch("address.city") as
    | SearchCityReturnDTO
    | string
    | undefined;

  // Extract cityId for street search - only available if city is a SearchCityReturnDTO object
  const cityId =
    typeof selectedCity === "object" && selectedCity?.id
      ? selectedCity.id
      : undefined;

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
        <div className="flex-1">
          <FormStreetSearch
            id="street"
            label="Ulica*"
            streetFieldName="address.street"
            streetNumberFieldName="address.streetNumber"
            cityId={cityId}
          />
        </div>
        <div className="flex-1">
          <FormInput
            id="streetNumber"
            label="Kućni broj*"
            {...register("address.streetNumber", {
              required: "Kućni broj je obavezno polje",
            })}
            placeholder="Unesite kućni broj"
          />
        </div>
      </div>
    </>
  );
};

export default AddressForm;

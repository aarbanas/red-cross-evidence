import { useFormContext, useFieldArray } from "react-hook-form";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import { AddressType } from "~/server/db/schema";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import FormCitySearch from "~/components/organisms/form/formCitySearch/FormCitySearch";
import FormStreetSearch from "~/components/organisms/form/formStreetSearch/FormStreetSearch";
import { translateAddressType } from "~/app/(pages)/users/create/utils";
import { type FC } from "react";
import { type SearchCityReturnDTO } from "~/server/services/city/city.repository";
import { Button } from "~/components/atoms/Button";

export type AddressFormProps = {
  addresses: {
    type: AddressType;
    street: string;
    streetNumber: string;
    city: string;
    postalCode: string;
    country: string;
    isPrimary: boolean;
  }[];
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
  const { register, watch, control, setValue } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const watchedAddresses = (watch("addresses") ?? []) as AddressFormProps[];

  // Handle primary address selection - only one can be primary
  const handlePrimaryChange = (selectedIndex: number) => {
    // Set all addresses to non-primary first
    watchedAddresses.forEach((_: AddressFormProps, index: number) => {
      setValue(`addresses.${index}.isPrimary`, false);
    });
    // Set the selected address as primary
    setValue(`addresses.${selectedIndex}.isPrimary`, true);
  };

  const addNewAddress = () => {
    append({
      type: AddressType.PERMANENT_RESIDENCE,
      street: "",
      streetNumber: "",
      city: "",
      postalCode: "",
      country: "",
      isPrimary: fields.length === 0, // First address is primary by default
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Adrese</h3>
        <Button
          type="button"
          onClick={addNewAddress}
          variant="outline"
          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
        >
          + Dodaj adresu
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          Nema dodanih adresa. Kliknite &#34;Dodaj address&#34; za dodavanje
          prve adrese.
        </div>
      )}

      {fields.map((field, index) => {
        const selectedCountry = watch(`addresses.${index}.country`) as string;
        const selectedCity = watch(`addresses.${index}.city`) as
          | SearchCityReturnDTO
          | string
          | undefined;

        // Extract cityId for street search
        const cityId =
          typeof selectedCity === "object" && selectedCity?.id
            ? selectedCity.id
            : undefined;

        const isPrimary = (watch(`addresses.${index}.isPrimary`) ??
          false) as boolean;

        return (
          <div
            key={field.id}
            className="relative space-y-4 rounded-lg border p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h4 className="font-medium">Adresa {index + 1}</h4>
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="outline"
                  className="bg-red-50 text-red-700 hover:bg-red-100"
                >
                  Ukloni
                </Button>
              )}
            </div>

            <FormInput
              id={`primary-${index}`}
              label="Primarna adresa"
              checked={isPrimary}
              onChange={() => handlePrimaryChange(index)}
              type={"checkbox"}
            />
            <FormSelect
              id={`type-${index}`}
              label="Vrsta*"
              {...register(`addresses.${index}.type`, {
                required: "Tip adrese je obavezno polje",
              })}
              placeholder="Odaberite vrstu adrese"
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
              id={`country-${index}`}
              label="Država*"
              {...register(`addresses.${index}.country`, {
                required: "Država je obavezno polje",
              })}
              placeholder="Odaberite državu"
            >
              {countries.map(({ id, name }) => {
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </FormSelect>

            <div className="flex gap-4">
              <div className="flex-1">
                <FormCitySearch
                  id={`city-${index}`}
                  label="Grad*"
                  cityFieldName={`addresses.${index}.city`}
                  postalCodeFieldName={`addresses.${index}.postalCode`}
                  countryId={selectedCountry}
                />
              </div>
              <div className="flex-1">
                <FormInput
                  id={`postalCode-${index}`}
                  label="Poštanski broj*"
                  {...register(`addresses.${index}.postalCode`, {
                    required: "Poštanski broj je obavezno polje",
                  })}
                  placeholder="Unesite poštanski broj"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <FormStreetSearch
                  id={`street-${index}`}
                  label="Ulica*"
                  streetFieldName={`addresses.${index}.street`}
                  streetNumberFieldName={`addresses.${index}.streetNumber`}
                  cityId={cityId}
                />
              </div>
              <div className="flex-1">
                <FormInput
                  id={`streetNumber-${index}`}
                  label="Kućni broj*"
                  {...register(`addresses.${index}.streetNumber`, {
                    required: "Kućni broj je obavezno polje",
                  })}
                  placeholder="Unesite kućni broj"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AddressForm;

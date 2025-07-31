import { useFormContext } from "react-hook-form";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import { AddressType } from "~/server/db/schema";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import { translateAddressType } from "~/app/(pages)/users/create/utils";

export type AddressFormProps = {
  type: AddressType;
  street: string;
  streetNumber: string;
  city: string;
  postalCode: string;
  country: string;
};

const AddressForm = () => {
  const { register } = useFormContext();

  return (
    <>
      <FormSelect
        id="type"
        label="Vrsta*"
        {...register("type", {
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
          {...register("street", {
            required: "Ulica je obavezno polje",
          })}
        />
        <FormInput
          id="streetNumber"
          label="Kućni broj*"
          {...register("streetNumber", {
            required: "Kućni broj je obavezno polje",
          })}
        />
      </div>

      <div className="flex gap-10">
        <FormInput
          id="city"
          label="Grad*"
          {...register("city", {
            required: "Grad je obavezno polje",
          })}
        />
        <FormInput
          id="postalCode"
          label="Poštanski broj*"
          {...register("postalCode", {
            required: "Poštanski broj je obavezno polje",
          })}
        />
      </div>

      <FormInput
        id="country"
        label="Država*"
        {...register("country", {
          required: "Država je obavezno polje",
        })}
      />
    </>
  );
};

export default AddressForm;

import { useFormContext } from "react-hook-form";
import { ClothingSize } from "~/server/db/schema";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import FormInput from "~/components/organisms/form/formInput/FormInput";

export type SizeFormProps = {
  size: {
    clothingSize: ClothingSize;
    shoeSize: string;
    height: number;
    weight: number;
  };
};

const SizeForm = () => {
  const { register } = useFormContext();

  return (
    <>
      <FormSelect
        id="clothingSize"
        label="Veličina odjeće*"
        {...register("ç.clothingSize", {
          required: "Velilina odjeće je obavezno polje",
        })}
      >
        {Object.entries(ClothingSize).map(([key, value]) => {
          return (
            <option key={key} value={value}>
              {value}
            </option>
          );
        })}
      </FormSelect>

      <FormInput
        id="shoeSize"
        label="Veličina obuće*"
        type="number"
        {...register("size.shoeSize", {
          required: "Velilina obuće je obavezno polje",
        })}
      />

      <FormInput
        id="height"
        label="Visina (cm)"
        type="number"
        {...register("size.height", {
          valueAsNumber: true,
          min: {
            value: 50,
            message: "Visina mora biti veća od 50 cm",
          },
          max: {
            value: 250,
            message: "Visina ne smije biti veća od 250 cm",
          },
        })}
      />

      <FormInput
        id="weight"
        label="Težina (kg)"
        type="number"
        {...register("size.weight", {
          valueAsNumber: true,
          min: {
            value: 1,
            message: "Težina mora biti veća od 0 kg",
          },
          max: {
            value: 500,
            message: "Težina ne smije biti veća od 500 kg",
          },
        })}
      />
    </>
  );
};

export default SizeForm;

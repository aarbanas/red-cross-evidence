import { useFormContext } from "react-hook-form";
import { ClothingSize } from "~/server/db/schema";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import FormInput from "~/components/organisms/form/formInput/FormInput";

export type SizeFormProps = {
  clothingSize: ClothingSize;
  shoeSize: number;
  height: number;
  weight: number;
};

const SizeForm = () => {
  const { register } = useFormContext();

  return (
    <>
      <FormSelect
        id="clothingSize"
        label="Veličina odjeće*"
        {...register("clothingSize")}
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
        {...register("shoeSize")}
      />

      <FormInput
        id="height"
        label="Visina (cm)"
        type="number"
        {...register("height", {
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
        {...register("weight", {
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

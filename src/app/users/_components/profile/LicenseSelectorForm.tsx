import { type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "~/components/atoms/Button";
import FormComponent from "~/components/organisms/form/formComponent/FormComponent";

const generateId = (() => {
  let id = 0;
  return () => {
    id += 1;
    return id.toString();
  };
})();

const availableItems = [
  { id: generateId(), value: "Driver's License" },
  { id: generateId(), value: "Professional Engineer License" },
  { id: generateId(), value: "Teaching License" },
  { id: generateId(), value: "Medical License" },
  { id: generateId(), value: "Legal License" },
  { id: generateId(), value: "Pilot License" },
  { id: generateId(), value: "Real Estate License" },
  { id: generateId(), value: "Fishing License" },
  { id: generateId(), value: "Hunting License" },
  { id: generateId(), value: "Contractor License" },
];

type FormValues = {
  selectedItems: string[];
};

interface LicenseSelectorFormProps {
  initialValues?: FormValues;
  onSubmit: (values: FormValues) => void | Promise<void>;
}

export const LicenseSelectorForm: FC<LicenseSelectorFormProps> = ({
  initialValues = { selectedItems: [] },
  onSubmit,
}) => {
  const form = useForm<FormValues>({
    values: initialValues,
  });
  const { control, watch, setValue } = form;

  const selectedItems = watch("selectedItems");

  const toggleItem = (itemId: string) => {
    const updatedLicenses = selectedItems.includes(itemId)
      ? selectedItems.filter((i) => i !== itemId)
      : [...selectedItems, itemId];

    setValue("selectedItems", updatedLicenses);
  };

  return (
    <FormComponent form={form} onSubmit={onSubmit}>
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-xl bg-white shadow-md">
        <div className="p-4">
          <Controller
            name="selectedItems"
            control={control}
            render={({ field }) => (
              <div className="mb-4 flex flex-wrap gap-2">
                {availableItems.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      field?.value.includes(item.id)
                        ? "bg-gray-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {item.value}
                  </button>
                ))}
              </div>
            )}
          />
        </div>
        <div className="flex justify-between bg-gray-100 p-4">
          <Button type="submit">Spremi</Button>
        </div>
      </div>
    </FormComponent>
  );
};

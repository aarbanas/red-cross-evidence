import React from "react";
import { useForm } from "react-hook-form";
import FormComponent from "~/components/organisms/form/formComponent/FormComponent";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import { Button } from "~/components/atoms/Button";
import FormTextArea from "~/components/organisms/form/formTextArea/FormTextArea";

export type LicencesFormData = {
  id?: string;
  name: string;
  type: string;
  description?: string;
};

type Props = {
  action: "create" | "update";
  formData?: LicencesFormData;
};

const LicencesForm: React.FC<Props> = ({ action, formData }) => {
  const form = useForm<LicencesFormData>({
    defaultValues: {
      id: formData?.id ?? "",
      name: formData?.name ?? "",
      type: formData?.type ?? "",
      description: formData?.description ?? "",
    },
  });
  const { isSubmitting } = form.formState;
  const handleSubmit = async (data: LicencesFormData) => {
    console.log(data);
  };

  return (
    <FormComponent form={form} onSubmit={handleSubmit}>
      <FormInput
        id="type"
        label="Tip*"
        {...form.register("type", {
          required: "Tip je obavezno polje",
        })}
      />

      <FormInput
        id="title"
        label="Naziv*"
        {...form.register("name", {
          required: "Naziv je obavezno polje",
        })}
      />

      <FormTextArea
        id="description"
        label="Opis"
        {...form.register("description")}
      />

      <Button
        className="bg-black !text-base text-white"
        type="submit"
        showLoading={isSubmitting}
      >
        <span>
          {action === "create" ? "Kreiraj novu licencu" : "Spremi promjene"}
        </span>
      </Button>
    </FormComponent>
  );
};

export default LicencesForm;

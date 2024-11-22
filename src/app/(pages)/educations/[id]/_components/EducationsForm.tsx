import { useForm } from "react-hook-form";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import { Button } from "~/components/atoms/Button";
import FormComponent from "~/components/organisms/form/formComponent/FormComponent";
import React, { useEffect, useState } from "react";
import {
  translateEducationType,
  mapTranslatedEducationType,
} from "~/app/(pages)/educations/utils";
import { EducationType } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

type EducationFormData = {
  type: string;
  title: string;
  description: string;
};

type Props = {
  id: string;
  formData: EducationFormData;
};

const EducationForm: React.FC<Props> = ({ id, formData }) => {
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);
  const form = useForm<EducationFormData>({
    defaultValues: {
      type: formData.type,
      title: formData.title,
      description: formData.description,
    },
  });
  const router = useRouter();

  const { isSubmitting } = form.formState;
  const createEducation = api.education.create.useMutation();
  const updateEducation = api.education.update.useMutation();
  const getUniqueTypes = api.education.getUniqueTypes.useQuery();

  useEffect(() => {
    if (getUniqueTypes.data) {
      setUniqueTypes(getUniqueTypes.data.map((type) => type.type));
    }
  }, [getUniqueTypes.data]);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const inputtedType = form.getValues("type");
      const inputtedTitle = form.getValues("title");
      const inputtedDescription = form.getValues("description");
      let translatedType = mapTranslatedEducationType(inputtedType) as string;
      if (mapTranslatedEducationType(inputtedType) === undefined) {
        translatedType = inputtedType;
      }

      console.log("Translated Type:", translatedType);

      try {
        if (id === "create") {
          await createEducation.mutateAsync({
            type: translatedType,
            title: inputtedTitle,
            description: inputtedDescription,
          });
        } else {
          await updateEducation.mutateAsync({
            id: id,
            type: translatedType,
            title: inputtedTitle,
            description: inputtedDescription,
          });
        }
        router.push("/educations?selected=popis");
      } catch (error) {
        console.error(
          `Failed to ${id === "create" ? "create" : "update"} education:`,
          error,
        );
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  return (
    <FormComponent form={form} onSubmit={handleSubmit}>
      <FormSelect
        id="type"
        label="Tip*"
        {...form.register("type", {
          required: "Tip je obavezno polje",
        })}
        placeholder="Odaberite tip"
      >
        {uniqueTypes.map((type) => (
          <option key={type} value={type}>
            {translateEducationType(type as EducationType)}
          </option>
        ))}
      </FormSelect>

      <FormInput
        id="title"
        label="Naziv*"
        {...form.register("title", {
          required: "Naziv je obavezno polje",
        })}
      />

      <FormInput
        id="description"
        label="Opis*"
        {...form.register("description", {
          required: "Opis je obavezno polje",
        })}
      />

      <Button
        className="bg-black !text-base text-white"
        type="submit"
        showLoading={isSubmitting}
      >
        <span>{id === "create" ? "Kreiraj edukaciju" : "Spremi promjene"}</span>
      </Button>
    </FormComponent>
  );
};

export default EducationForm;

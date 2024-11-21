import { useForm } from "react-hook-form";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import { Button } from "~/components/atoms/Button";
import FormComponent from "~/components/organisms/form/formComponent/FormComponent";
import React, { useState } from "react";
import {
  translateEducationType,
  mapTranslatedEducationType,
} from "~/app/(pages)/educations/utils";
import { EducationType } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

type EducationUpdateFormData = {
  type: string;
  title: string;
  description: string;
};

type Props = {
  id: string;
  formData: EducationUpdateFormData;
};

const EducationForm: React.FC<Props> = ({ id, formData }) => {
  let translatedType = "";
  if (formData.type !== "") {
    translatedType = translateEducationType(formData.type as EducationType);
  }
  const form = useForm<EducationUpdateFormData>({
    values: {
      type: translatedType,
      title: formData.title,
      description: formData.description,
    },
  });
  const router = useRouter();

  const { isSubmitting } = form.formState;
  const updateEducation = api.education.update.useMutation();
  // Handle form submission
  const handleSubmit = async () => {
    try {
      //returns undefined if unknown type
      const inputtedType = form.getValues("type");
      const inputtedTitle = form.getValues("title");
      const inputtedDescription = form.getValues("description");
      let translatedType = mapTranslatedEducationType(inputtedType) as string;
      if (mapTranslatedEducationType(inputtedType) === undefined) {
        translatedType = inputtedType;
      }

      console.log("Translated Type:", translatedType);

      try {
        await updateEducation.mutateAsync({
          id: id,
          type: translatedType,
          title: inputtedTitle,
          description: inputtedDescription,
        });
        router.push("/educations?selected=popis");
      } catch (error) {
        console.error("Failed to delete education:", error);
      }

      // Perform the form submission logic here
      // For example, you can call an API to create or update the education
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  return (
    <FormComponent form={form} onSubmit={handleSubmit}>
      <FormInput
        id="type"
        label="Tip*"
        {...form.register("type", {
          required: "Ime je obavezno polje",
        })}
      />

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
        <span>Spremi promjene</span>
      </Button>
    </FormComponent>
  );
};

export default EducationForm;

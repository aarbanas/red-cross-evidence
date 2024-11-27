import { useForm } from "react-hook-form";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import FormTextarea from "~/components/organisms/form/formTextArea/FormTextArea";
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
  precondition: string;
  duration: string;
  lecturers: string;
  courseDuration: string;
  renewalDuration: string;
  topics: string;
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
      precondition: formData.precondition,
      duration: formData.duration,
      lecturers: formData.lecturers,
      courseDuration: formData.courseDuration,
      renewalDuration: formData.renewalDuration,
      topics: formData.topics,
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
      const inputtedPrecondition = form.getValues("precondition");
      const inputtedDuration = form.getValues("duration");
      const inputtedLecturers = form.getValues("lecturers");
      const inputtedCourseDuration = form.getValues("courseDuration");
      const inputtedRenewalDuration = form.getValues("renewalDuration");
      const inputtedTopics = form.getValues("topics");

      let translatedType = mapTranslatedEducationType(inputtedType) as string;
      if (mapTranslatedEducationType(inputtedType) === undefined) {
        translatedType = inputtedType;
      }

      try {
        if (id === "create") {
          await createEducation.mutateAsync({
            type: translatedType,
            title: inputtedTitle,
            description: inputtedDescription,
            precondition: inputtedPrecondition,
            duration: inputtedDuration,
            lecturers: inputtedLecturers,
            courseDuration: inputtedCourseDuration,
            renewalDuration: inputtedRenewalDuration,
            topics: inputtedTopics,
          });
        } else {
          await updateEducation.mutateAsync({
            id: id,
            type: translatedType,
            title: inputtedTitle,
            description: inputtedDescription,
            precondition: inputtedPrecondition,
            duration: inputtedDuration,
            lecturers: inputtedLecturers,
            courseDuration: inputtedCourseDuration,
            renewalDuration: inputtedRenewalDuration,
            topics: inputtedTopics,
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
          <option key={type} value={type} selected={type == formData.type}>
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

      <FormTextarea
        id="description"
        label="Opis*"
        {...form.register("description", {
          required: "Opis je obavezno polje",
        })}
      />

      {(id === "create" || formData.precondition) && (
        <FormTextarea
          id="precondition"
          label="Preduvjet"
          {...form.register("precondition")}
        />
      )}

      {(id === "create" || formData.duration) && (
        <FormInput
          id="duration"
          label="Trajanje"
          {...form.register("duration")}
        />
      )}

      {(id === "create" || formData.lecturers) && (
        <FormInput
          id="lecturers"
          label="Predavači"
          {...form.register("lecturers")}
        />
      )}

      {(id === "create" || formData.courseDuration) && (
        <FormInput
          id="courseDuration"
          label="Trajanje tečaja"
          {...form.register("courseDuration")}
        />
      )}

      {(id === "create" || formData.renewalDuration) && (
        <FormInput
          id="renewalDuration"
          label="Trajanje obnove"
          {...form.register("renewalDuration")}
        />
      )}

      {(id === "create" || formData.topics) && (
        <FormTextarea id="topics" label="Teme" {...form.register("topics")} />
      )}

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

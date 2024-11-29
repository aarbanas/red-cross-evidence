import { useForm } from "react-hook-form";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import FormTextarea from "~/components/organisms/form/formTextArea/FormTextArea";
import { Button } from "~/components/atoms/Button";
import FormComponent from "~/components/organisms/form/formComponent/FormComponent";
import React from "react";
import {
  translateEducationType,
  mapTranslatedEducationType,
} from "~/app/(pages)/educations/utils";
import { type EducationType } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export type EducationFormData = {
  id?: string;
  type: string;
  title: string;
  description: string;
  precondition?: string;
  duration?: string;
  lecturers?: string;
  courseDuration?: string;
  renewalDuration?: string;
  topics?: string;
};

type Props = {
  id: string;
  formData: EducationFormData;
  uniqueTypes: { type: string }[];
};

const EducationForm: React.FC<Props> = ({ id, formData, uniqueTypes }) => {
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

  // Handle form submission
  const handleSubmit = async () => {
    const data = form.getValues();

    try {
      if (id === "create") {
        await createEducation.mutateAsync({
          type: data.type,
          title: data.title,
          description: data.description,
          precondition: data.precondition ?? "",
          duration: data.duration ?? "",
          lecturers: data.lecturers ?? "",
          courseDuration: data.courseDuration ?? "",
          renewalDuration: data.renewalDuration ?? "",
          topics: data.topics ?? "",
        });
      } else {
        await updateEducation.mutateAsync({
          id: id,
          type: data.type,
          title: data.title,
          description: data.description,
          precondition: data.precondition ?? "",
          duration: data.duration ?? "",
          lecturers: data.lecturers ?? "",
          courseDuration: data.courseDuration ?? "",
          renewalDuration: data.renewalDuration ?? "",
          topics: data.topics ?? "",
        });
      }
      router.push("/educations?selected=popis");
    } catch (error) {
      console.error(
        `Failed to ${id === "create" ? "create" : "update"} education:`,
        error,
      );
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
          <option
            key={type.type}
            value={type.type}
            selected={type.type == formData.type}
          >
            {translateEducationType(type.type as EducationType)}
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

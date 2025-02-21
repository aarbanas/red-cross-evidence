"use client";
import React, { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import FormTextarea from "~/components/organisms/form/formTextArea/FormTextArea";
import { Button } from "~/components/atoms/Button";
import FormComponent from "~/components/organisms/form/formComponent/FormComponent";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import { translateEducationType } from "~/app/(pages)/educations/utils";
import { EducationType } from "~/server/db/schema";

export type EducationTermFormData = {
  id?: string;
  title: string;
  dateFrom: string;
  dateTo: string;
  maxParticipants: number;
  lecturers: string;
  location: string;
  educationId: string;
};

type Props = {
  action: "create" | "update";
  formData?: Partial<EducationTermFormData>;
  educationTermId?: string | string[];
  educationTypes: { type: string }[];
};

const EducationsTermForm: FC<Props> = ({
  action,
  formData,
  educationTermId,
  educationTypes,
}) => {
  const form = useForm<EducationTermFormData & { type: EducationType }>({
    defaultValues: {
      title: formData?.title ?? "",
      dateFrom: formData?.dateFrom ?? "",
      dateTo: formData?.dateTo ?? "",
      maxParticipants: formData?.maxParticipants ?? undefined,
      lecturers: formData?.lecturers ?? "",
      location: formData?.location ?? "",
      educationId: formData?.educationId ?? "",
    },
  });

  const router = useRouter();

  const { watch, setValue } = form;
  const { isSubmitting } = form.formState;
  const educationType = watch("type", EducationType.VOLUNTEERS);
  const createEducationTerm = api.education.term.create.useMutation();
  const updateEducationTerm = api.education.term.update.useMutation();
  const { data: educations } =
    api.education.list.getAllTitles.useQuery(educationType);

  useEffect(() => {
    setValue("educationId", "");
  }, [educationType, setValue]);

  // Handle form submission
  const handleSubmit = async () => {
    const data = form.getValues();

    try {
      const formData: EducationTermFormData = {
        title: data.title,
        dateFrom: data.dateFrom,
        dateTo: data.dateTo,
        maxParticipants: data.maxParticipants,
        lecturers: data.lecturers,
        location: data.location,
        educationId: data.educationId,
        ...(educationTermId && { id: educationTermId as string }),
      };
      if (action === "create") {
        await createEducationTerm.mutateAsync(formData);
      } else {
        await updateEducationTerm.mutateAsync(formData);
      }
      router.push("/educations/term");
    } catch (error) {
      console.error(
        `Failed to ${action === "create" ? "create" : "update"} education:`,
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
        {educationTypes.map((type) => (
          <option key={type.type} value={type.type}>
            {translateEducationType(type.type as EducationType)}
          </option>
        ))}
      </FormSelect>

      {educations?.length && (
        <FormSelect
          id="education"
          label="Edukacija*"
          {...form.register("educationId", {
            required: "Edukacija je obavezno polje",
          })}
          placeholder="Odaberite edukaciju"
        >
          {educations.map((education) => (
            <option key={education.id} value={education.title}>
              {education.title}
            </option>
          ))}
        </FormSelect>
      )}

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
        {...form.register("dateFrom", {
          required: "Opis je obavezno polje",
        })}
      />

      <Button
        className="bg-black !text-base text-white"
        type="submit"
        showLoading={isSubmitting}
      >
        <span>
          {action === "create" ? "Kreiraj termin edukacije" : "Spremi promjene"}
        </span>
      </Button>
    </FormComponent>
  );
};

export default EducationsTermForm;

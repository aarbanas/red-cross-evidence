"use client";
import React, { type FC } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import FormTextarea from "~/components/organisms/form/formTextArea/FormTextArea";
import { Button } from "~/components/atoms/Button";
import FormComponent from "~/components/organisms/form/formComponent/FormComponent";

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
};

const EducationsTermForm: FC<Props> = ({
  action,
  formData,
  educationTermId,
}) => {
  const form = useForm<EducationTermFormData>({
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

  const { isSubmitting } = form.formState;
  const createEducationTerm = api.education.term.create.useMutation();
  const updateEducationTerm = api.education.term.update.useMutation();

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

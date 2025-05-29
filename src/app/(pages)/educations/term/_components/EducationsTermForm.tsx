"use client";
import React, { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import { Button } from "~/components/atoms/Button";
import FormComponent from "~/components/organisms/form/formComponent/FormComponent";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import { translateEducationType } from "~/app/(pages)/educations/utils";
import { EducationType } from "~/server/db/schema";
import FormDatePicker from "~/components/organisms/form/formDatePicker/FormDatePicker";
import FormTextArea from "~/components/organisms/form/formTextArea/FormTextArea";
import moment from "moment";

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
  const { data: educations } = api.education.list.getAllTitles.useQuery(
    action === "create" ? educationType : undefined,
  );

  useEffect(() => {
    if (action === "update") {
      const education = educations?.find(
        (education) => education.id === formData?.educationId,
      );

      setValue(
        "type",
        (education?.type as EducationType) ?? EducationType.VOLUNTEERS,
      );
      console.log(form.getValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [educations]);

  // Handle form submission
  const handleSubmit = async () => {
    const data = form.getValues();

    try {
      const formData: EducationTermFormData = {
        title: data.title,
        dateFrom: moment(data.dateFrom).format("YYYY-MM-DD:HH:mm:ss"),
        dateTo: moment(data.dateTo).format("YYYY-MM-DD:HH:mm:ss"),
        maxParticipants: Number(data.maxParticipants),
        lecturers: data.lecturers,
        location: data.location,
        educationId: data.educationId,
        ...(educationTermId && { id: educationTermId as string }),
      };
      if (action === "create") {
        await createEducationTerm.mutateAsync(formData);
      } else if (action === "update") {
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
        disabled={action === "update"}
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
          id="educationId"
          label="Edukacija*"
          disabled={action === "update"}
          {...form.register("educationId", {
            required: "Edukacija je obavezno polje",
          })}
          placeholder="Odaberite edukaciju"
        >
          {educations.map((education) => (
            <option key={education.id} value={education.id}>
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

      <FormDatePicker
        id="dateFrom"
        label="Datum od*"
        partOfDay="START"
        value={formData?.dateFrom}
        {...form.register("dateFrom", {
          required: "Datum od je obavezno polje",
        })}
      />

      <FormDatePicker
        id="dateTo"
        label="Datum do*"
        partOfDay="END"
        value={formData?.dateTo}
        {...form.register("dateTo", { required: "Datum do je obavezno polje" })}
      />

      <FormInput
        id="maxParticipants"
        label="Maksimalan broj sudionika*"
        type="number"
        {...form.register("maxParticipants", {
          required: "Maksimalan broj sudionika je obavezno polje",
        })}
      />

      <FormInput
        id="location"
        label="Lokacija*"
        type="text"
        {...form.register("location", {
          required: "Lokacija je obavezno polje",
        })}
      />

      <FormTextArea
        id="lecturers"
        label="Predavači*"
        {...form.register("lecturers", {
          required: "Predavači su obavezno polje",
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

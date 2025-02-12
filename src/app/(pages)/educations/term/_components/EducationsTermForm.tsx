import { type FC } from "react";
import { useForm } from "react-hook-form";

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
  formData: EducationTermFormData;
};

const EducationsTermForm: FC<Props> = ({ action, formData }) => {
  const form = useForm<EducationTermFormData>({
    defaultValues: {
      title: formData.title,
      dateFrom: formData.dateFrom,
      dateTo: formData.dateTo,
      maxParticipants: formData.maxParticipants,
      lecturers: formData.lecturers,
      location: formData.location,
      educationId: formData.educationId,
    },
  });
  return <div>Form</div>;
};

export default EducationsTermForm;

import generateForm, {
  type FormStep,
} from "~/components/organisms/multiStepForm/MultiStepForm";
import {
  ProfileForm,
  type ProfileFormProps,
} from "~/app/(pages)/users/create/formComponents/ProfileForm";
import AddressForm, {
  type AddressFormProps,
} from "~/app/(pages)/users/create/formComponents/AddressForm";
import WorkStatusForm, {
  type WorkStatusFormProps,
} from "~/app/(pages)/users/create/formComponents/WorkStatusForm";
import SizeForm, {
  type SizeFormProps,
} from "~/app/(pages)/users/create/formComponents/SizeForm";
import { api } from "~/trpc/react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import React from "react";
import SkillsForm from "~/app/(pages)/users/create/formComponents/SkillsForm";
import { z } from "zod";

type Inputs = ProfileFormProps &
  AddressFormProps &
  WorkStatusFormProps &
  SizeFormProps;

const schema = z.object({
  profile: z.object({
    firstName: z.string().min(1, "Ime je obavezno"),
    lastName: z.string().min(1, "Prezime je obavezno"),
    oib: z
      .string()
      .min(11, "Oib mora imati 11 znamenki")
      .max(11, "Oib mora imati 11 znamenki"),
    sex: z.string(),
    email: z.string().email("Neispravan email"),
    parentName: z.string().optional(),
    nationality: z.string().optional(),
    birthDate: z.string().optional(),
    birthPlace: z.string().optional(),
    phone: z.string().optional(),
  }),
  address: z.object({
    type: z.string().min(1, "Tip je obavezan"),
    street: z.string().min(1, "Ulica je obavezna"),
    streetNumber: z.string().min(1, "Kucni broj je obavezan"),
    city: z.union([
      z.string().min(1, "Grad je obavezan"),
      z.object({
        id: z.string(),
        name: z.string(),
        postalCode: z.string().nullable(),
      }),
    ]),
    postalCode: z.string().min(1, "Poštanski broj je obavezan"),
    country: z.string().min(1, "Država je obavezna"),
  }),
  workStatus: z.object({
    status: z.string().min(1, "Status je obavezan"),
    educationLevel: z.string().optional(),
    profession: z.string().optional(),
    institution: z.string().optional(),
  }),
  size: z.object({
    clothingSize: z.string().min(1),
    shoeSize: z.string().min(1),
    height: z
      .number()
      .min(50, "Visina mora biti veća od 50 cm")
      .max(250, "Visina ne smije biti veća od 250 cm")
      .nullable()
      .optional(),
    weight: z
      .number()
      .min(1, "Težina mora biti veća od 0 kg")
      .max(500, "Težina ne smije biti veća od 500 kg")
      .nullable()
      .optional(),
  }),
  skills: z.object({
    selectedLanguages: z
      .array(z.object({ id: z.string(), level: z.string() }))
      .optional(),
    selectedLicences: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          type: z.string(),
        }),
      )
      .optional(),
    otherSkills: z
      .array(
        z.object({
          name: z.string(),
          description: z.string(),
        }),
      )
      .optional(),
  }),
});

const CreateUserForm = () => {
  const { data, isLoading, error } = api.country.getAllCountries.useQuery();
  const {
    data: languageData,
    isLoading: isLanguageLoading,
    error: languageError,
  } = api.skill.languages.getAll.useQuery();
  const {
    data: licenceData,
    isLoading: isLicenceLoading,
    error: licenceError,
  } = api.license.findAll.useQuery();

  if (isLoading || isLanguageLoading || isLicenceLoading)
    return <LoadingSpinner />;

  if (error ?? languageError ?? licenceError) return <div>Greška</div>;

  const formSteps: FormStep[] = [
    {
      name: "Osnovni podaci",
      form: <ProfileForm />,
    },
    {
      name: "Adresa",
      form: <AddressForm countries={data!} />,
    },
    {
      name: "Radni status",
      form: <WorkStatusForm />,
    },
    {
      name: "Garderoba i mjere",
      form: <SizeForm />,
    },
    {
      name: "Vještine",
      form: <SkillsForm languages={languageData!} licences={licenceData!} />,
    },
  ];
  const onSubmit = (data: Inputs) => {
    // Handle form submission logic here
    alert(JSON.stringify(data));
  };

  return generateForm<Inputs>(formSteps, onSubmit, schema, true);
};

export default CreateUserForm;

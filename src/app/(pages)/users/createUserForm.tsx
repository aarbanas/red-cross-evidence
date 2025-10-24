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
import { createUserSchema } from "~/server/api/schema";

type Inputs = ProfileFormProps &
  AddressFormProps &
  WorkStatusFormProps &
  SizeFormProps;

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

  return generateForm<Inputs>(formSteps, onSubmit, createUserSchema, true);
};

export default CreateUserForm;

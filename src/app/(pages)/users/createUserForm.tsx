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

type Inputs = ProfileFormProps &
  AddressFormProps &
  WorkStatusFormProps &
  SizeFormProps;

const CreateUserForm = () => {
  const { data, isLoading, error } = api.country.getAllCountries.useQuery();

  if (isLoading) return <LoadingSpinner />;

  if (error ?? !data?.length) return <div>Greška</div>;

  const formSteps: FormStep[] = [
    {
      name: "Osnovni podaci",
      form: <ProfileForm />,
    },
    {
      name: "Adresa",
      form: <AddressForm countries={data} />,
    },
    {
      name: "Radni status",
      form: <WorkStatusForm />,
    },
    {
      name: "Roba i mjere",
      form: <SizeForm />,
    },
  ];
  const onSubmit = (data: Inputs) => {
    // Handle form submission logic here
    alert(JSON.stringify(data));
  };

  return generateForm<Inputs>(formSteps, onSubmit);
};

export default CreateUserForm;

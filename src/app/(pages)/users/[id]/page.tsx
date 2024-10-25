"use client";
import MainLayout from "~/components/layout/mainLayout";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import FormComponent from "~/components/organisms/form/formComponent/FormComponent";
import { useForm } from "react-hook-form";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import FormSwitch from "~/components/organisms/form/formSwitch/FormSwitch";
import { Button } from "~/components/atoms/Button";

type FindUserReturnDTO = {
  id: string;
  email: string;
  active: boolean;
  firstname: string;
  lastname: string;
};

export default function UserDetailPage() {
  const { id } = useParams(); // Get the user ID from the URL

  // Fetch user data by ID
  const { data, isLoading, error } = api.user.findById.useQuery({
    id: id as string,
  });

  const form = useForm<FindUserReturnDTO>({
    defaultValues: {
      email: data?.email ?? "",
      active: data?.active ?? false,
      firstname: data?.profile?.firstName ?? "",
      lastname: data?.profile?.lastName ?? "",
    },
  });
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for form submission goes here
  };

  return (
    <MainLayout
      headerChildren={
        <h1 className="text-xl font-bold">
          Uređivanje volontera {data?.profile?.firstName}{" "}
          {data?.profile?.lastName}
        </h1>
      }
    >
      <div>
        {isLoading && <LoadingSpinner />}
        {error && <div>Greška</div>}

        <FormComponent form={form} onSubmit={handleSubmit}>
          <FormInput
            id="firstname"
            label="Ime*"
            {...form.register("firstname", {
              required: "Ime je obavezno polje",
            })}
          />

          <FormInput
            id="lastname"
            label="Prezime*"
            {...form.register("lastname", {
              required: "Prezime je obavezno polje",
            })}
          />

          <FormInput
            id="email"
            label="Email*"
            {...form.register("email", {
              required: "Email je obavezno polje",
            })}
          />

          <FormSwitch
            id="active"
            label="Aktivan"
            active={data?.active ?? false}
            setActive={() => {
              console.log("Switched");
            }}
          />

          <Button className="bg-black !text-base text-white" type="submit">
            <span>Spremi promjene</span>
          </Button>
        </FormComponent>
      </div>
    </MainLayout>
  );
}

import { useForm } from "react-hook-form";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import FormSwitch from "~/components/organisms/form/formSwitch/FormSwitch";
import { Button } from "~/components/atoms/Button";
import FormComponent from "~/components/organisms/form/formComponent/FormComponent";
import React from "react";

type UserUpdateFormData = {
  email: string;
  active: boolean;
  firstname: string;
  lastname: string;
};

type Props = {
  formData: UserUpdateFormData;
};

const UserForm: React.FC<Props> = ({ formData }) => {
  const form = useForm<UserUpdateFormData>({
    defaultValues: {
      email: formData.email,
      active: formData.active,
      firstname: formData.firstname,
      lastname: formData.lastname,
    },
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for form submission goes here
  };

  return (
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
        active={formData.active}
        setActive={() => {
          console.log("Switched");
        }}
      />

      <Button className="bg-black !text-base text-white" type="submit">
        <span>Spremi promjene</span>
      </Button>
    </FormComponent>
  );
};

export default UserForm;

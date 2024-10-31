import { useForm } from "react-hook-form";
import FormInput from "~/components/organisms/form/formInput/FormInput";
import FormSwitch from "~/components/organisms/form/formSwitch/FormSwitch";
import { Button } from "~/components/atoms/Button";
import FormComponent from "~/components/organisms/form/formComponent/FormComponent";
import React, { useState } from "react";

type UserUpdateFormData = {
  email: string;
  active: boolean;
  firstname: string;
  lastname: string;
};

type Props = {
  id: string;
  formData: UserUpdateFormData;
};

const UserForm: React.FC<Props> = ({ id, formData }) => {
  const [active, setActive] = useState(formData.active);

  const form = useForm<UserUpdateFormData>({
    values: {
      email: formData.email,
      active: formData.active,
      firstname: formData.firstname,
      lastname: formData.lastname,
    },
  });
  const { isSubmitting } = form.formState;

  // Handle form submission
  const handleSubmit = async () => {
    form.setValue("active", active);
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
        active={active}
        setActive={setActive}
      />

      <Button
        className="bg-black !text-base text-white"
        type="submit"
        showLoading={isSubmitting}
      >
        <span>Spremi promjene</span>
      </Button>
    </FormComponent>
  );
};

export default UserForm;

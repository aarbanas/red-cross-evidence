'use client';

import { useParams, useRouter } from 'next/navigation';
import type React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button } from '~/components/atoms/Button';
import FormCityPicker from '~/components/organisms/form/formCityPicker/FormCityPicker';
import FormComponent from '~/components/organisms/form/formComponent/FormComponent';
import FormInput from '~/components/organisms/form/formInput/FormInput';
import { api } from '~/trpc/react';

export type SocietyFormData = {
  id?: string;
  name: string;
  address: string;
  director: string;
  phone?: string;
  email?: string;
  website?: string;
  cityId?: string;
  cityName?: string;
};

type Props = {
  action: 'create' | 'update';
  formData?: SocietyFormData;
};

const SocietyForm: React.FC<Props> = ({ action, formData }) => {
  const form = useForm<SocietyFormData>({
    defaultValues: {
      id: formData?.id ?? '',
      name: formData?.name ?? '',
      address: formData?.address ?? '',
      director: formData?.director ?? '',
      phone: formData?.phone ?? '',
      email: formData?.email ?? '',
      website: formData?.website ?? '',
      cityId: formData?.cityId ?? '',
    },
  });
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { isSubmitting } = form.formState;
  const createSociety = api.society.create.useMutation();
  const updateSociety = api.society.update.useMutation();

  const { data: countries } = api.country.getAllCountries.useQuery();
  const croatia = countries?.find((c) => c.name === 'Hrvatska');

  const handleSubmit = async () => {
    const data = form.getValues();

    try {
      const payload: SocietyFormData = {
        name: data.name,
        address: data.address,
        director: data.director,
        phone: data.phone,
        email: data.email,
        website: data.website,
        cityId: data.cityId || undefined,
        ...(params.id && { id: params.id }),
      };

      if (action === 'create') {
        await createSociety.mutateAsync(payload);
      } else {
        await updateSociety.mutateAsync(payload);
      }

      router.push('/societies/list');
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message, { type: 'error' });
      }
    }
  };

  return (
    <FormComponent form={form} onSubmit={handleSubmit}>
      <FormInput
        id="name"
        label="Naziv*"
        {...form.register('name', { required: 'Naziv je obavezno polje' })}
      />

      <FormInput
        id="address"
        label="Adresa*"
        {...form.register('address', { required: 'Adresa je obavezno polje' })}
      />

      <FormInput
        id="director"
        label="Ravnatelj*"
        {...form.register('director', {
          required: 'Ravnatelj je obavezno polje',
        })}
      />

      <FormInput id="phone" label="Telefon" {...form.register('phone')} />

      <FormInput id="email" label="E-mail" {...form.register('email')} />

      <FormInput id="website" label="Web" {...form.register('website')} />

      {croatia && (
        <FormCityPicker
          id="cityId"
          label="Grad"
          fieldName="cityId"
          countryId={croatia.id}
          initialCityName={formData?.cityName}
        />
      )}

      <Button
        className="!text-base bg-black text-white"
        type="submit"
        showLoading={isSubmitting}
      >
        <span>
          {action === 'create' ? 'Kreiraj novo društvo' : 'Spremi promjene'}
        </span>
      </Button>
    </FormComponent>
  );
};

export default SocietyForm;

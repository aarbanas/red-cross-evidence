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

export type CitySocietyFormData = {
  id?: string;
  name: string;
  address: string;
  director: string;
  phone?: string;
  email?: string;
  website?: string;
  cityId?: string;
  cityName?: string;
  societyId?: string;
};

type Props = {
  action: 'create' | 'update';
  formData?: CitySocietyFormData;
};

const CitySocietyForm: React.FC<Props> = ({ action, formData }) => {
  const form = useForm<CitySocietyFormData>({
    defaultValues: {
      id: formData?.id ?? '',
      name: formData?.name ?? '',
      address: formData?.address ?? '',
      director: formData?.director ?? '',
      phone: formData?.phone ?? '',
      email: formData?.email ?? '',
      website: formData?.website ?? '',
      cityId: formData?.cityId ?? '',
      societyId: formData?.societyId ?? '',
    },
  });
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { isSubmitting } = form.formState;

  const { data: societyOptions } = api.society.findAll.useQuery();
  const { data: countries } = api.country.getAllCountries.useQuery();
  const croatia = countries?.find((c) => c.name === 'Hrvatska');

  const createCitySociety = api.citySociety.create.useMutation();
  const updateCitySociety = api.citySociety.update.useMutation();

  const handleSubmit = async () => {
    const data = form.getValues();

    try {
      const payload: CitySocietyFormData = {
        name: data.name,
        address: data.address,
        director: data.director,
        phone: data.phone,
        email: data.email,
        website: data.website,
        cityId: data.cityId || undefined,
        societyId: data.societyId,
        ...(params.id && { id: params.id }),
      };

      if (action === 'create') {
        await createCitySociety.mutateAsync(payload);
      } else {
        await updateCitySociety.mutateAsync(payload);
      }

      router.push('/societies/city');
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

      <div className="flex flex-col gap-1">
        <label htmlFor="societyId" className="font-medium text-sm">
          Društvo
        </label>
        <select
          id="societyId"
          className="rounded-md border px-3 py-2 text-sm"
          {...form.register('societyId')}
        >
          <option value="">-- Odaberi društvo --</option>
          {societyOptions?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <Button
        className="!text-base bg-black text-white"
        type="submit"
        showLoading={isSubmitting}
      >
        <span>
          {action === 'create'
            ? 'Kreiraj novo gradsko društvo'
            : 'Spremi promjene'}
        </span>
      </Button>
    </FormComponent>
  );
};

export default CitySocietyForm;

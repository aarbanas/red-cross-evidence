'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { translateAddressType } from '~/app/(pages)/users/create/utils';
import { Button } from '~/components/atoms/Button';
import FormCitySearch from '~/components/organisms/form/formCitySearch/FormCitySearch';
import FormComponent from '~/components/organisms/form/formComponent/FormComponent';
import FormInput from '~/components/organisms/form/formInput/FormInput';
import FormSelect from '~/components/organisms/form/formSelect/FormSelect';
import FormStreetSearch from '~/components/organisms/form/formStreetSearch/FormStreetSearch';
import { AddressType } from '~/server/db/schema';
import type { SearchCityReturnDTO } from '~/server/services/city/city.repository';
import { api } from '~/trpc/react';

type AddressEntry = {
  addressId: string;
  street: string;
  streetNumber: string;
  type: AddressType;
  isPrimary: boolean | null;
  city: { id: string; name: string; postalCode: string | null } | null;
  country: { id: string; name: string } | null;
};

type AddressFormValues = {
  street: string;
  streetNumber: string;
  type: string;
  city: string | SearchCityReturnDTO;
  postalCode: string;
  country: string;
  isPrimary: boolean;
};

type Props = {
  userId: string;
  addresses: AddressEntry[];
  countries: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date | null;
  }[];
};

const AddressesEditForm = ({ userId, addresses, countries }: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const utils = api.useUtils();

  const deleteAddress = api.user.deleteAddress.useMutation({
    onSuccess: async () => {
      await utils.user.getAddresses.invalidate({ userId });
      toast('Adresa uspješno obrisana', { type: 'success' });
    },
    onError: (error) => toast(error.message, { type: 'error' }),
  });

  const setPrimary = api.user.setPrimaryAddress.useMutation({
    onSuccess: async () => {
      await utils.user.getAddresses.invalidate({ userId });
      toast('Primarna adresa postavljena', { type: 'success' });
    },
    onError: (error) => toast(error.message, { type: 'error' }),
  });

  const handleDelete = (addressId: string, isPrimary: boolean | null) => {
    if (isPrimary && addresses.length === 1) {
      toast(
        'Ne možete obrisati jedinu primarnu adresu. Dodajte novu adresu i postavite je kao primarnu.',
        { type: 'warning' },
      );
      return;
    }

    deleteAddress.mutate({ userId, addressId });
  };

  return (
    <div className="space-y-6">
      {addresses.map((addr) => (
        <div key={addr.addressId} className="rounded-lg border p-6">
          {editingId === addr.addressId ? (
            <EditAddressForm
              userId={userId}
              address={addr}
              countries={countries}
              onDone={() => {
                setEditingId(null);
                void utils.user.getAddresses.invalidate({ userId });
              }}
            />
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">
                    {addr.street} {addr.streetNumber}
                  </span>
                  {addr.isPrimary && (
                    <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-green-700 text-xs">
                      Primarna
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {!addr.isPrimary && (
                    <Button
                      type="button"
                      variant="outline"
                      className="text-sm"
                      onClick={() =>
                        setPrimary.mutate({
                          userId,
                          addressId: addr.addressId,
                        })
                      }
                    >
                      Postavi kao primarnu
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingId(addr.addressId)}
                  >
                    Uredi
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={
                      (addr.isPrimary ?? false) && addresses.length === 1
                    }
                    onClick={() => handleDelete(addr.addressId, addr.isPrimary)}
                  >
                    Obriši
                  </Button>
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                {addr.city?.name}
                {addr.city?.postalCode ? `, ${addr.city.postalCode}` : ''} —{' '}
                {addr.country?.name}
              </p>
              <p className="text-gray-500 text-sm">
                {translateAddressType(addr.type)}
              </p>
            </div>
          )}
        </div>
      ))}

      <NewAddressForm userId={userId} countries={countries} />
    </div>
  );
};

const EditAddressForm = ({
  userId,
  address,
  countries,
  onDone,
}: {
  userId: string;
  address: AddressEntry;
  countries: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date | null;
  }[];
  onDone: () => void;
}) => {
  'use no memo';
  const form = useForm<AddressFormValues>({
    defaultValues: {
      street: address.street,
      streetNumber: address.streetNumber,
      type: address.type,
      city: address.city ?? '',
      postalCode: address.city?.postalCode ?? '',
      country: address.country?.id ?? '',
      isPrimary: address.isPrimary ?? false,
    },
  });

  const { isSubmitting } = form.formState;
  const selectedCountry = form.watch('country');
  const selectedCity = form.watch('city') as
    | SearchCityReturnDTO
    | string
    | undefined;
  const cityId =
    typeof selectedCity === 'object' && selectedCity?.id
      ? selectedCity.id
      : undefined;

  const updateAddress = api.user.updateAddress.useMutation({
    onSuccess: () => {
      toast('Adresa uspješno ažurirana', { type: 'success' });
      onDone();
    },
    onError: (error) => toast(error.message, { type: 'error' }),
  });

  const handleSubmit = async () => {
    const data = form.getValues();

    await updateAddress.mutateAsync({
      userId,
      oldAddressId: address.addressId,
      address: {
        street: data.street,
        streetNumber: data.streetNumber,
        type: data.type as AddressType,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        isPrimary: data.isPrimary,
      },
    });
  };

  return (
    <FormComponent form={form} onSubmit={handleSubmit}>
      <FormSelect
        id={`type-edit-${address.addressId}`}
        label="Vrsta*"
        {...form.register('type', { required: true })}
        placeholder="Odaberite vrstu adrese"
      >
        {Object.entries(AddressType).map(([key, value]) => (
          <option key={key} value={value}>
            {translateAddressType(value)}
          </option>
        ))}
      </FormSelect>

      <FormSelect
        id={`country-edit-${address.addressId}`}
        label="Država*"
        {...form.register('country', { required: true })}
        placeholder="Odaberite državu"
      >
        {countries.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </FormSelect>

      <div className="flex gap-4">
        <div className="flex-1">
          <FormCitySearch
            id={`city-edit-${address.addressId}`}
            label="Grad*"
            cityFieldName="city"
            postalCodeFieldName="postalCode"
            countryId={selectedCountry}
          />
        </div>
        <div className="flex-1">
          <FormInput
            id={`postalCode-edit-${address.addressId}`}
            label="Poštanski broj*"
            {...form.register('postalCode', { required: true })}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <FormStreetSearch
            id={`street-edit-${address.addressId}`}
            label="Ulica*"
            streetFieldName="street"
            streetNumberFieldName="streetNumber"
            cityId={cityId}
          />
        </div>
        <div className="flex-1">
          <FormInput
            id={`streetNumber-edit-${address.addressId}`}
            label="Kućni broj*"
            {...form.register('streetNumber', { required: true })}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          className="bg-black text-white"
          showLoading={isSubmitting}
        >
          Spremi promjene
        </Button>
        <Button type="button" variant="outline" onClick={onDone}>
          Odustani
        </Button>
      </div>
    </FormComponent>
  );
};

const NewAddressForm = ({
  userId,
  countries,
}: {
  userId: string;
  countries: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date | null;
  }[];
}) => {
  'use no memo';
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();
  const form = useForm<AddressFormValues>({
    defaultValues: {
      street: '',
      streetNumber: '',
      type: AddressType.PERMANENT_RESIDENCE,
      city: '',
      postalCode: '',
      country: '',
      isPrimary: false,
    },
  });

  const { isSubmitting } = form.formState;
  const selectedCountry = form.watch('country');
  const selectedCity = form.watch('city') as
    | SearchCityReturnDTO
    | string
    | undefined;
  const cityId =
    typeof selectedCity === 'object' && selectedCity?.id
      ? selectedCity.id
      : undefined;

  const addAddress = api.user.addAddress.useMutation({
    onSuccess: async () => {
      await utils.user.getAddresses.invalidate({ userId });
      toast('Adresa uspješno dodana', { type: 'success' });
      form.reset();
      setOpen(false);
    },
    onError: (error) => toast(error.message, { type: 'error' }),
  });

  const handleSubmit = async () => {
    const data = form.getValues();

    await addAddress.mutateAsync({
      userId,
      address: {
        street: data.street,
        streetNumber: data.streetNumber,
        type: data.type as AddressType,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        isPrimary: data.isPrimary,
      },
    });
  };

  if (!open) {
    return (
      <Button
        type="button"
        variant="outline"
        className="bg-blue-50 text-blue-700 hover:bg-blue-100"
        onClick={() => setOpen(true)}
      >
        + Dodaj adresu
      </Button>
    );
  }

  return (
    <div className="rounded-lg border p-6">
      <h3 className="mb-4 font-medium text-lg">Nova adresa</h3>
      <FormComponent form={form} onSubmit={handleSubmit}>
        <FormSelect
          id="new-type"
          label="Vrsta*"
          {...form.register('type', { required: true })}
          placeholder="Odaberite vrstu adrese"
        >
          {Object.entries(AddressType).map(([key, value]) => (
            <option key={key} value={value}>
              {translateAddressType(value)}
            </option>
          ))}
        </FormSelect>

        <FormSelect
          id="new-country"
          label="Država*"
          {...form.register('country', { required: true })}
          placeholder="Odaberite državu"
        >
          {countries.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </FormSelect>

        <div className="flex gap-4">
          <div className="flex-1">
            <FormCitySearch
              id="new-city"
              label="Grad*"
              cityFieldName="city"
              postalCodeFieldName="postalCode"
              disabled={!selectedCountry}
              countryId={selectedCountry}
            />
          </div>
          <div className="flex-1">
            <FormInput
              id="new-postalCode"
              disabled={!selectedCountry}
              label="Poštanski broj*"
              {...form.register('postalCode', { required: true })}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <FormStreetSearch
              id="new-street"
              label="Ulica*"
              streetFieldName="street"
              streetNumberFieldName="streetNumber"
              cityId={cityId}
            />
          </div>
          <div className="flex-1">
            <FormInput
              id="new-streetNumber"
              label="Kućni broj*"
              {...form.register('streetNumber', { required: true })}
            />
          </div>
        </div>

        <FormInput
          id="new-isPrimary"
          label="Primarna adresa"
          type="checkbox"
          {...form.register('isPrimary')}
        />

        <div className="flex gap-2">
          <Button
            type="submit"
            className="bg-black text-white"
            showLoading={isSubmitting}
          >
            Dodaj adresu
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setOpen(false);
            }}
          >
            Odustani
          </Button>
        </div>
      </FormComponent>
    </div>
  );
};

export default AddressesEditForm;

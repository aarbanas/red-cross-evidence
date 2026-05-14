import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { translateSex } from '~/app/(pages)/users/create/utils';
import FormInput from '~/components/organisms/form/formInput/FormInput';
import FormSelect from '~/components/organisms/form/formSelect/FormSelect';
import { Sex } from '~/server/db/schema';
import { api } from '~/trpc/react';

const PGZ_SOCIETY_NAME = 'Društvo Crvenog Križa Primorsko-goranske županije';

export type ProfileFormProps = {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    oib: string;
    sex: string;
    parentName: string;
    nationality: string;
    birthDate: string;
    birthPlace: string;
    societyId?: string;
    citySocietyId?: string;
  };
};

export const ProfileForm = () => {
  const { register, watch, setValue } = useFormContext();
  const selectedSocietyId = watch('profile.societyId') as string | undefined;
  const isMounted = useRef(false);

  const { data: societyOptions } = api.society.findAll.useQuery();
  const { data: citySocietyOptions } = api.citySociety.findAll.useQuery(
    { societyId: selectedSocietyId || undefined },
    { enabled: true },
  );

  useEffect(() => {
    if (!societyOptions?.length) return;

    const current = watch('profile.societyId') as string | undefined;
    if (current) return;

    const pgz = societyOptions.find((s) => s.name === PGZ_SOCIETY_NAME);
    if (pgz) {
      setValue('profile.societyId', pgz.id, { shouldDirty: false });
    }
  }, [societyOptions, setValue, watch]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    setValue('profile.citySocietyId', '');
  }, [setValue]);

  return (
    <>
      <div className="flex gap-10">
        <FormInput
          id="firstName"
          label="Ime*"
          {...register('profile.firstName', {
            required: 'Ime je obavezno polje',
          })}
        />
        <FormInput
          id="lastName"
          label="Prezime*"
          {...register('profile.lastName', {
            required: 'Prezime je obavezno polje',
          })}
        />
      </div>

      <div className="flex gap-10">
        <FormInput
          id="oib"
          label="OIB*"
          type="number"
          {...register('profile.oib', {
            required: 'OIB je obavezno polje',
            minLength: {
              value: 11,
              message: 'Oib mora imati 11 znamenki',
            },
            maxLength: {
              value: 11,
              message: 'Oib mora imati 11 znamenki',
            },
          })}
        />
        <FormSelect
          id="sex"
          label="Spol*"
          placeholder="Odaberite spol"
          {...register('profile.sex', {
            required: 'Spol je obavezno polje',
          })}
        >
          {Object.entries(Sex).map(([key, value]) => (
            <option key={key} value={value}>
              {translateSex(value)}
            </option>
          ))}
        </FormSelect>
      </div>

      <div className="flex gap-10">
        <FormInput
          id="parentName"
          label="Ime roditelja"
          {...register('profile.parentName')}
        />

        <FormInput
          id="nationality"
          label="Nacionalnost"
          {...register('profile.nationality')}
        />
      </div>

      <div className="flex gap-10">
        <FormInput
          id="birthDate"
          type="date"
          label="Datum rođenja"
          {...register('profile.birthDate')}
        />

        <FormInput
          id="birthPlace"
          label="Mjesto rođenja"
          {...register('profile.birthPlace')}
        />
      </div>

      <div className="flex gap-10">
        <FormInput
          id="email"
          label="Email*"
          {...register('profile.email', {
            required: 'Email je obavezno polje',
          })}
        />
        <FormInput
          id="phone"
          label="Broj telefona"
          {...register('profile.phone')}
        />
      </div>

      <div className="flex gap-10">
        <FormSelect
          id="societyId"
          label="Društvo"
          placeholder="Odaberite društvo"
          {...register('profile.societyId')}
        >
          <option value="">-- Bez izbora --</option>
          {societyOptions?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </FormSelect>

        <FormSelect
          id="citySocietyId"
          label="Gradsko društvo"
          placeholder="Odaberite gradsko društvo"
          {...register('profile.citySocietyId')}
        >
          <option value="">-- Bez izbora --</option>
          {citySocietyOptions?.map((cs) => (
            <option key={cs.id} value={cs.id}>
              {cs.name}
            </option>
          ))}
        </FormSelect>
      </div>
    </>
  );
};

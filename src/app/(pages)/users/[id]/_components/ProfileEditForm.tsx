'use client';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  translateEducationLevel,
  translateSex,
  translateUserType,
  translateWorkStatus,
} from '@/app/(pages)/users/create/utils';
import FormComponent from '@/components/organisms/form/formComponent/FormComponent';
import FormInput from '@/components/organisms/form/formInput/FormInput';
import FormSelect from '@/components/organisms/form/formSelect/FormSelect';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  EducationLevel,
  Sex,
  UserRole,
  UserType,
  WorkStatus,
} from '@/server/db/schema';
import { api } from '@/trpc/react';

type FormData = {
  profile: {
    firstName: string;
    lastName: string;
    oib: string;
    sex: string;
    type: string;
    birthDate: string;
    birthPlace: string;
    parentName: string;
    nationality: string;
    phone: string;
    societyId: string;
    citySocietyId: string;
  };
  workStatus: {
    status: string;
    educationLevel: string;
    profession: string;
    institution: string;
  };
};

type Props = {
  userId: string;
  defaultValues: FormData;
  email: string;
  active: boolean | null;
  role: UserRole;
  isAdmin: boolean;
};

const PGZ_SOCIETY_NAME = 'Društvo Crvenog Križa Primorsko-goranske županije';

const ProfileEditForm = ({
  userId,
  defaultValues,
  email,
  active,
  role,
  isAdmin,
}: Props) => {
  const form = useForm<FormData>({ defaultValues });
  const [selectedRole, setSelectedRole] = useState<UserRole>(role);
  const { isSubmitting } = form.formState;
  const selectedSocietyId = useWatch({
    control: form.control,
    name: 'profile.societyId',
  });
  const prevSocietyId = useRef(selectedSocietyId);

  const { data: societyOptions } = api.society.findAll.useQuery();
  const { data: citySocietyOptions } = api.citySociety.findAll.useQuery(
    { societyId: selectedSocietyId || undefined },
    { enabled: true },
  );

  useEffect(() => {
    if (!societyOptions?.length) return;

    const current = form.getValues('profile.societyId');
    if (current) {
      form.setValue('profile.societyId', current, { shouldDirty: false });
      return;
    }

    const pgz = societyOptions.find((s) => s.name === PGZ_SOCIETY_NAME);
    if (pgz) {
      form.setValue('profile.societyId', pgz.id, { shouldDirty: false });
    }
  }, [societyOptions, form]);

  useEffect(() => {
    if (prevSocietyId.current === selectedSocietyId) return;
    prevSocietyId.current = selectedSocietyId;
    form.setValue('profile.citySocietyId', '', { shouldDirty: false });
  }, [selectedSocietyId, form]);

  useEffect(() => {
    if (!citySocietyOptions?.length) return;

    const current = form.getValues('profile.citySocietyId');
    if (current) {
      form.setValue('profile.citySocietyId', current, { shouldDirty: false });
    }
  }, [citySocietyOptions, form]);

  const utils = api.useUtils();
  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: async () => {
      await utils.user.getProfile.invalidate({ userId });
      toast('Podaci uspješno spremljeni', { type: 'success' });
    },
    onError: (error) => {
      toast(error.message, { type: 'error' });
    },
  });

  const updateRole = api.user.updateRole.useMutation({
    onError: (error) => {
      toast(error.message, { type: 'error' });
    },
  });

  const handleSubmit = async () => {
    const data = form.getValues();

    const promises: Promise<unknown>[] = [
      updateProfile.mutateAsync({
        userId,
        profile: {
          firstName: data.profile.firstName,
          lastName: data.profile.lastName,
          oib: data.profile.oib,
          sex: data.profile.sex as Sex,
          type: data.profile.type as UserType,
          birthDate: data.profile.birthDate || null,
          birthPlace: data.profile.birthPlace || null,
          parentName: data.profile.parentName || null,
          nationality: data.profile.nationality || null,
          phone: data.profile.phone || null,
          societyId: data.profile.societyId || null,
          citySocietyId: data.profile.citySocietyId || null,
        },
        workStatus: {
          status: data.workStatus.status as WorkStatus,
          educationLevel:
            (data.workStatus.educationLevel as EducationLevel) || null,
          profession: data.workStatus.profession || null,
          institution: data.workStatus.institution || null,
        },
      }),
    ];

    if (isAdmin && selectedRole !== role) {
      promises.push(updateRole.mutateAsync({ userId, role: selectedRole }));
    }

    await Promise.all(promises);
  };

  return (
    <Card>
      <CardContent>
        <FormComponent form={form} onSubmit={handleSubmit}>
          <div className="flex gap-10">
            <FormInput id="email" label="Email" value={email} disabled />
            <FormInput
              id="active"
              label="Status"
              value={active ? 'Aktivan' : 'Neaktivan'}
              disabled
            />
          </div>

          {isAdmin && (
            <div className="flex gap-10">
              <FormSelect
                id="role"
                label="Rola"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              >
                <option value={UserRole.USER}>Korisnik</option>
                <option value={UserRole.ADMIN}>Administrator</option>
              </FormSelect>
            </div>
          )}

          <div className="flex gap-10">
            <FormInput
              id="firstName"
              label="Ime*"
              {...form.register('profile.firstName', {
                required: 'Ime je obavezno polje',
              })}
            />
            <FormInput
              id="lastName"
              label="Prezime*"
              {...form.register('profile.lastName', {
                required: 'Prezime je obavezno polje',
              })}
            />
          </div>

          <div className="flex gap-10">
            <FormInput
              id="oib"
              label="OIB*"
              type="number"
              {...form.register('profile.oib', {
                required: 'OIB je obavezno polje',
                minLength: { value: 11, message: 'OIB mora imati 11 znamenki' },
                maxLength: { value: 11, message: 'OIB mora imati 11 znamenki' },
              })}
            />
          </div>

          <div className="flex gap-10">
            <FormSelect
              id="type"
              label="Vrsta*"
              placeholder="Odaberite vrstu"
              {...form.register('profile.type', {
                required: 'Vrsta je obavezno polje',
              })}
            >
              {Object.entries(UserType)
                .sort(([, a], [, b]) => {
                  if (a === UserType.VOLUNTEER) return -1;
                  if (b === UserType.VOLUNTEER) return 1;
                  return 0;
                })
                .map(([key, value]) => (
                  <option key={key} value={value}>
                    {translateUserType(value)}
                  </option>
                ))}
            </FormSelect>
            <FormSelect
              id="sex"
              label="Spol*"
              placeholder="Odaberite spol"
              {...form.register('profile.sex', {
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
              {...form.register('profile.parentName')}
            />
            <FormInput
              id="nationality"
              label="Nacionalnost"
              {...form.register('profile.nationality')}
            />
          </div>

          <div className="flex gap-10">
            <FormInput
              id="birthDate"
              type="date"
              label="Datum rođenja"
              {...form.register('profile.birthDate')}
            />
            <FormInput
              id="birthPlace"
              label="Mjesto rođenja"
              {...form.register('profile.birthPlace')}
            />
          </div>

          <div className="flex gap-10">
            <FormInput
              id="phone"
              label="Broj telefona"
              {...form.register('profile.phone')}
            />
          </div>

          <div className="flex gap-10">
            <FormSelect
              id="societyId"
              label="Županijsko društvo"
              placeholder="Odaberite županijsko društvo"
              {...form.register('profile.societyId')}
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
              {...form.register('profile.citySocietyId')}
            >
              <option value="">-- Bez izbora --</option>
              {citySocietyOptions?.map((cs) => (
                <option key={cs.id} value={cs.id}>
                  {cs.name}
                </option>
              ))}
            </FormSelect>
          </div>

          <hr className="my-4 border-gray-200" />
          <h3 className="mb-4 font-medium text-lg">Radni status</h3>

          <FormSelect
            id="status"
            label="Status*"
            {...form.register('workStatus.status')}
          >
            {Object.entries(WorkStatus).map(([key, value]) => (
              <option key={key} value={value}>
                {translateWorkStatus(value)}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            id="educationLevel"
            label="Stupanj obrazovanja"
            {...form.register('workStatus.educationLevel')}
          >
            <option value="">-- Bez izbora --</option>
            {Object.entries(EducationLevel).map(([key, value]) => (
              <option key={key} value={value}>
                {translateEducationLevel(value)}
              </option>
            ))}
          </FormSelect>

          <FormInput
            id="profession"
            label="Zanimanje"
            {...form.register('workStatus.profession')}
          />

          <FormInput
            id="institution"
            label="Zvanje"
            {...form.register('workStatus.institution')}
          />

          <Button
            className="!text-base bg-black text-white"
            type="submit"
            showLoading={isSubmitting}
          >
            Spremi promjene
          </Button>
        </FormComponent>
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;

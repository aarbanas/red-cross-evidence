'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormComponent from '@/components/organisms/form/formComponent/FormComponent';
import FormInput from '@/components/organisms/form/formInput/FormInput';
import FormSelect from '@/components/organisms/form/formSelect/FormSelect';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LanguageLevel } from '@/server/db/schema';
import { api } from '@/trpc/react';

type SkillsFormData = {
  selectedLanguages: { id: string; level: string }[];
  selectedLicences: { id: string; name: string; type: string }[];
  otherSkills: { name: string; description: string }[];
};

type Props = {
  userId: string;
  defaultValues: SkillsFormData;
  languages: { id: string; name: string }[];
  licences: {
    id: string;
    type: string;
    name: string;
    description: string | null;
  }[];
};

const SkillsEditForm = ({
  userId,
  defaultValues,
  languages,
  licences,
}: Props) => {
  const router = useRouter();
  const form = useForm<SkillsFormData>({ defaultValues });
  const { isSubmitting } = form.formState;
  const { control, register } = form;

  const {
    fields: langFields,
    append: appendLang,
    remove: removeLang,
  } = useFieldArray({ control, name: 'selectedLanguages' });
  const {
    fields: licenceFields,
    append: appendLicence,
    remove: removeLicence,
  } = useFieldArray({ control, name: 'selectedLicences' });
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({ control, name: 'otherSkills' });

  const [selectedLicenceId, setSelectedLicenceId] = useState('');

  const utils = api.useUtils();
  const updateSkills = api.user.updateSkills.useMutation({
    onSuccess: async () => {
      await utils.user.getSkills.invalidate({ userId });
      toast('Znanja i vještine uspješno spremljene', { type: 'success' });
    },
    onError: (error) => toast(error.message, { type: 'error' }),
  });

  const handleAddLicence = () => {
    if (!selectedLicenceId) return;

    if (
      licenceFields.some(
        (f) => (f as unknown as { id: string }).id === selectedLicenceId,
      )
    )
      return;

    const licence = licences.find((l) => l.id === selectedLicenceId);
    if (licence) {
      appendLicence({ id: licence.id, name: licence.name, type: licence.type });
      setSelectedLicenceId('');
    }
  };

  const handleSubmit = async () => {
    const data = form.getValues();

    await updateSkills.mutateAsync({
      userId,
      skills: {
        selectedLanguages: data.selectedLanguages.map((l) => ({
          id: l.id,
          level: l.level as LanguageLevel,
        })),
        selectedLicences: data.selectedLicences.map((l) => ({ id: l.id })),
        otherSkills: data.otherSkills,
      },
    });
  };

  return (
    <Card>
      <CardContent>
        <FormComponent form={form} onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg">Strani jezici</h3>
            <Button
              type="button"
              variant="outline"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
              onClick={() => appendLang({ id: '', level: LanguageLevel.A1 })}
            >
              + Dodaj strani jezik
            </Button>
          </div>

          {langFields.length === 0 && (
            <div className="py-4 text-center text-gray-500">
              Nema dodanih stranih jezika.
            </div>
          )}

          {langFields.map((field, index) => (
            <div
              key={field.id}
              className="relative space-y-4 rounded-lg border p-6"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Strani jezik {index + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-red-50 text-red-700 hover:bg-red-100"
                  onClick={() => removeLang(index)}
                >
                  Ukloni
                </Button>
              </div>

              <FormSelect
                id={`lang-${index}`}
                label="Jezik"
                placeholder="Odaberite jezik"
                {...register(`selectedLanguages.${index}.id`)}
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </FormSelect>

              <FormSelect
                id={`langLevel-${index}`}
                label="Razina znanja"
                placeholder="Odaberite razinu"
                {...register(`selectedLanguages.${index}.level`)}
              >
                {Object.entries(LanguageLevel).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key}
                  </option>
                ))}
              </FormSelect>
            </div>
          ))}

          <hr className="my-4 border-gray-200" />

          <div>
            <h3 className="font-medium text-lg">Licence</h3>
            <div className="mt-2 flex items-end gap-3">
              <FormSelect
                id="licence-select"
                label=""
                placeholder="Odaberite licencu"
                value={selectedLicenceId}
                onChange={(e) => setSelectedLicenceId(e.target.value)}
              >
                <option value="">Odaberi licencu iz izbornika</option>
                {licences
                  .filter(
                    (l) =>
                      !licenceFields.some(
                        (f) => (f as unknown as { id: string }).id === l.id,
                      ),
                  )
                  .map((licence) => (
                    <option key={licence.id} value={licence.id}>
                      {licence.type} - {licence.name}
                    </option>
                  ))}
              </FormSelect>
              <Button
                type="button"
                variant="outline"
                className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                onClick={handleAddLicence}
              >
                + Dodaj licencu
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {licenceFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="flex items-center rounded bg-gray-200 px-2 py-1"
                >
                  <span>{(field as unknown as { name: string }).name}</span>
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() => removeLicence(idx)}
                    aria-label="Ukloni licencu"
                  >
                    &#10005;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-100"
            onClick={() => router.push('/licenses/create')}
          >
            Ukoliko se licenca ne nalazi na listi, molim vas kreirajte je ovdje
          </Button>

          <hr className="my-4 border-gray-200" />

          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg">Dodatne vještine</h3>
            <Button
              type="button"
              variant="outline"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
              onClick={() => appendSkill({ name: '', description: '' })}
            >
              + Dodaj vještinu
            </Button>
          </div>

          {skillFields.length === 0 && (
            <div className="py-4 text-center text-gray-500">
              Nema dodanih vještina.
            </div>
          )}

          {skillFields.map((field, index) => (
            <div
              key={field.id}
              className="relative space-y-4 rounded-lg border p-6"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Dodatna vještina {index + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-red-50 text-red-700 hover:bg-red-100"
                  onClick={() => removeSkill(index)}
                >
                  Ukloni
                </Button>
              </div>

              <FormInput
                id={`skillName-${index}`}
                label="Naziv"
                placeholder="Unesite naziv"
                {...register(`otherSkills.${index}.name`)}
              />

              <FormInput
                id={`skillDesc-${index}`}
                label="Opis"
                placeholder="Opis"
                {...register(`otherSkills.${index}.description`)}
              />
            </div>
          ))}

          <Button
            className="!text-base bg-black text-white"
            type="submit"
            showLoading={isSubmitting}
          >
            Spremi znanja i vještine
          </Button>
        </FormComponent>
      </CardContent>
    </Card>
  );
};

export default SkillsEditForm;

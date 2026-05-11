'use client'
import { useRouter } from 'next/navigation'
import { type FC, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '~/components/atoms/Button'
import FormInput from '~/components/organisms/form/formInput/FormInput'
import FormSelect from '~/components/organisms/form/formSelect/FormSelect'
import { LanguageLevel } from '~/server/db/schema'

type Props = {
  languages: {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date | null
  }[]
  licences: {
    id: string
    type: string
    name: string
    description: string | null
  }[]
}

export type SkillsFormData = {
  skills: {
    selectedLanguages: {
      id: string
      level: LanguageLevel
    }[]
    selectedLicences: {
      id: string
      type: string
      name: string
    }[]
    otherSkills: {
      name: string
      description: string
    }[]
  }
}

const SkillsForm: FC<Props> = ({ languages, licences }) => {
  const router = useRouter()

  const { control, register } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills.selectedLanguages',
  })
  const {
    fields: licenceFields,
    append: appendLicence,
    remove: removeLicence,
  } = useFieldArray({
    control,
    name: 'skills.selectedLicences',
  })
  const {
    fields: otherSkillsFields,
    append: otherSkillsAppend,
    remove: otherSkillsRemove,
  } = useFieldArray({
    control,
    name: 'skills.otherSkills',
    rules: { minLength: 1 },
  })

  const [selectedLicenceId, setSelectedLicenceId] = useState<string>('')

  const handleAddLicence = () => {
    console.log(selectedLicenceId)
    if (
      selectedLicenceId &&
      !licenceFields.some((l) => l.id === selectedLicenceId)
    ) {
      const licence = licences.find((l) => l.id === selectedLicenceId)
      if (licence) {
        appendLicence({
          id: licence.id,
          name: licence.name,
          type: licence.type,
        })
        setSelectedLicenceId('')
      }
    }
  }

  const addNewLanguage = () => {
    append({ id: 'none', level: LanguageLevel.A1 })
  }

  const addNewOtherSkill = () => {
    otherSkillsAppend({ name: '', description: '' })
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Strani jezik</h3>
        <Button
          type="button"
          onClick={addNewLanguage}
          variant="outline"
          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
        >
          + Dodaj strani jezik
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          Nema dodanih stranih jezika. Kliknite &#34;Dodaj&#34; za dodavanje
          prvog stranog jezika.
        </div>
      )}
      {fields.map((field, index) => {
        return (
          <div
            className="relative space-y-4 rounded-lg border p-6"
            key={field.id}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h4 className="font-medium">Strani jezik {index + 1}</h4>
              </div>
              <Button
                type="button"
                onClick={() => remove(index)}
                variant="outline"
                className="ml-auto bg-red-50 text-red-700 hover:bg-red-100"
              >
                Ukloni
              </Button>
            </div>

            <FormSelect
              id={`language-${index}`}
              label=""
              placeholder="Odaberite jezik"
              {...register(`skills.selectedLanguages.${index}.id`)}
            >
              {languages.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                )
              })}
            </FormSelect>

            <FormSelect
              id={`languageLevel-${index}`}
              label="Razina znanja"
              placeholder="Odaberite razinu znanja"
              {...register(`skills.selectedLanguages.${index}.level`)}
            >
              {Object.entries(LanguageLevel).map(([key, value]) => {
                return (
                  <option key={key} value={value}>
                    {key}
                  </option>
                )
              })}
            </FormSelect>
          </div>
        )
      })}

      <hr className="my-5 border-t border-gray-300" />

      <div>
        <h3 className="text-lg font-medium">Licence</h3>
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
              .filter((l) => !licenceFields.some((field) => field.id === l.id))
              .map((licence) => (
                <option key={licence.id} value={licence.id}>
                  {licence.type} - {licence.name}
                </option>
              ))}
          </FormSelect>
          <Button
            type="button"
            onClick={handleAddLicence}
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            + Dodaj licencu
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {licenceFields.map((licence, idx) => (
            <div
              key={licence.id}
              className="flex items-center rounded bg-gray-200 px-2 py-1"
            >
              <span>
                {(licence as unknown as { id: string; name: string }).name}
              </span>
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
        onClick={() => {
          router.push('/licenses/create')
        }}
      >
        Ukoliko se licenca ne nalazi na listi, molim vas kreirajte je ovdje
      </Button>

      <hr className="my-5 border-t border-gray-300" />

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Dodatne vještine</h3>
        <Button
          type="button"
          onClick={addNewOtherSkill}
          variant="outline"
          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
        >
          + Dodaj vještinu
        </Button>
      </div>

      {otherSkillsFields.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          Želite li dodati specijalne vještine to možete učiniti u idućoj
          sekciji
        </div>
      )}

      {otherSkillsFields.map((field, index) => {
        return (
          <div
            className="relative space-y-4 rounded-lg border p-6"
            key={field.id}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h4 className="font-medium">Dodatna vještina {index + 1}</h4>
              </div>
              <Button
                type="button"
                onClick={() => otherSkillsRemove(index)}
                variant="outline"
                className="bg-red-50 text-red-700 hover:bg-red-100"
              >
                Ukloni
              </Button>
            </div>

            <FormInput
              id={`name-${index}`}
              label="Naziv"
              placeholder="Unesite naziv"
              {...register(`skills.otherSkills.${index}.name`)}
            ></FormInput>

            <FormInput
              id={`description-${index}`}
              label="Opis"
              placeholder="Opis"
              {...register(`skills.otherSkills.${index}.description`)}
            ></FormInput>
          </div>
        )
      })}
    </>
  )
}

export default SkillsForm

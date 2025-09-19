"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { type FC, useState } from "react";
import FormSelect from "~/components/organisms/form/formSelect/FormSelect";
import { LanguageLevel } from "~/server/db/schema";
import { Button } from "~/components/atoms/Button";
import { useRouter } from "next/navigation";

type Props = {
  languages: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date | null;
  }[];
  licences: {
    id: string;
    type: string;
    name: string;
    description: string | null;
  }[];
};

const SkillsForm: FC<Props> = ({ languages, licences }) => {
  const router = useRouter();

  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages",
  });
  const {
    fields: licenceFields,
    append: appendLicence,
    remove: removeLicence,
  } = useFieldArray({
    control,
    name: "selectedLicences",
  });

  const [selectedLicenceId, setSelectedLicenceId] = useState<string>("");

  const handleAddLicence = () => {
    if (
      selectedLicenceId &&
      !licenceFields.some((l) => l.id === selectedLicenceId)
    ) {
      const licence = licences.find((l) => l.id === selectedLicenceId);
      if (licence) {
        appendLicence({
          id: licence.id,
          name: licence.name,
          type: licence.type,
        });
        setSelectedLicenceId("");
      }
    }
  };

  return (
    <>
      {fields.map((field, index) => {
        return (
          <div className="flex items-center gap-5" key={field.id}>
            <FormSelect
              id={`language-${index}`}
              label="Strani Jezik"
              placeholder="Odaberite jezik"
              {...register(`selectedLanguages.${index}.id`)}
            >
              {languages.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </FormSelect>

            <FormSelect
              id={`languageLevel-${index}`}
              label="Razina znanja"
              placeholder="Odaberite razinu znanja"
              {...register(`selectedLanguages.${index}.level`)}
            >
              {Object.entries(LanguageLevel).map(([key, value]) => {
                return (
                  <option key={key} value={value}>
                    {key}
                  </option>
                );
              })}
            </FormSelect>
          </div>
        );
      })}

      <div className="flex gap-5">
        {fields.length < languages.length && (
          <Button
            type="button"
            variant={"default"}
            onClick={() =>
              append(
                { id: "none", level: LanguageLevel.A1 },
                { shouldFocus: true },
              )
            }
          >
            Dodaj
          </Button>
        )}
        {fields.length > 1 && (
          <Button
            type="button"
            variant={"default"}
            onClick={() => remove(fields.length - 1)}
          >
            Ukloni
          </Button>
        )}
      </div>

      <div>
        <div className="mt-2 flex items-end gap-3">
          <FormSelect
            id="licence-select"
            label="Licenca"
            placeholder="Odaberite licencu"
            value={selectedLicenceId}
            onChange={(e) => setSelectedLicenceId(e.target.value)}
          >
            {licences
              .filter((l) => !licenceFields.some((field) => field.id === l.id))
              .map((licence) => (
                <option key={licence.id} value={licence.id}>
                  {licence.type} - {licence.name}
                </option>
              ))}
          </FormSelect>
          <Button type="button" variant="default" onClick={handleAddLicence}>
            Dodaj
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
        variant="default"
        onClick={() => {
          router.push("/licenses/create");
        }}
      >
        Ukoliko licenca nije na listi, molim vas kreirajte je ovdje
      </Button>
    </>
  );
};

export default SkillsForm;

import { z } from "zod";
import { LanguageLevel } from "~/server/db/schema";

export const LanguageSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export const AddLanguagesToProfileSchema = z.object({
  selectedLanguages: z
    .array(
      z.object({
        id: z.string().uuid(),
        level: z.nativeEnum(LanguageLevel),
      }),
    )
    .refine(
      (languages) => {
        const ids = languages.map((language) => language.id);
        return new Set(ids).size === ids.length;
      },
      {
        message: "Duplicate language IDs are not allowed",
      },
    ),
});

export type LanguageType = z.infer<typeof LanguageSchema>;
export type AddLanguagesToProfileType = z.infer<
  typeof AddLanguagesToProfileSchema
>;

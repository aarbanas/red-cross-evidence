import { z } from "zod";
import isOibValid from "~/components/utils/oibValidator";
import { Sex } from "~/server/db/schema";

export const ProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Should be at least two characters long" }),
  lastName: z
    .string()
    .min(2, { message: "Should be at least two characters long" }),
  sex: z.nativeEnum(Sex),
  oib: z.string().refine((oib) => isOibValid(oib), {
    message: "OIB is not valid",
  }),
  parentName: z.string().nullish(),
  birthDate: z.coerce.date().nullish(),
  birthPlace: z.string().nullish(),
  nationality: z.string().nullish(),
});

export const AddOtherSkillsSchema = z.object({
  otherSkills: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    }),
  ),
});

export type ProfileSchemaType = z.infer<typeof ProfileSchema>;
export type AddOtherSkillsType = z.infer<typeof AddOtherSkillsSchema>;

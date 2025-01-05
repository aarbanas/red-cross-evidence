import { z } from "zod";

import {
  EducationLevel,
  LanguageLevel,
  Sex,
  WorkStatus,
} from "~/server/db/schema";

const addressSchema = z.object({
  id: z.string(),
  isPrimary: z.boolean().default(false),
});

const workStatusSchema = z.object({
  status: z.nativeEnum(WorkStatus),
  educationLevel: z.nativeEnum(EducationLevel),
});

const selectedLanguageSchema = z.object({
  id: z.number(),
  level: z.nativeEnum(LanguageLevel),
});

const otherSkillSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const createUserSchema = z.object({
  email: z.string().email({ message: "Should be a valid email address" }),

  profile: z.object({
    firstName: z
      .string()
      .min(2, { message: "Should be at least two characters long" }),
    lastName: z
      .string()
      .min(2, { message: "Should be at least two characters long" }),
    sex: z.nativeEnum(Sex),
    oib: z.string(),
    parentName: z.string().optional(),
    birthDate: z.date().optional(),
    birthPlace: z.string().optional(),
    nationality: z.string().optional(),
  }),

  address: addressSchema,
  workStatus: workStatusSchema,
  languages: z.array(selectedLanguageSchema),
  licenses: z.array(z.string().uuid()),
  otherSkills: z.array(otherSkillSchema),
});

export default createUserSchema;

export type CreateUserType = z.infer<typeof createUserSchema>;

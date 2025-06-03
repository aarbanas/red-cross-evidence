import { z } from "zod";

import { ProfileSchema } from "~/server/services/user/profile/schemas";
import { EducationLevel, LanguageLevel, WorkStatus } from "~/server/db/schema";

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

  profile: ProfileSchema,

  address: addressSchema,
  workStatus: workStatusSchema,
  languages: z.array(selectedLanguageSchema),
  licenses: z.array(z.string().uuid()),
  otherSkills: z.array(otherSkillSchema),
});

export default createUserSchema;

export type CreateUserType = z.infer<typeof createUserSchema>;

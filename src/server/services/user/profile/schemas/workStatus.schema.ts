import { z } from "zod";
import { EducationLevel, WorkStatus } from "~/server/db/schema";

export const WorkStatusSchema = z.object({
  status: z.nativeEnum(WorkStatus),
  educationLevel: z.nativeEnum(EducationLevel),
});

export type WorkStatusType = z.infer<typeof WorkStatusSchema>;

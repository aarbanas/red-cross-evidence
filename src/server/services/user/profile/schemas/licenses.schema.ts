import { z } from "zod";

export const AddLicenseToProfileSchema = z.array(z.string().uuid());

export type AddLicenseToProfileType = z.infer<typeof AddLicenseToProfileSchema>;

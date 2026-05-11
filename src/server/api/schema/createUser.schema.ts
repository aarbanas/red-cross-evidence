import { z } from 'zod';

const createUserSchema = z.object({
  profile: z.object({
    firstName: z.string().min(1, 'Ime je obavezno'),
    lastName: z.string().min(1, 'Prezime je obavezno'),
    oib: z
      .string()
      .min(11, 'Oib mora imati 11 znamenki')
      .max(11, 'Oib mora imati 11 znamenki'),
    sex: z.string(),
    email: z.string().email('Neispravan email'),
    parentName: z.string().optional(),
    nationality: z.string().optional(),
    birthDate: z.string().optional(),
    birthPlace: z.string().optional(),
    phone: z.string().optional(),
  }),
  addresses: z
    .array(
      z.object({
        type: z.string().min(1, 'Tip je obavezan'),
        street: z.string().min(1, 'Ulica je obavezna'),
        streetNumber: z.string().min(1, 'Kućni broj je obavezan'),
        city: z.union([
          z.string().min(1, 'Grad je obavezan'),
          z.object({
            id: z.string(),
            name: z.string(),
            postalCode: z.string().nullable(),
          }),
        ]),
        postalCode: z.string().min(1, 'Poštanski broj je obavezan'),
        country: z.string().min(1, 'Država je obavezna'),
        isPrimary: z.boolean(),
      }),
    )
    .min(1, 'Barem jedna adresa je obavezna')
    .refine((addresses) => addresses.some((addr) => addr.isPrimary), {
      message: 'Jedna adresa mora biti označena kao primarna',
    }),
  workStatus: z.object({
    status: z.string().min(1, 'Status je obavezan'),
    educationLevel: z.string().optional(),
    profession: z.string().optional(),
    institution: z.string().optional(),
  }),
  size: z.object({
    clothingSize: z.string().min(1),
    shoeSize: z.string().min(1),
    height: z
      .number()
      .min(50, 'Visina mora biti veća od 50 cm')
      .max(250, 'Visina ne smije biti veća od 250 cm')
      .nullable()
      .optional(),
    weight: z
      .number()
      .min(1, 'Težina mora biti veća od 0 kg')
      .max(500, 'Težina ne smije biti veća od 500 kg')
      .nullable()
      .optional(),
  }),
  skills: z.object({
    selectedLanguages: z
      .array(z.object({ id: z.string(), level: z.string() }))
      .optional(),
    selectedLicences: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          type: z.string(),
        }),
      )
      .optional(),
    otherSkills: z
      .array(
        z.object({
          name: z.string(),
          description: z.string(),
        }),
      )
      .optional(),
  }),
});

export default createUserSchema;

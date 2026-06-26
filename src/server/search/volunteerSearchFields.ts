import { z } from 'zod';
import { CROATIAN_COUNTIES } from '@/server/constants/counties';

export const volunteerSearchQuerySchema = z.object({
  location: z
    .object({
      city: z.string().nullable().optional(),
      county: z.string().nullable().optional(),
    })
    .optional(),
  licenses: z
    .array(
      z.object({
        type: z.string(),
      }),
    )
    .optional(),
  courses: z
    .array(
      z.object({
        name: z.string(),
        completed: z.boolean(),
      }),
    )
    .optional(),
  coursesOperator: z.enum(['AND', 'OR']).optional(),
  languages: z
    .array(
      z.object({
        name: z.string(),
        level: z
          .enum(['osnovno', 'srednje', 'napredno', 'izvorno'])
          .nullable()
          .optional(),
      }),
    )
    .optional(),
  age: z
    .object({
      min: z.number().nullable().optional(),
      max: z.number().nullable().optional(),
    })
    .optional(),
  active: z.boolean().nullable().optional(),
});

export type VolunteerSearchQuery = z.infer<typeof volunteerSearchQuerySchema>;

export interface FieldDescriptor {
  description: string;
  examples?: string[];
  outputType: string;
  normalization?: Record<string, string[]>;
  validValues?: readonly string[];
}

export const VOLUNTEER_SEARCH_FIELDS: Record<string, FieldDescriptor> = {
  location: {
    description:
      'Prepoznaj grad i/ili županiju volontera. Za county koristi TOČNO jedan od dozvoljenih naziva županija.',
    outputType: '{ "city": string|null, "county": string|null }',
    examples: ['iz Rijeke', 'primorsko-goranska županija'],
    validValues: CROATIAN_COUNTIES,
  },
  licenses: {
    description:
      'Vozačka dozvola. Mapiraj kategorije prema sljedećim pravilima.',
    outputType: 'Array<{ "type": string }>',
    normalization: {
      B: ['auto', 'osobno vozilo', 'osobni automobil'],
      C: ['kamion', 'teretno vozilo'],
      D: ['autobus'],
      A: ['motocikl', 'motor'],
      AM: ['moped'],
    },
  },
  courses: {
    description:
      'Položeni tečajevi ili edukacije. Izvuci TOČAN naziv tečaja ili edukacije kako je naveden u upitu. Completed je true ako je tečaj položen ili završen.',
    outputType: 'Array<{ "name": string, "completed": boolean }>',
    examples: [
      'položio osnovna obuka spašavanja → { "name": "osnovna obuka spašavanja", "completed": true }',
      'završio edukaciju Prva pomoć → { "name": "Prva pomoć", "completed": true }',
    ],
  },
  coursesOperator: {
    description:
      'Logički operator za kombiniranje više tečajeva/edukacija. Koristi "OR" ISKLJUČIVO ako se riječ "ili" pojavljuje KAO SAMOSTALNA RIJEČ (okružena razmacima) između naziva dvaju tečajeva/edukacija — ne unutar drugog konteksta. Koristi "AND" u svim ostalim slučajevima: ako su tečajevi odvojeni s "i", "AND", "and", ako postoji samo jedan tečaj, ili ako nisi siguran.',
    outputType: '"AND" | "OR"',
    examples: [
      '"... položili edukaciju A ili edukaciju B" → "OR"  (samostalna riječ "ili" između dva naziva)',
      '"... položili edukaciju A i edukaciju B" → "AND"  (veznik "i")',
      '"... položili edukaciju A" → "AND"  (samo jedan tečaj)',
      '"... položili edukaciju Osnovna edukacija o odnosima s javnostima HCK i Edukacija volontera..." → "AND"  ("i" je veznik, "položili" je glagol — ne sadrži "ili" kao veznik)',
    ],
  },
  languages: {
    description: 'Poznavanje stranih jezika i razina znanja.',
    outputType:
      'Array<{ "name": string, "level": "osnovno"|"srednje"|"napredno"|"izvorno"|null }>',
    examples: ['osnovno znanje engleskog', 'tečno govori njemački'],
  },
  age: {
    description: 'Dobni raspon volontera.',
    outputType: '{ "min": number|null, "max": number|null }',
    examples: ['stariji od 25', 'između 20 i 40 godina'],
  },
  active: {
    description:
      'Samo aktivni/neaktivni volonteri. Ako nije navedeno, postavi null.',
    outputType: 'boolean|null',
    examples: ['samo aktivni volonteri'],
  },
};

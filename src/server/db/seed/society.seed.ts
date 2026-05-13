import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { cities, citySocieties, countries, societies } from '../schema';

type SocietyEntry = {
  name: string;
  address: string;
  director: string;
  phone: string;
  email: string;
  website: string;
  city: string;
};

type CitySocietyEntry = SocietyEntry & {
  societyName: string;
};

type SocietiesJson = {
  societies: SocietyEntry[];
  citySocieties: CitySocietyEntry[];
};

const CROATIA_NAME = 'Hrvatska';

async function getOrCreateCountry(): Promise<string> {
  const existing = await db
    .select({ id: countries.id })
    .from(countries)
    .where(eq(countries.name, CROATIA_NAME))
    .limit(1);

  if (existing[0]) return existing[0].id;

  const [created] = await db
    .insert(countries)
    .values({ name: CROATIA_NAME })
    .returning({ id: countries.id });

  return created!.id;
}

async function getOrCreateCity(
  name: string,
  countryId: string,
): Promise<string> {
  const existing = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.name, name))
    .limit(1);

  if (existing[0]) return existing[0].id;

  const [created] = await db
    .insert(cities)
    .values({ name, countryId })
    .returning({ id: cities.id });

  return created!.id;
}

export const getSocieties = async () => {
  const jsonPath = path.resolve(
    process.cwd(),
    'scripts/societies_parser/societies.json',
  );
  const raw = readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(raw) as SocietiesJson;

  const countryId = await getOrCreateCountry();

  // Insert societies if not already seeded
  const existingSocieties = await db.query.societies.findMany();
  const societyNameToId = new Map<string, string>();

  if (!existingSocieties.length) {
    for (const entry of data.societies) {
      const cityId = entry.city
        ? await getOrCreateCity(entry.city, countryId)
        : null;

      const [inserted] = await db
        .insert(societies)
        .values({
          name: entry.name,
          address: entry.address,
          director: entry.director,
          phone: entry.phone || null,
          email: entry.email || null,
          website: entry.website || null,
          cityId,
        })
        .returning({ id: societies.id });

      societyNameToId.set(entry.name, inserted!.id);
    }
  } else {
    for (const s of existingSocieties) {
      societyNameToId.set(s.name, s.id);
    }
  }

  // Insert city societies if not already seeded
  const existingCitySocieties = await db.query.citySocieties.findMany();

  if (!existingCitySocieties.length) {
    for (const entry of data.citySocieties) {
      const cityId = entry.city
        ? await getOrCreateCity(entry.city, countryId)
        : null;

      const societyId = societyNameToId.get(entry.societyName) ?? null;

      await db.insert(citySocieties).values({
        name: entry.name,
        address: entry.address,
        director: entry.director,
        phone: entry.phone || null,
        email: entry.email || null,
        website: entry.website || null,
        cityId,
        societyId,
      });
    }
  }

  return db.query.societies.findMany();
};

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  getSocieties()
    .then((result) => {
      console.log(`Done seeding ${result.length} societies.`);
      process.exit(0);
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
}

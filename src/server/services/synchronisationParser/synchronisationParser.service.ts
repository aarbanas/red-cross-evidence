import 'server-only';
import { eq, ilike } from 'drizzle-orm';
import { db } from '@/server/db';
import {
  cities,
  citySocieties,
  educations,
  societies,
} from '@/server/db/schema';
import { scrapeEducations } from '@/server/scrapers/education.scraper';
import { scrapeSocieties } from '@/server/scrapers/society.scraper';

const synchronisationParserService = {
  syncEducations: async (): Promise<{ count: number }> => {
    const scraped = await scrapeEducations();

    const existing = await db
      .select({ id: educations.id, title: educations.title })
      .from(educations);

    const existingMap = new Map(existing.map((e) => [e.title, e.id]));

    const toInsert = scraped.filter((e) => !existingMap.has(e.title));
    const toUpdate = scraped.filter((e) => existingMap.has(e.title));

    await db.transaction(async (tx) => {
      if (toInsert.length) {
        await tx.insert(educations).values(toInsert);
      }

      for (const item of toUpdate) {
        const id = existingMap.get(item.title)!;
        await tx.update(educations).set(item).where(eq(educations.id, id));
      }
    });

    return { count: scraped.length };
  },

  syncSocieties: async (): Promise<{
    societiesCount: number;
    citySocietiesCount: number;
  }> => {
    const { societies: scrapedSocieties, citySocieties: scrapedCitySocieties } =
      await scrapeSocieties();

    await db.transaction(async (tx) => {
      // --- societies ---
      const existingSocieties = await tx
        .select({ id: societies.id, name: societies.name })
        .from(societies);

      const societyMap = new Map(existingSocieties.map((s) => [s.name, s.id]));

      const societiesToInsert = scrapedSocieties.filter(
        (s) => !societyMap.has(s.name),
      );
      const societiesToUpdate = scrapedSocieties.filter((s) =>
        societyMap.has(s.name),
      );

      if (societiesToInsert.length) {
        const inserted = await tx
          .insert(societies)
          .values(
            societiesToInsert.map(({ city: _, ...s }) => ({
              ...s,
              updatedAt: new Date(),
            })),
          )
          .returning({ id: societies.id, name: societies.name });

        for (const row of inserted) {
          societyMap.set(row.name, row.id);
        }
      }

      for (const item of societiesToUpdate) {
        const id = societyMap.get(item.name)!;
        const { city: _, ...values } = item;
        await tx
          .update(societies)
          .set({ ...values, updatedAt: new Date() })
          .where(eq(societies.id, id));
      }

      // --- city societies ---
      const existingCitySocieties = await tx
        .select({
          id: citySocieties.id,
          name: citySocieties.name,
          societyId: citySocieties.societyId,
        })
        .from(citySocieties);

      // key: "name::societyId"
      const citySocietyMap = new Map(
        existingCitySocieties.map((cs) => [
          `${cs.name}::${cs.societyId ?? ''}`,
          cs.id,
        ]),
      );

      for (const item of scrapedCitySocieties) {
        const societyId = societyMap.get(item.societyName) ?? null;

        let cityId: string | null = null;

        if (item.city) {
          const [cityRow] = await tx
            .select({ id: cities.id })
            .from(cities)
            .where(ilike(cities.name, item.city))
            .limit(1);
          cityId = cityRow?.id ?? null;
        }

        const key = `${item.name}::${societyId ?? ''}`;
        const existingId = citySocietyMap.get(key);
        const { societyName: _, city: __, ...values } = item;

        if (existingId) {
          await tx
            .update(citySocieties)
            .set({ ...values, societyId, cityId, updatedAt: new Date() })
            .where(eq(citySocieties.id, existingId));
        } else {
          await tx
            .insert(citySocieties)
            .values({ ...values, societyId, cityId });
        }
      }
    });

    return {
      societiesCount: scrapedSocieties.length,
      citySocietiesCount: scrapedCitySocieties.length,
    };
  },
};

export default synchronisationParserService;

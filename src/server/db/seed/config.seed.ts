import { db } from '@/server/db';
import { appConfig } from '@/server/db/schema';

const HCK_CONFIG_ENTRIES: {
  key: string;
  value: string;
  metadata: string | null;
}[] = [
  {
    key: 'society_overview_url',
    value: 'https://www.hck.hr/adresar/50',
    metadata: null,
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/bjelovarsko-bilogorska/51',
    metadata: 'bjelovarsko-bilogorska',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/brodsko-posavska/52',
    metadata: 'brodsko-posavska',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/dubrovacko-neretvanska/53',
    metadata: 'dubrovacko-neretvanska',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/grad-zagreb/54',
    metadata: 'grad-zagreb',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/istarska/55',
    metadata: 'istarska',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/karlovacka/56',
    metadata: 'karlovacka',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/koprivnicko-krizevacka/57',
    metadata: 'koprivnicko-krizevacka',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/krapinsko-zagorska/58',
    metadata: 'krapinsko-zagorska',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/licko-senjska/59',
    metadata: 'licko-senjska',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/medjimurska/60',
    metadata: 'medjimurska',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/osjecko-baranjska/61',
    metadata: 'osjecko-baranjska',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/pozesko-slavonska/62',
    metadata: 'pozesko-slavonska',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/primorsko-goranska/63',
    metadata: 'primorsko-goranska',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/sisacko-moslavacka/64',
    metadata: 'sisacko-moslavacka',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/splitsko-dalmatinska/65',
    metadata: 'splitsko-dalmatinska',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/sibensko-kninska/66',
    metadata: 'sibensko-kninska',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/varazdinska/67',
    metadata: 'varazdinska',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/viroviticko-podravska/68',
    metadata: 'viroviticko-podravska',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/vukovarsko-srijemska/69',
    metadata: 'vukovarsko-srijemska',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/zadarska/70',
    metadata: 'zadarska',
  },
  {
    key: 'society_scrape_url',
    value: 'https://www.hck.hr/adresar/zagrebacka/71',
    metadata: 'zagrebacka',
  },
  {
    key: 'education_overview_url',
    value:
      'https://www.hck.hr/edukacije-publikacije/edukacije-hrvatskog-crvenog-kriza/74',
    metadata: null,
  },
  {
    key: 'education_category_url',
    value:
      'https://www.hck.hr/edukacije-publikacije/edukacije-hrvatskog-crvenog-kriza/za-volontere/271',
    metadata: 'Volunteers',
  },
  {
    key: 'education_category_url',
    value:
      'https://www.hck.hr/edukacije-publikacije/edukacije-hrvatskog-crvenog-kriza/za-javnost/272',
    metadata: 'Public',
  },
  {
    key: 'education_category_url',
    value:
      'https://www.hck.hr/edukacije-publikacije/edukacije-hrvatskog-crvenog-kriza/za-djelatnike/270',
    metadata: 'Employee',
  },
];

export const seedConfig = async () => {
  for (const entry of HCK_CONFIG_ENTRIES) {
    await db.insert(appConfig).values(entry).onConflictDoNothing();
  }
};

void (async () => {
  await seedConfig();
  console.log('Done seeding config.');
  process.exit(0);
})();

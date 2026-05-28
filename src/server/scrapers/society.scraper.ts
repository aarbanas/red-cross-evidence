import 'server-only';
import * as cheerio from 'cheerio';
import type { AnyNode, Element } from 'domhandler';
import { Agent, fetch as undiciFetch } from 'undici';

const tlsAgent = new Agent({ connect: { rejectUnauthorized: false } });

export type ScrapedSociety = {
  name: string;
  address: string;
  director: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  city: string | null;
};

export type ScrapedCitySociety = ScrapedSociety & {
  societyName: string;
};

const URLS: [string, string][] = [
  [
    'bjelovarsko-bilogorska',
    'https://www.hck.hr/adresar/bjelovarsko-bilogorska/51',
  ],
  ['brodsko-posavska', 'https://www.hck.hr/adresar/brodsko-posavska/52'],
  [
    'dubrovacko-neretvanska',
    'https://www.hck.hr/adresar/dubrovacko-neretvanska/53',
  ],
  ['grad-zagreb', 'https://www.hck.hr/adresar/grad-zagreb/54'],
  ['istarska', 'https://www.hck.hr/adresar/istarska/55'],
  ['karlovacka', 'https://www.hck.hr/adresar/karlovacka/56'],
  [
    'koprivnicko-krizevacka',
    'https://www.hck.hr/adresar/koprivnicko-krizevacka/57',
  ],
  ['krapinsko-zagorska', 'https://www.hck.hr/adresar/krapinsko-zagorska/58'],
  ['licko-senjska', 'https://www.hck.hr/adresar/licko-senjska/59'],
  ['medjimurska', 'https://www.hck.hr/adresar/medjimurska/60'],
  ['osjecko-baranjska', 'https://www.hck.hr/adresar/osjecko-baranjska/61'],
  ['pozesko-slavonska', 'https://www.hck.hr/adresar/pozesko-slavonska/62'],
  ['primorsko-goranska', 'https://www.hck.hr/adresar/primorsko-goranska/63'],
  ['sisacko-moslavacka', 'https://www.hck.hr/adresar/sisacko-moslavacka/64'],
  [
    'splitsko-dalmatinska',
    'https://www.hck.hr/adresar/splitsko-dalmatinska/65',
  ],
  ['sibensko-kninska', 'https://www.hck.hr/adresar/sibensko-kninska/66'],
  ['varazdinska', 'https://www.hck.hr/adresar/varazdinska/67'],
  [
    'viroviticko-podravska',
    'https://www.hck.hr/adresar/viroviticko-podravska/68',
  ],
  [
    'vukovarsko-srijemska',
    'https://www.hck.hr/adresar/vukovarsko-srijemska/69',
  ],
  ['zadarska', 'https://www.hck.hr/adresar/zadarska/70'],
  ['zagrebacka', 'https://www.hck.hr/adresar/zagrebacka/71'],
];

const isElement = (node: AnyNode): node is Element => node.type === 'tag';

const cleanText = (text: string): string => {
  return text.replace(/​/g, '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
};

const parseOpis = (
  $: cheerio.CheerioAPI,
  opisEl: Element,
): Omit<ScrapedSociety, 'name'> => {
  const result: Omit<ScrapedSociety, 'name'> = {
    address: '',
    director: '',
    phone: null,
    email: null,
    website: null,
    city: null,
  };

  $(opisEl)
    .find('strong')
    .each((_, strongEl) => {
      const labelRaw = cleanText($(strongEl).text())
        .toLowerCase()
        .replace(':', '')
        .trim();

      const valueParts: string[] = [];
      let node = strongEl.nextSibling;

      while (node) {
        if (isElement(node)) {
          if (node.tagName === 'strong') break;
          if (node.tagName === 'a') {
            valueParts.push(cleanText($(node).text()));
          } else if (node.tagName === 'br') {
            break;
          }
        } else if (node.type === 'text') {
          const t = cleanText(node.data ?? '');
          if (t) valueParts.push(t);
        }

        node = node.nextSibling;
      }

      const value = cleanText(valueParts.join(' '));

      if (labelRaw.includes('adresa')) {
        result.address = value;
      } else if (
        labelRaw.includes('ravnatelj') ||
        labelRaw.includes('predsjednik')
      ) {
        result.director = value;
      } else if (labelRaw.includes('telefon')) {
        result.phone = value || null;
      } else if (labelRaw.includes('e-mail') || labelRaw.includes('email')) {
        const aTag = $(strongEl).nextAll('a').first();
        const href = aTag.attr('href') ?? '';
        result.email = href.startsWith('mailto:')
          ? cleanText(href.replace('mailto:', ''))
          : cleanText(aTag.text()) || value || null;
      } else if (labelRaw.includes('web')) {
        const aTag = $(strongEl).nextAll('a').first();
        result.website = aTag.length
          ? cleanText(aTag.text()) || null
          : value || null;
      } else if (labelRaw.includes('grad')) {
        const cityVal = value.replace(/^\d[\d\s]+/, '').trim();
        result.city = cityVal || null;
      }
    });

  return result;
};

const parseEntries = (
  $: cheerio.CheerioAPI,
  nodes: AnyNode[],
  societyName: string,
): ScrapedCitySociety[] => {
  const entries: ScrapedCitySociety[] = [];
  let pendingName: string | null = null;

  for (const node of nodes) {
    if (!isElement(node)) continue;

    if (node.tagName === 'h2' || node.tagName === 'h3') {
      const text = cleanText($(node).text());
      if (text.toLowerCase().includes('gradska društva')) continue;
      pendingName = text;
    } else if (
      node.tagName === 'div' &&
      ($(node).attr('class') ?? '').includes('adresar-opis')
    ) {
      if (pendingName) {
        const opis = parseOpis($, node);
        entries.push({ name: pendingName, societyName, ...opis });
        pendingName = null;
      }
    }
  }

  return entries;
};

const parsePage = async (
  slug: string,
  url: string,
): Promise<{
  society: ScrapedSociety | null;
  citySocieties: ScrapedCitySociety[];
}> => {
  const res = await undiciFetch(url, {
    headers: { 'Accept-Charset': 'utf-8' },
    dispatcher: tlsAgent,
  });
  const $ = cheerio.load(await res.text());

  const holder = $('div.adresar-holder').first();

  if (!holder.length) {
    console.warn(`No adresar-holder found for ${slug}`);
    return { society: null, citySocieties: [] };
  }

  let society: (ScrapedSociety & { hasOpis?: boolean }) | null = null;
  let citySocieties: ScrapedCitySociety[] = [];

  for (const child of holder.children().toArray()) {
    if (!isElement(child)) continue;

    if (child.tagName === 'h2' || child.tagName === 'h3') {
      const firstLine = cleanText($(child).text().split('\n')[0] ?? '');

      if (firstLine.toLowerCase().includes('gradska društva')) {
        const societyName = society?.name ?? '';
        citySocieties = parseEntries(
          $,
          Array.from(child.children),
          societyName,
        );
        continue;
      }

      if (!society) {
        society = {
          name: firstLine,
          address: '',
          director: '',
          phone: null,
          email: null,
          website: null,
          city: null,
        };
      }
    } else if (
      child.tagName === 'div' &&
      ($(child).attr('class') ?? '').includes('adresar-opis')
    ) {
      if (society && !society.hasOpis) {
        const opis = parseOpis($, child);
        Object.assign(society, opis, { hasOpis: true });
      }
    }
  }

  if (society) {
    const { hasOpis: _, ...cleanSociety } = society as ScrapedSociety & {
      hasOpis?: boolean;
    };
    return { society: cleanSociety, citySocieties };
  }

  return { society: null, citySocieties };
};

export const scrapeSocieties = async (
  onProgress?: (current: number, total: number) => void,
): Promise<{
  societies: ScrapedSociety[];
  citySocieties: ScrapedCitySociety[];
}> => {
  const societies: ScrapedSociety[] = [];
  const citySocieties: ScrapedCitySociety[] = [];
  const total = URLS.length;

  for (let i = 0; i < URLS.length; i++) {
    const entry = URLS[i];
    if (!entry) continue;
    const [slug, url] = entry;
    const { society, citySocieties: cities } = await parsePage(slug, url);

    if (slug === 'grad-zagreb' && society) {
      societies.push(society);
      citySocieties.push({ ...society, societyName: society.name });
    } else {
      if (society) societies.push(society);
      citySocieties.push(...cities);
    }

    onProgress?.(i + 1, total);
  }

  return { societies, citySocieties };
};

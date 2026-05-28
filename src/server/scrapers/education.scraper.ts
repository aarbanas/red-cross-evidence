import 'server-only';
import * as cheerio from 'cheerio';
import type { AnyNode, Element } from 'domhandler';
import { EducationType } from '@/server/db/schema';

export type ScrapedEducation = {
  title: string;
  description: string;
  precondition: string | null;
  duration: string | null;
  lecturers: string | null;
  courseDuration: string | null;
  renewalDuration: string | null;
  topics: string | null;
  type: EducationType;
};

const CATEGORY_URLS: [string, EducationType][] = [
  [
    'https://www.hck.hr/edukacije-publikacije/edukacije-hrvatskog-crvenog-kriza/za-volontere/271',
    EducationType.VOLUNTEERS,
  ],
  [
    'https://www.hck.hr/edukacije-publikacije/edukacije-hrvatskog-crvenog-kriza/za-javnost/272',
    EducationType.PUBLIC,
  ],
  [
    'https://www.hck.hr/edukacije-publikacije/edukacije-hrvatskog-crvenog-kriza/za-djelatnike/270',
    EducationType.EMPLOYEE,
  ],
];

// Croatian label → schema field mapping (derived from existing seed/headerMapping)
const LABEL_MAP: Record<
  string,
  keyof Omit<ScrapedEducation, 'title' | 'description' | 'type'>
> = {
  preduvjet: 'precondition',
  trajanje: 'duration',
  predavači: 'lecturers',
  'trajanje tečaja': 'courseDuration',
  'trajanje obnove': 'renewalDuration',
  teme: 'topics',
};

const isElement = (node: AnyNode): node is Element => node.type === 'tag';

const scrapeEducationDetail = async (
  url: string,
): Promise<Omit<ScrapedEducation, 'type'> | null> => {
  const res = await fetch(url);
  const $ = cheerio.load(await res.text());

  const title = $('h1').first().text().trim();

  if (!title) return null;

  const pageText = $('div.page-text').first();

  let description = '';
  let insideDescription = true;

  pageText.contents().each((_, node) => {
    if (!insideDescription) return false;

    if (isElement(node) && node.tagName === 'strong') {
      if ($(node).text().includes(':')) {
        insideDescription = false;
        return false;
      }

      description += `${$(node).text()} `;
    } else if (node.type === 'text') {
      description += node.data ?? '';
    }
  });

  const result: Omit<ScrapedEducation, 'type'> = {
    title,
    description: description.trim(),
    precondition: null,
    duration: null,
    lecturers: null,
    courseDuration: null,
    renewalDuration: null,
    topics: null,
  };

  pageText.find('strong').each((_, strongEl) => {
    const labelRaw = $(strongEl).text().replace(':', '').trim().toLowerCase();
    const field = LABEL_MAP[labelRaw];

    if (!field) return;

    let value = '';
    let sibling = strongEl.nextSibling;

    while (sibling) {
      if (isElement(sibling)) {
        if (sibling.tagName === 'strong') break;

        if (sibling.tagName === 'ul') {
          $(sibling)
            .find('li')
            .each((_, li) => {
              value += `${$(li).text().trim()}; `;
            });
        } else if (sibling.tagName !== 'br') {
          value += $(sibling).text();
        }
      } else if (sibling.type === 'text') {
        value += sibling.data ?? '';
      }

      sibling = sibling.nextSibling;
    }

    const trimmed = value.trim().replace(/;\s*$/, '').trim();
    result[field] = trimmed || null;
  });

  return result;
};

const scrapeCategory = async (
  url: string,
  type: EducationType,
): Promise<ScrapedEducation[]> => {
  const results: ScrapedEducation[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(`${url}?page=${page}`);
    const $ = cheerio.load(await res.text());

    const items = $('div.block-standard.publikacije');

    if (!items.length) break;

    for (const el of items.toArray()) {
      const href = $(el).find('div.bs-title a').first().attr('href');

      if (!href) continue;

      const detail = await scrapeEducationDetail(`https://www.hck.hr${href}`);

      if (detail) results.push({ ...detail, type });
    }

    const activePage = $('ul.cpagination li.active').first().text().trim();

    if (!activePage || parseInt(activePage, 10) !== page) break;

    page++;
  }

  return results;
};

export const scrapeEducations = async (): Promise<ScrapedEducation[]> => {
  const results: ScrapedEducation[] = [];

  for (const [url, type] of CATEGORY_URLS) {
    const items = await scrapeCategory(url, type);
    results.push(...items);
  }

  return results;
};

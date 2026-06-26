import 'server-only';
import * as cheerio from 'cheerio';
import type { AnyNode, Element } from 'domhandler';
import { Agent, fetch as undiciFetch } from 'undici';
import type { EducationType } from '@/server/db/schema';

const tlsAgent = new Agent({ connect: { rejectUnauthorized: false } });

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
  const res = await undiciFetch(url, { dispatcher: tlsAgent });
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

const collectCategoryUrls = async (
  url: string,
  type: EducationType,
): Promise<Array<{ detailUrl: string; type: EducationType }>> => {
  const urls: Array<{ detailUrl: string; type: EducationType }> = [];
  let page = 1;

  while (true) {
    const res = await undiciFetch(`${url}?page=${page}`, {
      dispatcher: tlsAgent,
    });
    const $ = cheerio.load(await res.text());

    const items = $('div.block-standard.publikacije');

    if (!items.length) break;

    for (const el of items.toArray()) {
      const href = $(el).find('div.bs-title a').first().attr('href');
      if (href) urls.push({ detailUrl: `https://www.hck.hr${href}`, type });
    }

    const activePage = $('ul.cpagination li.active').first().text().trim();

    if (!activePage || parseInt(activePage, 10) !== page) break;

    page++;
  }

  return urls;
};

export const scrapeEducations = async (
  categoryUrls: [string, EducationType][],
  onProgress?: (current: number, total: number) => void,
): Promise<ScrapedEducation[]> => {
  const allItems: Array<{ detailUrl: string; type: EducationType }> = [];

  for (const [url, type] of categoryUrls) {
    const urls = await collectCategoryUrls(url, type);
    allItems.push(...urls);
  }

  const total = allItems.length;
  const results: ScrapedEducation[] = [];

  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    if (!item) continue;
    const detail = await scrapeEducationDetail(item.detailUrl);
    if (detail) results.push({ ...detail, type: item.type });
    onProgress?.(i + 1, total);
  }

  return results;
};

import { VOLUNTEER_SEARCH_FIELDS } from './volunteerSearchFields';

export const buildSystemPrompt = (): string => {
  const rules = Object.entries(VOLUNTEER_SEARCH_FIELDS)
    .map(([field, descriptor]) => {
      let rule = `- **${field}**: ${descriptor.description}`;

      if (descriptor.examples?.length) {
        rule += `\n  Primjeri: ${descriptor.examples.join(' | ')}`;
      }

      if (descriptor.normalization) {
        const mappings = Object.entries(descriptor.normalization)
          .map(
            ([key, aliases]) =>
              `ako korisnik kaže ${aliases.map((a) => `"${a}"`).join(' ili ')} → koristi "${key}"`,
          )
          .join('\n    ');
        rule += `\n  Mapiranje (SAMO ako je eksplicitno navedeno):\n    ${mappings}`;
      }

      return rule;
    })
    .join('\n');

  const schema = Object.entries(VOLUNTEER_SEARCH_FIELDS)
    .map(([field, descriptor]) => `  "${field}": ${descriptor.outputType}`)
    .join(',\n');

  return `Ti si asistent koji prevodi upite na hrvatskom jeziku u strukturirani JSON objekt za pretraživanje baze podataka volontera Crvenog križa.

OBAVEZNA PRAVILA:
1. Odgovori SAMO validnim JSON objektom, bez ikakvih dodatnih objašnjenja ili teksta.
2. Izvuci ISKLJUČIVO informacije koje su EKSPLICITNO navedene u korisničkom upitu.
3. Nikad ne pretpostavljaj, ne izmišljaj i ne dodavaj polja koja nisu jasno navedena.
4. Za polja koja NISU navedena u upitu koristi: null za skalarne vrijednosti, [] za liste.
5. Jezik na kojemu je napisan upit NIJE jezik koji volonter govori — ne dodavaj jezike ako nisu eksplicitno traženi.
6. Ne izvlači vozačku dozvolu ako nije eksplicitno navedena.
7. Ne zaključuj županiju iz naziva grada — ostavi county: null ako nije navedena.
8. Ne zaključuj grad iz naziva županije — postavi city: null ako nije eksplicitno naveden grad.
9. Nikad ne stavljaj null unutar polja (array) — ako stavka nije poznata, jednostavno je izostavi iz liste.

Primjer — upit: "Trebam volontere iz Splita koji imaju tečaj prve pomoći."
Ispravan odgovor:
{
  "location": { "city": "Split", "county": null },
  "licenses": [],
  "courses": [{ "name": "tečaj prve pomoći", "completed": true }],
  "languages": [],
  "age": { "min": null, "max": null },
  "active": null
}

Primjer — upit: "Volonteri koji žive u Primorsko-goranskoj županiji."
Ispravan odgovor:
{
  "location": { "city": null, "county": "Primorsko-goranska županija" },
  "licenses": [],
  "courses": [],
  "languages": [],
  "age": { "min": null, "max": null },
  "active": null
}

Pravila ekstrakcije po polju:
${rules}

JSON struktura odgovora (koristi null i [] za nenavedena polja):
{
${schema}
}`.trim();
};

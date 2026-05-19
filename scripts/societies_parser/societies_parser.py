import json
import os
import re
import requests
from bs4 import BeautifulSoup

URLS = {
    'bjelovarsko-bilogorska': 'https://www.hck.hr/adresar/bjelovarsko-bilogorska/51',
    'brodsko-posavska': 'https://www.hck.hr/adresar/brodsko-posavska/52',
    'dubrovacko-neretvanska': 'https://www.hck.hr/adresar/dubrovacko-neretvanska/53',
    'grad-zagreb': 'https://www.hck.hr/adresar/grad-zagreb/54',
    'istarska': 'https://www.hck.hr/adresar/istarska/55',
    'karlovacka': 'https://www.hck.hr/adresar/karlovacka/56',
    'koprivnicko-krizevacka': 'https://www.hck.hr/adresar/koprivnicko-krizevacka/57',
    'krapinsko-zagorska': 'https://www.hck.hr/adresar/krapinsko-zagorska/58',
    'licko-senjska': 'https://www.hck.hr/adresar/licko-senjska/59',
    'medjimurska': 'https://www.hck.hr/adresar/medjimurska/60',
    'osjecko-baranjska': 'https://www.hck.hr/adresar/osjecko-baranjska/61',
    'pozesko-slavonska': 'https://www.hck.hr/adresar/pozesko-slavonska/62',
    'primorsko-goranska': 'https://www.hck.hr/adresar/primorsko-goranska/63',
    'sisacko-moslavacka': 'https://www.hck.hr/adresar/sisacko-moslavacka/64',
    'splitsko-dalmatinska': 'https://www.hck.hr/adresar/splitsko-dalmatinska/65',
    'sibensko-kninska': 'https://www.hck.hr/adresar/sibensko-kninska/66',
    'varazdinska': 'https://www.hck.hr/adresar/varazdinska/67',
    'viroviticko-podravska': 'https://www.hck.hr/adresar/viroviticko-podravska/68',
    'vukovarsko-srijemska': 'https://www.hck.hr/adresar/vukovarsko-srijemska/69',
    'zadarska': 'https://www.hck.hr/adresar/zadarska/70',
    'zagrebacka': 'https://www.hck.hr/adresar/zagrebacka/71',
}


def clean_text(text):
    if not text:
        return ''
    # Remove zero-width spaces and non-breaking spaces, then strip
    text = text.replace('​', '').replace('\xa0', ' ')
    return re.sub(r'\s+', ' ', text).strip()


def parse_opis(opis_div):
    """Extract fields from an adresar-opis div."""
    data = {
        'address': '',
        'director': '',
        'phone': '',
        'email': '',
        'website': '',
        'city': '',
    }

    for strong in opis_div.find_all('strong'):
        label_raw = clean_text(strong.get_text())
        label = label_raw.lower().replace(':', '').strip()

        # Collect value: text nodes and <a> tags immediately after this <strong>
        value_parts = []
        node = strong.next_sibling
        while node:
            if node.name is not None:
                # It's a tag
                if node.name == 'strong':
                    break
                if node.name == 'a':
                    value_parts.append(clean_text(node.get_text()))
                elif node.name == 'br':
                    break
            else:
                # It's a NavigableString
                text = clean_text(str(node))
                if text:
                    value_parts.append(text)
            node = node.next_sibling

        value = clean_text(' '.join(value_parts))

        if 'adresa' in label:
            data['address'] = value
        elif 'ravnatelj' in label:
            data['director'] = value
        elif 'telefon' in label:
            data['phone'] = value
        elif 'e-mail' in label or 'email' in label:
            # Prefer the href mailto: if present, otherwise text
            a_tag = strong.find_next_sibling('a')
            if a_tag:
                href = a_tag.get('href', '')
                if href.startswith('mailto:'):
                    value = clean_text(href.replace('mailto:', ''))
                else:
                    value = clean_text(a_tag.get_text())
            data['email'] = value
        elif 'web' in label:
            a_tag = strong.find_next_sibling('a')
            if a_tag:
                value = clean_text(a_tag.get_text())
            data['website'] = value
        elif 'grad' in label:
            # "Grad: CityName" or "Grad: 10 000 Zagreb" — take last word(s)
            # Strip postal code prefix (e.g. "10 000 Zagreb" → "Zagreb")
            city_val = re.sub(r'^\d[\d\s]+', '', value).strip()
            if city_val:
                data['city'] = city_val

    return data


def parse_entries(nodes, society_name=''):
    """Parse h3+adresar-opis pairs from a list of nodes into city society entries."""
    entries = []
    pending_name = None

    for node in nodes:
        if node.name is None:
            continue

        if node.name == 'h3' or node.name == 'h2':
            text = clean_text(node.get_text(separator=' '))
            # Skip the "Gradska društva" heading itself if it appears here
            if 'gradska društva' in text.lower():
                continue
            pending_name = text

        elif node.name == 'div' and 'adresar-opis' in node.get('class', []):
            if pending_name:
                opis = parse_opis(node)
                entries.append({'name': pending_name, 'societyName': society_name, **opis})
                pending_name = None

    return entries


def parse_page(slug, url):
    response = requests.get(url, timeout=15)
    response.encoding = 'utf-8'
    soup = BeautifulSoup(response.text, 'html.parser')

    holder = soup.find('div', class_='adresar-holder')
    if not holder:
        print(f'WARNING: no adresar-holder found for {slug}')
        return None, []

    society = None
    city_societies = []

    direct_children = list(holder.children)

    for child in direct_children:
        if child.name is None:
            continue

        if child.name == 'h3' or child.name == 'h2':
            first_text = clean_text(child.get_text(separator=' ').split('\n')[0])

            if 'gradska društva' in first_text.lower():
                # Due to malformed </h2> closing tag, all city societies are nested
                # inside this h3 element — iterate its children
                society_name = society['name'] if society else ''
                city_societies = parse_entries(list(child.children), society_name)
                continue

            # First non-"Gradska društva" h3 is the society name
            if society is None:
                society = {'name': first_text}

        elif child.name == 'div' and 'adresar-opis' in child.get('class', []):
            if society is not None and 'address' not in society:
                opis = parse_opis(child)
                society.update(opis)

    return society, city_societies


def main():
    societies = []
    city_societies = []

    for slug, url in URLS.items():
        print(f'Parsing {slug}...')
        society, cities = parse_page(slug, url)

        if slug == 'grad-zagreb':
            # grad-zagreb is both a society and a city society
            if society:
                societies.append(society)
                city_entry = {**society, 'societyName': society['name']}
                city_societies.append(city_entry)
        else:
            if society:
                societies.append(society)
            city_societies.extend(cities)

    output = {
        'societies': societies,
        'citySocieties': city_societies,
    }

    output_path = os.path.join(os.path.dirname(__file__), 'societies.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f'\nDone. {len(societies)} societies, {len(city_societies)} city societies.')
    print('Output written to societies.json')


if __name__ == '__main__':
    main()
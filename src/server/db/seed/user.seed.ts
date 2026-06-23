import { fileURLToPath } from 'node:url';
import { hash } from 'bcrypt';
import { eq } from 'drizzle-orm';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import { env } from '@/env';
import { db } from '..';
import {
  AddressType,
  addresses,
  ClothingSize,
  cities,
  countries,
  EducationLevel,
  LanguageLevel,
  languages,
  profileSkills,
  profiles,
  profilesAddresses,
  profilesLanguages,
  profilesLicences,
  Sex,
  sizes,
  UserType,
  users,
  workStatuses,
} from '../schema';
import { getLicenses } from './license.seed';

const SALT_OR_ROUNDS = 10;

const names = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana'];
const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];

const getRandomLanguages = (
  userId: string,
  languageIds: string[],
): { profileId: string; languageId: string; level: LanguageLevel }[] => {
  const shuffled = languageIds.sort(() => 0.5 - Math.random());
  const randomSelected = Math.floor(Math.random() * shuffled.length);
  const selected = shuffled.slice(0, randomSelected === 0 ? 1 : randomSelected);
  const randomLevel =
    Object.values(LanguageLevel)[
      Math.floor(Math.random() * Object.values(LanguageLevel).length)
    ]!;

  return selected.map((languageId) => ({
    profileId: userId,
    languageId,
    level: randomLevel,
  }));
};

const insertWorkStatus = async (
  // biome-ignore lint/suspicious/noExplicitAny: any is required here
  tx: PgTransaction<any>,
  profileId: string,
): Promise<void> => {
  const _workStatuses = [
    {
      status: 'EMPLOYED',
      profession: 'Developer',
      institution: 'Company',
      educationLevel: EducationLevel.BACHELOR,
      profileId,
    },
    {
      status: 'UNEMPLOYED',
      profession: 'Unemployed',
      institution: 'None',
      educationLevel: EducationLevel.PRIMARY,
      profileId,
    },
    {
      status: 'STUDENT',
      profession: 'Student',
      institution: 'School',
      educationLevel: EducationLevel.SECONDARY,
      profileId,
    },
  ];

  await tx
    .insert(workStatuses)
    .values(_workStatuses[Math.floor(Math.random() * _workStatuses.length)]!)
    .returning();
};

const generateProfileSkills = (
  profileId: string,
): { name: string; description: string; profileId: string }[] => {
  const skills = [
    'Rad na računalu',
    'Varenje',
    'Piljenje drva',
    'Telekomunikacije',
  ];
  const items: { name: string; description: string; profileId: string }[] = [];

  for (const skill of skills) {
    items.push({
      name: skill,
      description: getRandomLoremIpsum(40),
      profileId,
    });
  }

  return items;
};

const getRandomLoremIpsum = (length: number): string => {
  const loremIpsum =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  let result = '';

  // Loop until we get the desired length of text
  while (result.length < length) {
    const remainingLength = length - result.length;
    const start = Math.floor(
      Math.random() * (loremIpsum.length - remainingLength),
    );
    result += loremIpsum.substring(start, start + remainingLength);
  }

  // Truncate to the exact desired length if necessary
  return result.substring(0, length);
};

const generateUsers = async (
  addressIds: string[],
  languageIds: string[],
  _licences: {
    id: string;
    name: string;
    description: string | null;
    type: string;
  }[],
) => {
  for (let i = 0; i < 20; i++) {
    const userPwd = await hash(
      Math.random().toString(36).slice(-8),
      SALT_OR_ROUNDS,
    );
    const email = `test_${i + 1}@test.com`;
    const userExists = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!userExists) {
      await db.transaction(async (tx) => {
        const [user] = await tx
          .insert(users)
          .values({
            email,
            password: userPwd,
            active: true,
            type: UserType.VOLUNTEER,
          })
          .returning();

        if (!user) throw new Error('User could not be created');

        const [userProfile] = await tx
          .insert(profiles)
          .values({
            userId: user?.id,
            firstName:
              names[Math.floor(Math.random() * names.length)]?.toString() ??
              `Test ${i + 1}`,
            lastName:
              surnames[
                Math.floor(Math.random() * surnames.length)
              ]?.toString() ?? `User ${i + 1}`,
            oib: Math.floor(
              10000000000 + Math.random() * 90000000000,
            ).toString(),
            sex: i % 2 === 0 ? Sex.MALE : Sex.FEMALE,
            nationality: 'Foo',
            parentName: 'Test',
            phone: '+385 91 123 4567',
            birthDate: new Date(1990, 1, 1).toISOString(),
          })
          .returning({ insertedId: profiles.id });

        if (userProfile) {
          await tx.insert(profilesLicences).values({
            profileId: userProfile.insertedId,
            licenceId:
              _licences[Math.floor(Math.random() * _licences.length)]?.id ??
              _licences[0]!.id,
          });
          const _profileSkills = generateProfileSkills(userProfile.insertedId);
          await tx.insert(profileSkills).values(_profileSkills);

          await tx
            .insert(profilesLanguages)
            .values(getRandomLanguages(userProfile.insertedId, languageIds));

          await tx.insert(profilesAddresses).values({
            profileId: userProfile.insertedId,
            addressId:
              addressIds[Math.floor(Math.random() * addressIds.length)]!,
            isPrimary: true,
          });

          await tx
            .insert(sizes)
            .values({
              clothingSize:
                Object.values(ClothingSize)[
                  Math.floor(Math.random() * Object.values(ClothingSize).length)
                ],
              shoeSize: Math.floor(Math.random() * (50 - 37 + 1)) + 37,
              height: Math.floor(Math.random() * (200 - 150 + 1)) + 150,
              weight: Math.floor(Math.random() * (150 - 55 + 1)) + 55,
              profileId: userProfile.insertedId,
            })
            .returning();

          await insertWorkStatus(
            // biome-ignore lint/suspicious/noExplicitAny: any is required here
            tx as unknown as PgTransaction<any>,
            userProfile.insertedId,
          );
        }
      });
    }
  }

  return db.query.users.findMany();
};

async function generateAdmin(
  email: string,
  adminPassword: string,
  _licences: {
    id: string;
    name: string;
    description: string | null;
    type: string;
  }[],
  languageIds: string[],
  addressIds: string[],
) {
  await db.transaction(async (tx) => {
    const [admin] = await tx
      .insert(users)
      .values({
        email,
        password: adminPassword,
        active: true,
        type: UserType.EMPLOYEE,
      })
      .returning();

    if (!admin) throw new Error('Admin user could not be created');

    const [adminProfile] = await tx
      .insert(profiles)
      .values({
        userId: admin?.id,
        firstName: 'Admin',
        lastName: 'Admin',
        oib: Math.floor(10000000000 + Math.random() * 90000000000).toString(),
        sex: Sex.MALE,
        nationality: 'Foo',
        parentName: 'Test',
        birthDate: new Date(1990, 1, 1).toISOString(),
      })
      .returning();

    if (adminProfile && _licences.length) {
      await tx.insert(profilesLicences).values({
        profileId: adminProfile.id,
        licenceId:
          _licences[Math.floor(Math.random() * _licences.length)]?.id ??
          _licences[0]!.id,
      });

      const _profileSkills = generateProfileSkills(adminProfile.id);
      await tx.insert(profileSkills).values(_profileSkills);

      await tx
        .insert(profilesLanguages)
        .values(getRandomLanguages(adminProfile.id, languageIds));

      await tx.insert(profilesAddresses).values({
        profileId: adminProfile.id,
        addressId: addressIds[Math.floor(Math.random() * addressIds.length)]!,
        isPrimary: true,
      });

      await insertWorkStatus(
        // biome-ignore lint/suspicious/noExplicitAny: any is required here
        tx as unknown as PgTransaction<any>,
        adminProfile.id,
      );
    }
  });

  return db.query.users.findMany({
    where: eq(users.email, email),
  });
}

const CROATIAN_CITIES = [
  { name: 'Zagreb', postalCode: '10000', county: 'Grad Zagreb' },
  {
    name: 'Split',
    postalCode: '21000',
    county: 'Splitsko-dalmatinska županija',
  },
  {
    name: 'Rijeka',
    postalCode: '51000',
    county: 'Primorsko-goranska županija',
  },
  { name: 'Osijek', postalCode: '31000', county: 'Osječko-baranjska županija' },
  { name: 'Zadar', postalCode: '23000', county: 'Zadarska županija' },
  {
    name: 'Slavonski Brod',
    postalCode: '35000',
    county: 'Brodsko-posavska županija',
  },
  { name: 'Velika Gorica', postalCode: '10410', county: 'Zagrebačka županija' },
  { name: 'Karlovac', postalCode: '47000', county: 'Karlovačka županija' },
  { name: 'Pula', postalCode: '52100', county: 'Istarska županija' },
  { name: 'Sisak', postalCode: '44000', county: 'Sisačko-moslavačka županija' },
  { name: 'Šibenik', postalCode: '22000', county: 'Šibensko-kninska županija' },
  { name: 'Varaždin', postalCode: '42000', county: 'Varaždinska županija' },
  {
    name: 'Dubrovnik',
    postalCode: '20000',
    county: 'Dubrovačko-neretvanska županija',
  },
  {
    name: 'Bjelovar',
    postalCode: '43000',
    county: 'Bjelovarsko-bilogorska županija',
  },
  { name: 'Samobor', postalCode: '10430', county: 'Zagrebačka županija' },
  {
    name: 'Vinkovci',
    postalCode: '32100',
    county: 'Vukovarsko-srijemska županija',
  },
  {
    name: 'Kaštela',
    postalCode: '21212',
    county: 'Splitsko-dalmatinska županija',
  },
  {
    name: 'Vukovar',
    postalCode: '32000',
    county: 'Vukovarsko-srijemska županija',
  },
  {
    name: 'Koprivnica',
    postalCode: '48000',
    county: 'Koprivničko-križevačka županija',
  },
  { name: 'Čakovec', postalCode: '40000', county: 'Međimurska županija' },
  { name: 'Đakovo', postalCode: '31400', county: 'Osječko-baranjska županija' },
  { name: 'Požega', postalCode: '34000', county: 'Požesko-slavonska županija' },
  {
    name: 'Sinj',
    postalCode: '21230',
    county: 'Splitsko-dalmatinska županija',
  },
  {
    name: 'Kutina',
    postalCode: '44320',
    county: 'Sisačko-moslavačka županija',
  },
  {
    name: 'Petrinja',
    postalCode: '44250',
    county: 'Sisačko-moslavačka županija',
  },
  { name: 'Zaprešić', postalCode: '10290', county: 'Zagrebačka županija' },
  {
    name: 'Virovitica',
    postalCode: '33000',
    county: 'Virovitičko-podravska županija',
  },
  {
    name: 'Križevci',
    postalCode: '48260',
    county: 'Koprivničko-križevačka županija',
  },
  {
    name: 'Solin',
    postalCode: '21210',
    county: 'Splitsko-dalmatinska županija',
  },
  { name: 'Poreč', postalCode: '52440', county: 'Istarska županija' },
  { name: 'Našice', postalCode: '31500', county: 'Osječko-baranjska županija' },
  { name: 'Jastrebarsko', postalCode: '10450', county: 'Zagrebačka županija' },
  {
    name: 'Županja',
    postalCode: '32270',
    county: 'Vukovarsko-srijemska županija',
  },
  {
    name: 'Sveti Ivan Zelina',
    postalCode: '10380',
    county: 'Zagrebačka županija',
  },
  {
    name: 'Nova Gradiška',
    postalCode: '35400',
    county: 'Brodsko-posavska županija',
  },
  { name: 'Sveta Nedelja', postalCode: '10431', county: 'Zagrebačka županija' },
  {
    name: 'Omiš',
    postalCode: '21310',
    county: 'Splitsko-dalmatinska županija',
  },
  {
    name: 'Metković',
    postalCode: '20350',
    county: 'Dubrovačko-neretvanska županija',
  },
  { name: 'Knin', postalCode: '22300', county: 'Šibensko-kninska županija' },
  { name: 'Ogulin', postalCode: '47300', county: 'Karlovačka županija' },
  {
    name: 'Slatina',
    postalCode: '33520',
    county: 'Virovitičko-podravska županija',
  },
  { name: 'Ivanić Grad', postalCode: '10310', county: 'Zagrebačka županija' },
  { name: 'Vrbovec', postalCode: '10340', county: 'Zagrebačka županija' },
  { name: 'Ivanec', postalCode: '42240', county: 'Varaždinska županija' },
  {
    name: 'Novska',
    postalCode: '44330',
    county: 'Sisačko-moslavačka županija',
  },
  { name: 'Dugo Selo', postalCode: '10370', county: 'Zagrebačka županija' },
  { name: 'Rovinj', postalCode: '52210', county: 'Istarska županija' },
  { name: 'Novi Marof', postalCode: '42220', county: 'Varaždinska županija' },
  {
    name: 'Makarska',
    postalCode: '21300',
    county: 'Splitsko-dalmatinska županija',
  },
  {
    name: 'Daruvar',
    postalCode: '43500',
    county: 'Bjelovarsko-bilogorska županija',
  },
  {
    name: 'Trogir',
    postalCode: '21220',
    county: 'Splitsko-dalmatinska županija',
  },
  { name: 'Gospić', postalCode: '53000', county: 'Ličko-senjska županija' },
  {
    name: 'Krapina',
    postalCode: '49000',
    county: 'Krapinsko-zagorska županija',
  },
  { name: 'Umag', postalCode: '52470', county: 'Istarska županija' },
  {
    name: 'Pleternica',
    postalCode: '34310',
    county: 'Požesko-slavonska županija',
  },
  {
    name: 'Opatija',
    postalCode: '51410',
    county: 'Primorsko-goranska županija',
  },
  { name: 'Labin', postalCode: '52220', county: 'Istarska županija' },
  {
    name: 'Valpovo',
    postalCode: '31550',
    county: 'Osječko-baranjska županija',
  },
  { name: 'Duga Resa', postalCode: '47250', county: 'Karlovačka županija' },
  {
    name: 'Belišće',
    postalCode: '31551',
    county: 'Osječko-baranjska županija',
  },
  {
    name: 'Garešnica',
    postalCode: '43280',
    county: 'Bjelovarsko-bilogorska županija',
  },
  {
    name: 'Crikvenica',
    postalCode: '51260',
    county: 'Primorsko-goranska županija',
  },
  {
    name: 'Beli Manastir',
    postalCode: '31300',
    county: 'Osječko-baranjska županija',
  },
  {
    name: 'Ploče',
    postalCode: '20340',
    county: 'Dubrovačko-neretvanska županija',
  },
  {
    name: 'Trilj',
    postalCode: '21240',
    county: 'Splitsko-dalmatinska županija',
  },
  { name: 'Otočac', postalCode: '53220', county: 'Ličko-senjska županija' },
  {
    name: 'Donji Miholjac',
    postalCode: '31540',
    county: 'Osječko-baranjska županija',
  },
  {
    name: 'Imotski',
    postalCode: '21260',
    county: 'Splitsko-dalmatinska županija',
  },
  { name: 'Glina', postalCode: '44400', county: 'Sisačko-moslavačka županija' },
  { name: 'Benkovac', postalCode: '23420', county: 'Zadarska županija' },
  { name: 'Rab', postalCode: '51280', county: 'Primorsko-goranska županija' },
  { name: 'Vodice', postalCode: '22211', county: 'Šibensko-kninska županija' },
  { name: 'Zabok', postalCode: '49210', county: 'Krapinsko-zagorska županija' },
  { name: 'Pazin', postalCode: '52000', county: 'Istarska županija' },
  {
    name: 'Čazma',
    postalCode: '43240',
    county: 'Bjelovarsko-bilogorska županija',
  },
  {
    name: 'Kastav',
    postalCode: '51215',
    county: 'Primorsko-goranska županija',
  },
  {
    name: 'Đurđevac',
    postalCode: '48350',
    county: 'Koprivničko-križevačka županija',
  },
  { name: 'Pakrac', postalCode: '34550', county: 'Požesko-slavonska županija' },
  { name: 'Lepoglava', postalCode: '42250', county: 'Varaždinska županija' },
  { name: 'Ludbreg', postalCode: '42230', county: 'Varaždinska županija' },
  { name: 'Drniš', postalCode: '22320', county: 'Šibensko-kninska županija' },
  {
    name: 'Mali Lošinj',
    postalCode: '51550',
    county: 'Primorsko-goranska županija',
  },
  {
    name: 'Ilok',
    postalCode: '32236',
    county: 'Vukovarsko-srijemska županija',
  },
  { name: 'Senj', postalCode: '53270', county: 'Ličko-senjska županija' },
  { name: 'Ozalj', postalCode: '47280', county: 'Karlovačka županija' },
  { name: 'Prelog', postalCode: '40323', county: 'Međimurska županija' },
  { name: 'Bakar', postalCode: '51222', county: 'Primorsko-goranska županija' },
  {
    name: 'Otok',
    postalCode: '32252',
    county: 'Vukovarsko-srijemska županija',
  },
  {
    name: 'Vrgorac',
    postalCode: '21276',
    county: 'Splitsko-dalmatinska županija',
  },
  {
    name: 'Grubišno Polje',
    postalCode: '43290',
    county: 'Bjelovarsko-bilogorska županija',
  },
  {
    name: 'Kutjevo',
    postalCode: '34340',
    county: 'Požesko-slavonska županija',
  },
  {
    name: 'Pregrada',
    postalCode: '49218',
    county: 'Krapinsko-zagorska županija',
  },
  {
    name: 'Varaždinske Toplice',
    postalCode: '42223',
    county: 'Varaždinska županija',
  },
  { name: 'Lipik', postalCode: '34551', county: 'Požesko-slavonska županija' },
  {
    name: 'Mursko Središće',
    postalCode: '40315',
    county: 'Međimurska županija',
  },
  {
    name: 'Zlatar',
    postalCode: '49250',
    county: 'Krapinsko-zagorska županija',
  },
  {
    name: 'Delnice',
    postalCode: '51300',
    county: 'Primorsko-goranska županija',
  },
  {
    name: 'Oroslavje',
    postalCode: '49243',
    county: 'Krapinsko-zagorska županija',
  },
  { name: 'Slunj', postalCode: '47240', county: 'Karlovačka županija' },
  { name: 'Buzet', postalCode: '52420', county: 'Istarska županija' },
  {
    name: 'Vrbovsko',
    postalCode: '51326',
    county: 'Primorsko-goranska županija',
  },
  {
    name: 'Donja Stubica',
    postalCode: '49240',
    county: 'Krapinsko-zagorska županija',
  },
  {
    name: 'Korčula',
    postalCode: '20260',
    county: 'Dubrovačko-neretvanska županija',
  },
  {
    name: 'Orahovica',
    postalCode: '33515',
    county: 'Virovitičko-podravska županija',
  },
  { name: 'Vodnjan', postalCode: '52215', county: 'Istarska županija' },
  { name: 'Krk', postalCode: '51500', county: 'Primorsko-goranska županija' },
  { name: 'Buje', postalCode: '52460', county: 'Istarska županija' },
  {
    name: 'Novi Vinodolski',
    postalCode: '51250',
    county: 'Primorsko-goranska županija',
  },
  { name: 'Biograd na Moru', postalCode: '23210', county: 'Zadarska županija' },
  { name: 'Nin', postalCode: '23232', county: 'Zadarska županija' },
  {
    name: 'Kraljevica',
    postalCode: '51262',
    county: 'Primorsko-goranska županija',
  },
  { name: 'Čabar', postalCode: '51306', county: 'Primorsko-goranska županija' },
  { name: 'Pag', postalCode: '23250', county: 'Zadarska županija' },
  {
    name: 'Hvar',
    postalCode: '21450',
    county: 'Splitsko-dalmatinska županija',
  },
  { name: 'Novigrad', postalCode: '52466', county: 'Istarska županija' },
  { name: 'Skradin', postalCode: '22222', county: 'Šibensko-kninska županija' },
  {
    name: 'Supetar',
    postalCode: '21400',
    county: 'Splitsko-dalmatinska županija',
  },
  { name: 'Obrovac', postalCode: '23450', county: 'Zadarska županija' },
  { name: 'Novalja', postalCode: '53291', county: 'Ličko-senjska županija' },
  {
    name: 'Opuzen',
    postalCode: '20355',
    county: 'Dubrovačko-neretvanska županija',
  },
  {
    name: 'Klanjec',
    postalCode: '49290',
    county: 'Krapinsko-zagorska županija',
  },
  { name: 'Cres', postalCode: '51557', county: 'Primorsko-goranska županija' },
  {
    name: 'Stari Grad',
    postalCode: '21460',
    county: 'Splitsko-dalmatinska županija',
  },
  {
    name: 'Hrvatska Kostajnica',
    postalCode: '44430',
    county: 'Sisačko-moslavačka županija',
  },
  {
    name: 'Vrlika',
    postalCode: '21236',
    county: 'Splitsko-dalmatinska županija',
  },
  { name: 'Vis', postalCode: '21480', county: 'Splitsko-dalmatinska županija' },
  {
    name: 'Komiža',
    postalCode: '21485',
    county: 'Splitsko-dalmatinska županija',
  },
];

const generateCountriesWithCities = async (): Promise<string[]> => {
  const _countries: string[] = [
    'Afganistan',
    'Albanija',
    'Alžir',
    'Andora',
    'Angola',
    'Antigva i Barbuda',
    'Argentina',
    'Armenija',
    'Australija',
    'Austrija',
    'Azerbajdžan',
    'Bahami',
    'Bahrein',
    'Bangladeš',
    'Barbados',
    'Belgija',
    'Beliz',
    'Bjelorusija',
    'Benin',
    'Butan',
    'Bolivija',
    'Bosna i Hercegovina',
    'Bocvana',
    'Brazil',
    'Brunej',
    'Bugarska',
    'Burkina Faso',
    'Burundi',
    'Kambodža',
    'Kamerun',
    'Kanada',
    'Zelenortska Republika',
    'Srednjoafrička Republika',
    'Čad',
    'Čile',
    'Kina',
    'Kolumbija',
    'Komori',
    'Kongo (Brazzaville)',
    'Kongo (Kinshasa)',
    'Kostarika',
    'Hrvatska',
    'Kuba',
    'Kipar',
    'Češka',
    'Danska',
    'Džibuti',
    'Dominika',
    'Dominikanska Republika',
    'Ekvador',
    'Egipat',
    'Salvadore',
    'Ekvatorska Gvineja',
    'Eritreja',
    'Estonija',
    'Esvatini',
    'Etiopija',
    'Fidži',
    'Finska',
    'Francuska',
    'Gabon',
    'Gambija',
    'Gruzija',
    'Njemačka',
    'Gana',
    'Grčka',
    'Grenada',
    'Gvatemala',
    'Gvineja',
    'Gvineja-Bisau',
    'Gvajana',
    'Haiti',
    'Honduras',
    'Mađarska',
    'Island',
    'Indija',
    'Indonezija',
    'Iran',
    'Irak',
    'Irska',
    'Izrael',
    'Italija',
    'Obala Bjelokosti',
    'Jamajka',
    'Japan',
    'Jordan',
    'Kazahstan',
    'Kenija',
    'Kiribati',
    'Kuvajt',
    'Kirgistan',
    'Laos',
    'Latvija',
    'Libanon',
    'Lesoto',
    'Liberija',
    'Libija',
    'Lihtenštajn',
    'Litva',
    'Luksemburg',
    'Madagaskar',
    'Malavi',
    'Malezija',
    'Maldivi',
    'Mali',
    'Malta',
    'Maršalski Otoci',
    'Mauritanija',
    'Mauricijus',
    'Meksiko',
    'Mikronezija',
    'Moldavija',
    'Monako',
    'Mongolija',
    'Crna Gora',
    'Maroko',
    'Mozambik',
    'Mjanmar',
    'Namibija',
    'Nauru',
    'Nepal',
    'Nizozemska',
    'Novi Zeland',
    'Nikaragva',
    'Niger',
    'Nigerija',
    'Sjeverna Koreja',
    'Sjeverna Makedonija',
    'Norveška',
    'Oman',
    'Pakistan',
    'Palau',
    'Panama',
    'Papua Nova Gvineja',
    'Paragvaj',
    'Peru',
    'Filipini',
    'Poljska',
    'Portugal',
    'Katar',
    'Rumunjska',
    'Rusija',
    'Ruanda',
    'Sveti Kristofor i Nevis',
    'Sveti Lucia',
    'Sveti Vincent i Grenadini',
    'Samoa',
    'San Marino',
    'Sao Tome i Principe',
    'Saudijska Arabija',
    'Senegal',
    'Srbija',
    'Sejšeli',
    'Sierra Leone',
    'Singapur',
    'Slovačka',
    'Slovenija',
    'Solomonski Otoci',
    'Somalija',
    'Južna Afrika',
    'Južna Koreja',
    'Južni Sudan',
    'Španjolska',
    'Šri Lanka',
    'Sudan',
    'Surinam',
    'Švedska',
    'Švicarska',
    'Sirija',
    'Tajvan',
    'Tadžikistan',
    'Tanzanija',
    'Tajland',
    'Togo',
    'Tonga',
    'Trinidad i Tobago',
    'Tunis',
    'Turska',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukrajina',
    'Ujedinjeni Arapski Emirati',
    'Ujedinjeno Kraljevstvo',
    'Sjedinjene Američke Države',
    'Urugvaj',
    'Uzbekistan',
    'Vanuatu',
    'Vatikan',
    'Venezuela',
    'Vijetnam',
    'Jemen',
    'Zambija',
    'Zimbabve',
  ];

  const existingCountries = await db.query.countries.findMany();
  let insertedCountries: { name: string; insertedId: string }[];

  if (!existingCountries.length) {
    insertedCountries = await db
      .insert(countries)
      .values(
        _countries.map((_country) => ({
          name: _country,
        })),
      )
      .returning({ insertedId: countries.id, name: countries.name });
  } else {
    insertedCountries = existingCountries.map((country) => ({
      name: country.name,
      insertedId: country.id,
    }));
  }

  const croatiaId = insertedCountries.find(
    (c) => c.name === 'Hrvatska',
  )?.insertedId;
  if (!croatiaId) throw new Error('Croatia country not found');

  const existingCroatianCities = await db
    .select({ id: cities.id, name: cities.name, county: cities.county })
    .from(cities)
    .where(eq(cities.countryId, croatiaId));

  const existingByName = new Map(
    existingCroatianCities.map((c) => [c.name, c]),
  );

  const toInsert = CROATIAN_CITIES.filter((c) => !existingByName.has(c.name));
  const toUpdate = CROATIAN_CITIES.filter((c) => existingByName.has(c.name));

  let newCityIds: string[] = [];

  if (toInsert.length > 0) {
    const inserted = await db
      .insert(cities)
      .values(
        toInsert.map((c) => ({
          name: c.name,
          postalCode: c.postalCode,
          county: c.county,
          countryId: croatiaId,
        })),
      )
      .returning({ id: cities.id });
    newCityIds = inserted.map((r) => r.id);
  }

  for (const city of toUpdate) {
    const existing = existingByName.get(city.name)!;
    await db
      .update(cities)
      .set({
        county: city.county,
        postalCode: city.postalCode,
        updatedAt: new Date(),
      })
      .where(eq(cities.id, existing.id));
  }

  return [...existingCroatianCities.map((c) => c.id), ...newCityIds];
};

const generateAddresses = async (cityIds: string[]): Promise<string[]> => {
  const existingAddresses = await db.query.addresses.findMany({
    columns: { id: true },
  });
  if (existingAddresses.length) return existingAddresses.map(({ id }) => id);

  const streetNames = ['Foo', 'Bar', 'Baz', 'Qux', 'Quux', 'Corge'];

  const _addresses: { street: string; streetNumber: string }[] = streetNames
    .concat(streetNames)
    .concat(streetNames)
    .concat(streetNames)
    .map((street, index) => ({ street, streetNumber: (index + 1).toString() }));

  const insertedAddresses = await db
    .insert(addresses)
    .values(
      _addresses.map((_address, i) => ({
        street: _address.street,
        streetNumber: _address.streetNumber,
        cityId: cityIds[i % cityIds.length],
        type: AddressType.PERMANENT_RESIDENCE,
      })),
    )
    .returning({ insertedId: addresses.id });

  return insertedAddresses.map((address) => address.insertedId);
};

const generateLanguages = async (): Promise<string[]> => {
  const _languages: string[] = [
    'Engleski',
    'Talijanski',
    'Njemački',
    'Španjolski',
    'Francuski',
    'Ruski',
    'Portugalski',
    'Slovenski',
    'Albanski',
    'Makedonski',
    'Mandarinski kineski',
    'Hindustani (hindi + urdu)',
    'Arapski',
  ];

  const existingLanguages = await db.query.languages.findMany({
    columns: { id: true },
  });
  if (existingLanguages.length) {
    return existingLanguages.map(({ id }) => id);
  }

  const items: { name: string }[] = [];
  for (const lang of _languages) {
    items.push({ name: lang });
  }

  const res = await db.insert(languages).values(items).returning();
  return res.map(({ id }) => id);
};

export const getUsers = async () => {
  const cityIds = await generateCountriesWithCities();
  const addressIds = await generateAddresses(cityIds);
  const languageIds = await generateLanguages();
  const _licences = await getLicenses();
  console.log('Done seeding licenses.');
  let _users = await db.query.users.findMany();
  if (!_users.length) {
    _users = await generateUsers(addressIds, languageIds, _licences);
  }

  return _users;
};

const email = 'admin@dck-pgz.hr';
const adminPassword = await hash(env.ADMIN_PASSWORD, SALT_OR_ROUNDS);

export const getAdmin = async () => {
  const adminExists = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!adminExists) {
    const _licences = await getLicenses();
    const cityIds = await generateCountriesWithCities();
    const addressIds = await generateAddresses(cityIds);
    const languageIds = await generateLanguages();

    return generateAdmin(
      email,
      adminPassword,
      _licences,
      languageIds,
      addressIds,
    );
  }

  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
};

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  await getUsers()
    .then(() => console.log('Done seeding users.'))
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });

  await getAdmin()
    .then(() => {
      console.log('Done seeding admin.');
      process.exit(0);
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
}

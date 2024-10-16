import { hash } from "bcrypt";
import { env } from "~/env";
import { db } from "../db/index";
import { eq } from "drizzle-orm";
import {
  addresses,
  AddressType,
  cities,
  ClothingSize,
  countries,
  DrivingLicense,
  educations,
  EducationLevel,
  EducationType,
  LanguageLevel,
  languages,
  License,
  licenses,
  profiles,
  profilesAddresses,
  profileSkills,
  profilesLanguages,
  profilesLicences,
  Sex,
  sizes,
  users,
  workStatuses,
} from "../db/schema";
import { type PgTransaction } from "drizzle-orm/pg-core";
import * as XLSX from "xlsx";
import { readFileSync } from "fs";

const SALT_OR_ROUNDS = 10;
const names = ["John", "Jane", "Alice", "Bob", "Charlie", "Diana"];
const surnames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia"];

const getRandomLoremIpsum = (length: number): string => {
  const loremIpsum =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
  let result = "";

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

const populateLicenses = async () => {
  const _licenses = Object.values(DrivingLicense).map((type) => ({
    type: License.DRIVING,
    name: type,
    description: "",
  }));

  return db.insert(licenses).values(_licenses).returning();
};
interface Education {
  title: string;
  description: string;
  precondition?: string;
  duration?: string;
  lecturers?: string;
  course_duration?: string;
  renewal_duration?: string;
  topics?: string;
  type: EducationType;
}
const headerMapping: Record<string, keyof Education> = {
  Title: "title",
  Description: "description",
  Preduvjet: "precondition",
  Trajanje: "duration",
  Predavači: "lecturers",
  "Trajanje tečaja": "course_duration",
  "Trajanje obnove": "renewal_duration",
  Teme: "topics",
};
const sheetNameMapping: Record<string, EducationType> = {
  "za-volontere": EducationType.VOLUNTEERS,
  "za-javnost": EducationType.PUBLIC,
  "za-djelatnike": EducationType.EMPLOYEE,
};
const readExcelFile = (filePath: string): Education[] => {
  const fileBuffer = readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });

  const educations: Education[] = [];

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const data: string[][] = XLSX.utils.sheet_to_json(sheet!, { header: 1 });

    const headers = data[0];
    const rows = data.slice(1);

    const type = sheetNameMapping[sheetName];

    const sheetEducations = rows.map((row) => {
      const education: Partial<Education> = {};
      headers!.forEach((header, index) => {
        const propertyName = headerMapping[header];
        if (propertyName) {
          if (propertyName !== "type") {
            education[propertyName] = row[index];
          }
        }
      });
      education.type = type;
      return education as Education;
    });

    educations.push(...sheetEducations);
  });

  return educations;
};
const populateEducations = async () => {
  const filePath = "scripts/educations_parser/edukacije.xlsx";
  const _educations = readExcelFile(filePath);

  return db.insert(educations).values(_educations).returning();
};

const generateCountriesWithCities = async (): Promise<string[]> => {
  const _cities = [
    { name: "Rijeka", zip: "51000" },
    { name: "Zagreb", zip: "10000" },
    { name: "Split", zip: "21000" },
    { name: "Osijek", zip: "31000" },
    { name: "Dubrovnik", zip: "20000" },
    { name: "Ljubljana", zip: "1000" },
  ];
  const _countries = ["Croatia", "Slovenia"];

  const existingCities = await db.query.cities.findMany({
    columns: { id: true },
  });
  if (existingCities.length) return existingCities.map(({ id }) => id);

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

  const insertedCities = await db
    .insert(cities)
    .values(
      _cities.map((_city) => ({
        name: _city.name,
        postalCode: _city.zip,
        countryId:
          _city.name === "Ljubljana"
            ? insertedCountries.find((c) => c.name === "Slovenia")?.insertedId
            : insertedCountries.find((c) => c.name === "Croatia")?.insertedId,
      })),
    )
    .returning({ insertedId: cities.id });

  return insertedCities.map(({ insertedId }) => insertedId);
};

const generateAddresses = async (cityIds: string[]): Promise<string[]> => {
  const existingAddresses = await db.query.addresses.findMany({
    columns: { id: true },
  });
  if (existingAddresses.length) return existingAddresses.map(({ id }) => id);

  const streetNames = ["Foo", "Bar", "Baz", "Qux", "Quux", "Corge"];

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

const insertWorkStatus = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: PgTransaction<any>,
  profileId: string,
): Promise<void> => {
  const _workStatuses = [
    {
      status: "EMPLOYED",
      profession: "Developer",
      institution: "Company",
      educationLevel: EducationLevel.BACHELOR,
      profileId,
    },
    {
      status: "UNEMPLOYED",
      profession: "Unemployed",
      institution: "None",
      educationLevel: EducationLevel.PRIMARY,
      profileId,
    },
    {
      status: "STUDENT",
      profession: "Student",
      institution: "School",
      educationLevel: EducationLevel.SECONDARY,
      profileId,
    },
  ];

  await tx
    .insert(workStatuses)
    .values(_workStatuses[Math.floor(Math.random() * _workStatuses.length)]!)
    .returning();
};

const generateLanguages = async (): Promise<string[]> => {
  const _languages = [
    "Croatian",
    "English",
    "German",
    "Italian",
    "Spanish",
    "French",
    "Russian",
  ];

  const existingLanguages = await db.query.languages.findMany({
    columns: { id: true },
  });
  if (existingLanguages.length) return existingLanguages.map(({ id }) => id);
  const items: { name: string }[] = [];
  for (const lang of _languages) {
    items.push({ name: lang });
  }

  const res = await db.insert(languages).values(items).returning();
  return res.map(({ id }) => id);
};

const generateProfileSkills = (
  profileId: string,
): { name: string; description: string; profileId: string }[] => {
  const skills = [
    "Rad na računalu",
    "Varenje",
    "Piljenje drva",
    "Telekomunikacije",
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
          })
          .returning();

        if (!user) throw new Error("User could not be created");

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
            nationality: "Foo",
            parentName: "Test",
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tx as unknown as PgTransaction<any>,
            userProfile.insertedId,
          );
        }
      });
    }
  }
};

const main = async () => {
  const adminPassword = await hash(env.ADMIN_PASSWORD, SALT_OR_ROUNDS);
  const email = "admin@dck-pgz.hr";

  let _licences = await db.query.licenses.findMany();
  if (!_licences.length) {
    _licences = await populateLicenses();
  }

  let _educations = await db.query.educations.findMany();
  if (!_educations.length) {
    _educations = await populateEducations();
  }

  const cityIds = await generateCountriesWithCities();
  const addressIds = await generateAddresses(cityIds);
  const languageIds = await generateLanguages();

  const adminExists = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!adminExists) {
    await db.transaction(async (tx) => {
      const [admin] = await tx
        .insert(users)
        .values({
          email,
          password: adminPassword,
          active: true,
        })
        .returning();

      if (!admin) throw new Error("Admin user could not be created");

      const [adminProfile] = await tx
        .insert(profiles)
        .values({
          userId: admin?.id,
          firstName: "Admin",
          lastName: "Admin",
          oib: Math.floor(10000000000 + Math.random() * 90000000000).toString(),
          sex: Sex.MALE,
          nationality: "Foo",
          parentName: "Test",
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tx as unknown as PgTransaction<any>,
          adminProfile.id,
        );
      }
    });
  }

  await generateUsers(addressIds, languageIds, _licences);
};

main()
  .then(() => (console.log("Seed completed"), process.exit(0)))
  .catch(console.error);

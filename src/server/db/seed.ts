import { hash } from "bcrypt";
import { env } from "~/env";
import { db } from "../db/index";
import { eq } from "drizzle-orm";
import {
  addresses,
  cities,
  ClothingSize,
  countries,
  DrivingLicense,
  EducationLevel,
  LanguageLevel,
  languages,
  License,
  licenses,
  profiles,
  profileSkills,
  profilesLicences,
  Sex,
  sizes,
  users,
  workStatuses,
} from "../db/schema";

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

  const _addresses = [
    { street: "Foo", streetNumber: "1" },
    { street: "Bar", streetNumber: "2" },
    { street: "Baz", streetNumber: "3" },
    { street: "Qux", streetNumber: "4" },
    { street: "Quux", streetNumber: "5" },
    { street: "Corge", streetNumber: "6" },
  ];

  const insertedAddresses = await db
    .insert(addresses)
    .values(
      _addresses.map((_address, i) => ({
        street: _address.street,
        streetNumber: _address.streetNumber,
        cityId: cityIds[i % cityIds.length],
      })),
    )
    .returning({ insertedId: addresses.id });

  return insertedAddresses.map((address) => address.insertedId);
};

const generateWorkStatuses = async (): Promise<string[]> => {
  const existingWorkStatuses = await db.query.workStatuses.findMany({
    columns: { id: true },
  });
  if (existingWorkStatuses.length)
    return existingWorkStatuses.map(({ id }) => id);

  const _workStatuses = [
    {
      status: "EMPLOYED",
      profession: "Developer",
      institution: "Company",
      educationLevel: EducationLevel.BACHELOR,
    },
    {
      status: "UNEMPLOYED",
      profession: "Unemployed",
      institution: "None",
      educationLevel: EducationLevel.PRIMARY,
    },
    {
      status: "STUDENT",
      profession: "Student",
      institution: "School",
      educationLevel: EducationLevel.SECONDARY,
    },
  ];

  const res = await db.insert(workStatuses).values(_workStatuses).returning();
  return res.map(({ id }) => id);
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
  const items: { name: string; level: LanguageLevel }[] = [];
  for (const lang of _languages) {
    for (const level of Object.values(LanguageLevel)) {
      items.push({ name: lang, level });
    }
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

const generateUsers = async (
  addressIds: string[],
  workStatusIds: string[],
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

        const [size] = await tx
          .insert(sizes)
          .values({
            clothingSize:
              Object.values(ClothingSize)[
                Math.floor(Math.random() * Object.values(ClothingSize).length)
              ],
            shoeSize: Math.floor(Math.random() * (50 - 37 + 1)) + 37,
            height: Math.floor(Math.random() * (200 - 150 + 1)) + 150,
            weight: Math.floor(Math.random() * (150 - 55 + 1)) + 55,
          })
          .returning();

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
            sizeId: size?.id,
            addressId:
              addressIds[Math.floor(Math.random() * addressIds.length)],
            workStatusId:
              workStatusIds[Math.floor(Math.random() * workStatusIds.length)],
            languageId:
              languageIds[Math.floor(Math.random() * languageIds.length)],
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

  const cityIds = await generateCountriesWithCities();
  const addressIds = await generateAddresses(cityIds);
  const workStatusIds = await generateWorkStatuses();
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
          addressId: addressIds[Math.floor(Math.random() * addressIds.length)],
          workStatusId:
            workStatusIds[Math.floor(Math.random() * workStatusIds.length)],
          languageId:
            languageIds[Math.floor(Math.random() * languageIds.length)],
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
      }
    });
  }

  await generateUsers(addressIds, workStatusIds, languageIds, _licences);
};

main()
  .then(() => (console.log("Seed completed"), process.exit(0)))
  .catch(console.error);

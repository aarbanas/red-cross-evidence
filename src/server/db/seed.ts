import { hash } from "bcrypt";
import { env } from "~/env";
import { db } from "../db/index";
import { eq } from "drizzle-orm";
import {
  addresses,
  AddressType,
  cities,
  countries,
  languages,
  profiles,
  profilesAddresses,
  profileSkills,
  profilesLanguages,
  profilesLicences,
  Sex,
  users,
} from "../db/schema";
import { type PgTransaction } from "drizzle-orm/pg-core";
import { populateEducations } from "./seed/education.seed";
import { populateLicenses } from "./seed/license.seed";
import {
  generateProfileSkills,
  generateUsers,
  insertWorkStatus,
  SALT_OR_ROUNDS,
  getRandomLanguages,
} from "./seed/user.seed";

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

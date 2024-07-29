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
  License,
  licenses,
  profiles,
  Sex,
  sizes,
  users,
  workStatuses,
} from "../db/schema";

const SALT_OR_ROUNDS = 10;
const names = ["John", "Jane", "Alice", "Bob", "Charlie", "Diana"];
const surnames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia"];

const populateLicenses = async () => {
  const _licenses = Object.values(DrivingLicense).map((type) => ({
    type: License.DRIVING,
    name: type,
    description: "",
  }));

  await db.insert(licenses).values(_licenses).returning();
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
    },
    {
      status: "UNEMPLOYED",
      profession: "Unemployed",
      institution: "None",
    },
    {
      status: "STUDENT",
      profession: "Student",
      institution: "School",
    },
  ];

  const res = await db.insert(workStatuses).values(_workStatuses).returning();
  return res.map(({ id }) => id);
};

const generateUsers = async (addressIds: string[], workStatusIds: string[]) => {
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

        await tx.insert(profiles).values({
          userId: user?.id,
          firstName:
            names[Math.floor(Math.random() * names.length)]?.toString() ??
            `Test ${i + 1}`,
          lastName:
            surnames[Math.floor(Math.random() * surnames.length)]?.toString() ??
            `User ${i + 1}`,
          pin: Math.floor(10000000000 + Math.random() * 90000000000).toString(),
          sex: i % 2 === 0 ? Sex.MALE : Sex.FEMALE,
          nationality: "Foo",
          parentName: "Test",
          birthDate: new Date(1990, 1, 1).toISOString(),
          sizeId: size?.id,
          addressId: addressIds[Math.floor(Math.random() * addressIds.length)],
          workStatusId:
            workStatusIds[Math.floor(Math.random() * workStatusIds.length)],
        });
      });
    }
  }
};

const main = async () => {
  const adminPassword = await hash(env.ADMIN_PASSWORD, SALT_OR_ROUNDS);
  const email = "admin@dck-pgz.hr";

  const licences = await db.query.licenses.findMany();
  if (!licences.length) {
    await populateLicenses();
  }

  const cityIds = await generateCountriesWithCities();
  const addressIds = await generateAddresses(cityIds);
  const workStatusIds = await generateWorkStatuses();

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

      await tx.insert(profiles).values({
        userId: admin?.id,
        firstName: "Admin",
        lastName: "Admin",
        pin: Math.floor(10000000000 + Math.random() * 90000000000).toString(),
        sex: Sex.MALE,
        nationality: "Foo",
        parentName: "Test",
        birthDate: new Date(1990, 1, 1).toISOString(),
        addressId: addressIds[Math.floor(Math.random() * addressIds.length)],
        workStatusId:
          workStatusIds[Math.floor(Math.random() * workStatusIds.length)],
      });
    });
  }

  await generateUsers(addressIds, workStatusIds);
};

main()
  .then(() => (console.log("Seed completed"), process.exit(0)))
  .catch(console.error);

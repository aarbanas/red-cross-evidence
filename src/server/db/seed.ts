import { hash } from "bcrypt";
import { env } from "~/env";
import { db } from "../db/index";
import { eq } from "drizzle-orm";
import {
  EducationLevel,
  License,
  licenses,
  profiles,
  users,
} from "../db/schema";

const DrivingLicense = {
  AM: "AM",
  A1: "A1",
  A2: "A2",
  A: "A",
  B: "B",
  BE: "BE",
  C1: "C1",
  C1E: "C1E",
  C: "C",
  CE: "CE",
  D1: "D1",
  D1E: "D1E",
  D: "D",
  DE: "DE",
  F: "F",
  G: "G",
  H: "H",
};

const SALT_OR_ROUNDS = 10;

const populateLicenses = async () => {
  const _licenses = Object.values(DrivingLicense).map((type) => ({
    type: License.DRIVING,
    name: type,
    description: "",
  }));

  await db.insert(licenses).values(_licenses).returning();
};

const generateUsers = async () => {
  const cities = ["Rijeka", "Zagreb", "Split", "Osijek", "Dubrovnik"];

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

        await tx.insert(profiles).values({
          userId: user?.id,
          firstName: `Test ${i + 1}`,
          lastName: `User ${i + 1}`,
          phone: "123456789",
          address: "Test address 1",
          city: cities[Math.floor(Math.random() * cities.length)],
          country: "Croatia",
          education:
            Object.values(EducationLevel)[
              Math.floor(Math.random() * Object.values(EducationLevel).length)
            ],
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
        phone: "123456789",
        address: "Test address 1",
        city: "Zagreb",
        country: "Croatia",
        education: EducationLevel.BACHELOR,
      });
    });
  }

  await generateUsers();
};

main()
  .then(() => (console.log("Seed completed"), process.exit(0)))
  .catch(console.error);

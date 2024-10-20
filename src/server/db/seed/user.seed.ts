import { type PgTransaction } from "drizzle-orm/pg-core";

import { eq } from "drizzle-orm";
import { hash } from "bcrypt";
import { db } from "..";
import {
  ClothingSize,
  EducationLevel,
  LanguageLevel,
  profiles,
  profilesAddresses,
  profileSkills,
  profilesLanguages,
  profilesLicences,
  Sex,
  sizes,
  users,
  workStatuses,
} from "../schema";
const names = ["John", "Jane", "Alice", "Bob", "Charlie", "Diana"];
const surnames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia"];
export const getRandomLanguages = (
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
export const insertWorkStatus = async (
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
export const generateProfileSkills = (
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
export const SALT_OR_ROUNDS = 10;
export const generateUsers = async (
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

export async function generateAdmin(
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

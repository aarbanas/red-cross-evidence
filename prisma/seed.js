import { env } from "../src/env.js";
import * as bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  const saltOrRounds = 10;
  const adminPassword = await bcrypt.hash(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    env.ADMIN_PASSWORD,
    saltOrRounds,
  );
  const email = "admin@dck-pgz.hr";

  // Delete admin if exists
  await prisma.user.delete({
    where: {
      email,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email,
      active: true,
      password: adminPassword,
    },
  });

  await prisma.profile.create({
    data: {
      userId: adminUser.id,
      firstName: "Admin",
      lastName: "Admin",
    },
  });
};

main()
  .then(async () => {
    console.log("Seed complete");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

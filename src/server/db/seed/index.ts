import { getEducations } from "./education.seed";
import { getLicenses } from "./license.seed";
import { getAdmin, getUsers } from "./user.seed";
import { getEducationTerms } from "~/server/db/seed/educationTerm.seed";

void (async () => {
  await getLicenses();
  console.log("Done seeding licenses.");
  await getUsers();
  console.log("Done seeding users.");
  await getAdmin();
  console.log("Done seeding admin.");
  await getEducations();
  console.log("Done seeding educations.");
  await getEducationTerms();
  console.log("Done seeding education terms.");

  process.exit(0);
})();

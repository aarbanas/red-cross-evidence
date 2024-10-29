import { getEducations } from "./education.seed";
import { getLicenses } from "./license.seed";
import { getAdmin, getUsers } from "./user.seed";

void (async () => {
  await getLicenses();
  console.log("Done seeding licenses.");
  await getUsers();
  console.log("Done seeding users.");
  await getAdmin();
  console.log("Done seeding admin.");
  await getEducations();
  console.log("Done seeding educations.");

  process.exit(0);
})();

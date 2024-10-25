import { getEducations } from "./education.seed";
import { getLicenses } from "./license.seed";
import { getAdmin, getUsers } from "./user.seed";

void (async () => {
  await getLicenses();
  await getUsers();
  await getAdmin();
  await getEducations();

  process.exit(0);
})();

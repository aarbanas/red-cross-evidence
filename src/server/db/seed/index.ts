import { getEducations } from "./education.seed";
import { getLicenses } from "./license.seed";
import { getAdmins, getUsers } from "./user.seed";

void (async () => {
  await getLicenses();
  await getUsers();
  await getAdmins();
  await getEducations();
})();

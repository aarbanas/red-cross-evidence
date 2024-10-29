import { fileURLToPath } from "url";
import { DrivingLicense, License, licenses } from "../schema";
import { db } from "../index";

export const populateLicenses = async () => {
  const _licenses = Object.values(DrivingLicense).map((type) => ({
    type: License.DRIVING,
    name: type,
    description: "",
  }));

  return db.insert(licenses).values(_licenses).returning();
};

export const getLicenses = async () => {
  let _licences = await db.query.licenses.findMany();
  if (!_licences.length) {
    _licences = await populateLicenses();
  }
  return _licences;
};

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  getLicenses()
    .then((licenses) => {
      console.log("Done seeding licenses.");
      process.exit(0);
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
}

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

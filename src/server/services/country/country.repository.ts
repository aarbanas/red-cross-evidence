import { db } from "~/server/db";
import { countries } from "~/server/db/schema";

const countryRepository = {
  getAllCountries: async () => {
    return db.select().from(countries).execute();
  },
};

export default countryRepository;

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import countryService from '~/server/services/country/country.service';

export const countryRouter = createTRPCRouter({
  getAllCountries: protectedProcedure.query(async () => {
    return countryService.getAllCountries();
  }),
});

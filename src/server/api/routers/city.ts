import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import cityService from "~/server/services/city/city.service";

export const cityRouter = createTRPCRouter({
  findUniqueCityNames: protectedProcedure.query(async () => {
    return cityService.findUniqueCityNames();
  }),
  searchCities: protectedProcedure
    .input(
      z.object({ searchTerm: z.string().min(1), countryId: z.string().min(1) }),
    )
    .query(async ({ input }) => {
      const { searchTerm, countryId } = input;
      return cityService.searchCities(searchTerm, countryId);
    }),
});

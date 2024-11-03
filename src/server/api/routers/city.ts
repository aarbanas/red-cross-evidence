import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import cityService from "~/server/services/city/city.service";

export const cityRouter = createTRPCRouter({
  findUniqueCityNames: protectedProcedure.query(async () => {
    return cityService.findUniqueCityNames();
  }),
});

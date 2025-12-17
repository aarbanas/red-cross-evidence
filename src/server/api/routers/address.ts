import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import addressService from "~/server/services/address/address.service";

export const addressRouter = createTRPCRouter({
  searchAddresses: protectedProcedure
    .input(
      z.object({
        searchTerm: z.string(),
        cityId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return addressService.searchAddresses(input);
    }),
});

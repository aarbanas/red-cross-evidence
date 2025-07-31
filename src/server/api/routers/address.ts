import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import addressService from "~/server/services/address/address.service";

export const addressRouter = createTRPCRouter({
  search: protectedProcedure
    .input(
      z.object({
        street: z.string(),
        includeCity: z.boolean().optional(),
      }),
    )
    .query(async ({ input }) => {
      return addressService.search(input);
    }),
});

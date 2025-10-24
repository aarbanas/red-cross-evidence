import { type createUserSchema } from "~/server/api/schema";
import { type z } from "zod";

export type CreateUserDTO = z.infer<typeof createUserSchema>;

type CreateUserAddressesDTO = z.infer<typeof createUserSchema>["addresses"];

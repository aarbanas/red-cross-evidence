import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { licenseRouter } from "./routers/license";
import { cityRouter } from "./routers/city";
import { educationRouter } from "~/server/api/routers/educations";
import { countryRouter } from "~/server/api/routers/country";
import { skillRouter } from "~/server/api/routers/skill";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  license: licenseRouter,
  city: cityRouter,
  education: educationRouter,
  country: countryRouter,
  skill: skillRouter,
  // address: addressRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

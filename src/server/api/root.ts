import { countryRouter } from '~/server/api/routers/country';
import { educationRouter } from '~/server/api/routers/educations';
import { postRouter } from '~/server/api/routers/post';
import { skillRouter } from '~/server/api/routers/skill';
import { userRouter } from '~/server/api/routers/user';
import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { addressRouter } from './routers/address';
import { cityRouter } from './routers/city';
import { licenseRouter } from './routers/license';

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
  address: addressRouter,
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

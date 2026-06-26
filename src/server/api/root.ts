import { countryRouter } from '@/server/api/routers/country';
import { educationRouter } from '@/server/api/routers/educations';
import { equipmentRouter } from '@/server/api/routers/equipment';
import { postRouter } from '@/server/api/routers/post';
import { searchRouter } from '@/server/api/routers/search';
import { skillRouter } from '@/server/api/routers/skill';
import { userRouter } from '@/server/api/routers/user';
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { addressRouter } from './routers/address';
import { cityRouter } from './routers/city';
import { citySocietyRouter } from './routers/citySociety';
import { configRouter } from './routers/config';
import { licenseRouter } from './routers/license';
import { societyRouter } from './routers/society';

export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  license: licenseRouter,
  equipment: equipmentRouter,
  city: cityRouter,
  education: educationRouter,
  country: countryRouter,
  skill: skillRouter,
  address: addressRouter,
  society: societyRouter,
  citySociety: citySocietyRouter,
  search: searchRouter,
  config: configRouter,
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

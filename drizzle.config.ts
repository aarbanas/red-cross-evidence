import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  out: "./drizzle",
  schema: "./src/server/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config;

import { type profiles } from "~/server/db/schema";

export type FindUserQuery = {
  page?: number;
  limit?: number;
  sort?: string | string[];
  filter?: Record<string, string>;
};

export type NewProfile = typeof profiles.$inferInsert;

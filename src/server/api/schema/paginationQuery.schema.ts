import { z } from "zod";

const MAX_PAGE_SIZE = 50;
const MIN_PAGE_SIZE = 1;

const paginationQuerySchema = z.object({
  page: z.coerce.number(),
  limit: z.coerce.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE),
  sort: z.string().or(z.array(z.string())).optional(),
  filter: z.record(z.string(), z.string()).optional(),
});

export default paginationQuerySchema;

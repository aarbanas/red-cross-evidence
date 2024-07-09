export type FindUserQuery = {
  page?: number;
  limit?: number;
  sort?: string | string[];
  filter?: Record<string, string>;
};

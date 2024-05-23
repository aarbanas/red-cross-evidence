export type FindUserQuery = {
  page?: string;
  limit?: string;
  sort?: string;
  dir?: string;
  filter?: object;
};

export type UserAttribute = Record<
  string,
  { startsWith: string; mode: string }
>;

type UserAttributesFilter = {
  profile?: Record<string, { startsWith: string; mode: string }>;
};

export type UserFilter = UserAttribute & UserAttributesFilter;

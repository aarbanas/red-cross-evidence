export type FindQueryDTO = {
  page?: number;
  limit?: number;
  sort?: string | string[];
  filter?: Record<string, string>;
};

export type FindReturnDTO<T> = {
  totalCount: number;
  returnData: T[];
};

export type FindReturn<T> = {
  data: T[];
  meta: {
    count: number;
    limit: number;
  };
};

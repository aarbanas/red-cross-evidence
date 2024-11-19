import { and, asc, desc, type SQL } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { type PgColumn } from "drizzle-orm/pg-core";

export const prepareOrderBy = (
  mapKeyToColumn: (key: string | undefined) => PgColumn,
  sortableKeys: Record<string, string>,
  defaultColumn: PgColumn,
  sort?: string | string[],
): SQL[] => {
  if (!sort) {
    return [asc(defaultColumn)];
  }

  if (typeof sort === "string") {
    const [key, value] = sort.split(":");

    return [
      generateSortFunction(
        { sortableKeys, key, value },
        defaultColumn,
        mapKeyToColumn,
      ),
    ];
  }

  const sorts = [];
  for (const _sort of sort) {
    const [key, value] = _sort.split(":");
    const sortValue = generateSortFunction(
      { sortableKeys, key, value },
      defaultColumn,
      mapKeyToColumn,
    );
    if (sortValue) {
      sorts.push(sortValue);
    }
  }

  return sorts;
};

const generateSortFunction = (
  data: {
    sortableKeys: Record<string, string>;
    key?: string;
    value?: string;
  },
  defaultColumn: PgColumn,
  mapKeyToColumn: (key: string | undefined) => PgColumn,
): SQL => {
  const { sortableKeys, key, value } = data;
  if (
    value &&
    Object.values(sortableKeys).findIndex(
      (sortableKey) => sortableKey === key,
    ) > -1
  ) {
    if (!["asc", "desc"].includes(value)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid sort direction",
      });
    }

    return value === "asc"
      ? asc(mapKeyToColumn(key))
      : desc(mapKeyToColumn(key));
  }

  // If there is no 'value' or key is not a member of SortableKeys
  return asc(defaultColumn);
};

export const prepareWhere = (
  filter: Record<string, string> | undefined,
  filterableKeys: Record<string, string>,
  mapFilterableKeyToConditional: (
    key: string,
    value: string,
  ) => SQL | undefined,
): SQL | undefined => {
  if (!filter) return undefined;

  if (Object.keys(filter).length === 1) {
    const [key, value] = Object.entries(filter)[0] ?? ["", ""];
    if (!Object.values(filterableKeys).includes(key)) {
      return undefined;
    }

    return mapFilterableKeyToConditional(key, value);
  }

  const conditionals = [];
  for (const [key, value] of Object.entries(filter)) {
    if (!Object.values(filterableKeys).includes(key)) {
      continue;
    }

    conditionals.push(mapFilterableKeyToConditional(key, value));
  }

  return and(...conditionals);
};

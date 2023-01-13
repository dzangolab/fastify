import { sql } from "slonik";

import { applyFiltersToQuery } from "./dbFilters";
import { FilterInput, SortInput } from "./types";

const createLimitFragment = (limit: number, offset?: number) => {
  let fragment = sql`LIMIT ${limit}`;

  if (offset) {
    fragment = sql`LIMIT ${limit} OFFSET ${offset}`;
  }

  return fragment;
};

const createTableFragment = (table: string) => {
  return sql`${sql.identifier([table])}`;
};

const createWhereIdFragment = (id: number | string) => {
  return sql`WHERE id = ${id}`;
};

const createFilterFragment = (
  filters: FilterInput | undefined,
  tableName: string
) => {
  if (filters) {
    return applyFiltersToQuery(filters, tableName);
  }

  return sql``;
};

const createSortFragment = (tableName: string, sort?: SortInput[]) => {
  if (sort && sort.length > 0) {
    const arraySort = [];

    for (const data of sort) {
      const direction = data.direction === "ASC" ? sql`ASC` : sql`DESC`;

      arraySort.push(
        sql`${sql.identifier([tableName, data.key])} ${direction}`
      );
    }

    return sql`ORDER BY ${sql.join(arraySort, sql`,`)}`;
  }

  return sql`ORDER BY id ASC`;
};

export {
  createFilterFragment,
  createLimitFragment,
  createSortFragment,
  createTableFragment,
  createWhereIdFragment,
};

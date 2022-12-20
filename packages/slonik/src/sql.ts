import { sql } from "slonik";

import { FilterType, applyFilter } from "./dbFilters";

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
  filter: FilterType | undefined,
  tableName: string
) => {
  if (filter) {
    return applyFilter(filter, tableName);
  }

  return ``;
};

export {
  createLimitFragment,
  createTableFragment,
  createWhereIdFragment,
  createFilterFragment,
};

import { sql } from "slonik";

import { Filter, applyFiltersToQuery } from "./dbFilters";

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
  filter: Filter | undefined,
  tableName: string
) => {
  if (filter) {
    const filterQuery = applyFiltersToQuery(filter, tableName);
    console.log(filterQuery);
    return filterQuery;
  }

  return sql``;
};

export {
  createLimitFragment,
  createTableFragment,
  createWhereIdFragment,
  createFilterFragment,
};

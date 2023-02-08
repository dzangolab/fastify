import { sql } from "slonik";

import { applyFiltersToQuery } from "./dbFilters";

import type { FilterInput, SortInput } from "./types";
import type { IdentifierSqlToken } from "slonik";

const createFilterFragment = (
  filters: FilterInput | undefined,
  tableIdentifier: IdentifierSqlToken
) => {
  if (filters) {
    return applyFiltersToQuery(filters, tableIdentifier);
  }

  return sql``;
};

const createLimitFragment = (limit: number, offset?: number) => {
  let fragment = sql`LIMIT ${limit}`;

  if (offset) {
    fragment = sql`LIMIT ${limit} OFFSET ${offset}`;
  }

  return fragment;
};

const createSortFragment = (
  tableIdentifier: IdentifierSqlToken,
  sort?: SortInput[]
) => {
  if (sort && sort.length > 0) {
    const arraySort = [];

    for (const data of sort) {
      const direction = data.direction === "ASC" ? sql`ASC` : sql`DESC`;

      arraySort.push(
        sql`${sql.identifier([
          ...tableIdentifier.names,
          data.key,
        ])} ${direction}`
      );
    }

    return sql`ORDER BY ${sql.join(arraySort, sql`,`)}`;
  }

  return sql`ORDER BY id ASC`;
};

const createTableFragment = (table: string, schema?: string) => {
  return sql`${createTableIdentifier(table, schema)}`;
};

const createTableIdentifier = (table: string, schema?: string) => {
  return sql.identifier(schema ? [schema, table] : [table]);
};

const createWhereIdFragment = (id: number | string) => {
  return sql`WHERE id = ${id}`;
};

export {
  createFilterFragment,
  createLimitFragment,
  createSortFragment,
  createTableFragment,
  createTableIdentifier,
  createWhereIdFragment,
};

import humps from "humps";
import { sql } from "slonik";

import { applyFiltersToQuery } from "./dbFilters";

import type { FilterInput, SortInput } from "./types";
import type { IdentifierSqlToken } from "slonik";

const createFilterFragment = (
  filters: FilterInput | undefined,
  tableIdentifier: IdentifierSqlToken,
) => {
  if (filters) {
    return applyFiltersToQuery(filters, tableIdentifier);
  }

  return sql.fragment``;
};

const createLimitFragment = (limit: number, offset?: number) => {
  let fragment = sql.fragment`LIMIT ${limit}`;

  if (offset) {
    fragment = sql.fragment`LIMIT ${limit} OFFSET ${offset}`;
  }

  return fragment;
};

const createSortFragment = (
  tableIdentifier: IdentifierSqlToken,
  sort?: SortInput[],
) => {
  if (sort && sort.length > 0) {
    const arraySort = [];

    for (const data of sort) {
      const direction =
        data.direction === "ASC" ? sql.fragment`ASC` : sql.fragment`DESC`;

      arraySort.push(
        sql.fragment`${sql.identifier([
          ...tableIdentifier.names,
          humps.decamelize(data.key),
        ])} ${direction}`,
      );
    }

    return sql.fragment`ORDER BY ${sql.join(arraySort, sql.fragment`,`)}`;
  }

  return sql.fragment``;
};

const createTableFragment = (table: string, schema?: string) => {
  return sql.fragment`${createTableIdentifier(table, schema)}`;
};

const createTableIdentifier = (table: string, schema?: string) => {
  return sql.identifier(schema ? [schema, table] : [table]);
};

const createWhereIdFragment = (id: number | string) => {
  return sql.fragment`WHERE id = ${id}`;
};

export {
  createFilterFragment,
  createLimitFragment,
  createSortFragment,
  createTableFragment,
  createTableIdentifier,
  createWhereIdFragment,
};

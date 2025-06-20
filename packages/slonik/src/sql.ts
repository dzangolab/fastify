import humps from "humps";
import { sql } from "slonik";

import { applyFiltersToQuery } from "./dbFilters";

import type { FilterInput, SortInput } from "./types";
import type {
  FragmentSqlToken,
  IdentifierSqlToken,
  ValueExpression,
} from "slonik";

const createFilterFragment = (
  filters: FilterInput | undefined,
  tableIdentifier: IdentifierSqlToken,
): FragmentSqlToken => {
  if (filters) {
    return applyFiltersToQuery(filters, tableIdentifier);
  }

  return sql.fragment``;
};

const createLimitFragment = (
  limit: number,
  offset?: number,
): FragmentSqlToken => {
  let fragment = sql.fragment`LIMIT ${limit}`;

  if (offset) {
    fragment = sql.fragment`LIMIT ${limit} OFFSET ${offset}`;
  }

  return fragment;
};

const createSortFragment = (
  tableIdentifier: IdentifierSqlToken,
  sort?: SortInput[],
): FragmentSqlToken => {
  if (sort && sort.length > 0) {
    const sortArray = [];

    for (const data of sort) {
      const keyParts = data.key.split(".").map((key) => humps.decamelize(key));

      const fieldIdentifier =
        keyParts.length > 1
          ? sql.identifier([...keyParts])
          : sql.identifier([...tableIdentifier.names, ...keyParts]);

      const direction =
        data.direction === "ASC" ? sql.fragment`ASC` : sql.fragment`DESC`;

      sortArray.push(sql.fragment`${fieldIdentifier} ${direction}`);
    }

    return sql.fragment`ORDER BY ${sql.join(sortArray, sql.fragment`,`)}`;
  }

  return sql.fragment``;
};

const createTableFragment = (
  table: string,
  schema?: string,
): FragmentSqlToken => {
  return sql.fragment`${createTableIdentifier(table, schema)}`;
};

const createTableIdentifier = (table: string, schema?: string) => {
  return sql.identifier(schema ? [schema, table] : [table]);
};

const createWhereIdFragment = (id: number | string): FragmentSqlToken => {
  return sql.fragment`WHERE id = ${id}`;
};

const isValueExpression = (value: unknown): value is ValueExpression => {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value instanceof Date ||
    Buffer.isBuffer(value)
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every((item) => isValueExpression(item));
  }

  return false;
};

export {
  createFilterFragment,
  createLimitFragment,
  createSortFragment,
  createTableFragment,
  createTableIdentifier,
  createWhereIdFragment,
  isValueExpression,
};

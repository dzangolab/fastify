import { sql } from "slonik";

import { FilterInput } from "./types";

import type { IdentifierSqlToken, QueryResultRow, SqlSqlToken } from "slonik";

const applyFilter = (
  filter: FilterInput,
  tableIdentifier: IdentifierSqlToken
) => {
  const key = filter.key;
  const operator = filter.operator || "eq";
  const not = filter.not || false;
  let value: SqlSqlToken<QueryResultRow> | string = filter.value;

  const databaseField = sql.identifier([...tableIdentifier.names, key]);
  let clauseOperator;

  switch (operator) {
    case "ct":
    case "sw":
    case "ew": {
      const valueString = {
        ct: `%${value}%`, // contains
        ew: `%${value}`, // ends with
        sw: `${value}%`, // starts with
      };

      value = valueString[operator];
      clauseOperator = not ? sql`NOT ILIKE` : sql`ILIKE`;
      break;
    }
    case "eq":
    default: {
      clauseOperator = not ? sql`!=` : sql`=`;
      break;
    }
    case "gt": {
      clauseOperator = not ? sql`<` : sql`>`;
      break;
    }
    case "gte": {
      clauseOperator = not ? sql`<` : sql`>=`;
      break;
    }
    case "lte": {
      clauseOperator = not ? sql`>` : sql`<=`;
      break;
    }
    case "lt": {
      clauseOperator = not ? sql`>` : sql`<`;
      break;
    }
    case "in": {
      clauseOperator = not ? sql`NOT IN` : sql`IN`;
      value = sql`(${sql.join(value.split(","), sql`, `)})`;
      break;
    }
    case "bt": {
      clauseOperator = not ? sql`NOT BETWEEN` : sql`BETWEEN`;
      value = sql`${sql.join(value.split(","), sql` AND `)}`;
      break;
    }
  }

  return sql`${databaseField} ${clauseOperator} ${value}`;
};

const applyFiltersToQuery = (
  filters: FilterInput,
  tableIdentifier: IdentifierSqlToken,
  not = false
) => {
  const andFilter: SqlSqlToken<QueryResultRow>[] = [];
  const orFilter: SqlSqlToken<QueryResultRow>[] = [];
  let queryFilter;

  const applyFilters = (
    filters: FilterInput,
    tableIdentifier: IdentifierSqlToken,
    not = false
  ) => {
    if (filters.AND) {
      for (const filterData of filters.AND) {
        applyFilters(filterData, tableIdentifier);
      }
    } else if (filters.OR) {
      for (const filterData of filters.OR) {
        applyFilters(filterData, tableIdentifier, true);
      }
    } else {
      const query = applyFilter(filters, tableIdentifier);

      if (not) {
        orFilter.push(query);
      } else {
        andFilter.push(query);
      }
    }
  };

  applyFilters(filters, tableIdentifier, not);

  if (andFilter.length > 0 && orFilter.length > 0) {
    queryFilter = sql.join(
      [
        sql`(${sql.join(andFilter, sql` AND `)})`,
        sql`(${sql.join(orFilter, sql` OR `)})`,
      ],
      sql`${filters.AND ? sql` AND ` : sql` OR `}`
    );
  } else if (andFilter.length > 0) {
    queryFilter = sql.join(andFilter, sql` AND `);
  } else if (orFilter.length > 0) {
    queryFilter = sql.join(orFilter, sql` OR `);
  }

  return queryFilter ? sql`WHERE ${queryFilter}` : sql``;
};

export { applyFiltersToQuery };

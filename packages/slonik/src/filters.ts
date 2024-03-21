import humps from "humps";
import { sql } from "slonik";

import type { BaseFilterInput, FilterInput } from "./types";
import type { IdentifierSqlToken, FragmentSqlToken } from "slonik";

const applyFilter = (
  tableIdentifier: IdentifierSqlToken,
  filter: BaseFilterInput
) => {
  const key = humps.decamelize(filter.key);
  const operator = filter.operator || "eq";
  const not = filter.not || false;
  let value: FragmentSqlToken | string = filter.value;

  const databaseField = sql.identifier([...tableIdentifier.names, key]);
  let clauseOperator;

  if (operator === "eq" && ["null", "NULL"].includes(value)) {
    clauseOperator = not ? sql.fragment`IS NOT NULL` : sql.fragment`IS NULL`;

    return sql.fragment`${databaseField} ${clauseOperator}`;
  }

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
      clauseOperator = not ? sql.fragment`NOT ILIKE` : sql.fragment`ILIKE`;
      break;
    }
    case "eq":
    default: {
      clauseOperator = not ? sql.fragment`!=` : sql.fragment`=`;
      break;
    }
    case "gt": {
      clauseOperator = not ? sql.fragment`<` : sql.fragment`>`;
      break;
    }
    case "gte": {
      clauseOperator = not ? sql.fragment`<` : sql.fragment`>=`;
      break;
    }
    case "lte": {
      clauseOperator = not ? sql.fragment`>` : sql.fragment`<=`;
      break;
    }
    case "lt": {
      clauseOperator = not ? sql.fragment`>` : sql.fragment`<`;
      break;
    }
    case "in": {
      clauseOperator = not ? sql.fragment`NOT IN` : sql.fragment`IN`;
      value = sql.fragment`(${sql.join(value.split(","), sql.fragment`, `)})`;
      break;
    }
    case "bt": {
      clauseOperator = not ? sql.fragment`NOT BETWEEN` : sql.fragment`BETWEEN`;
      value = sql.fragment`${sql.join(value.split(","), sql.fragment` AND `)}`;
      break;
    }
  }

  return sql.fragment`${databaseField} ${clauseOperator} ${value}`;
};

const createFilterFragment = (
  tableIdentifier: IdentifierSqlToken,
  filters: FilterInput,
  not = false
) => {
  const andFilter: FragmentSqlToken[] = [];
  const orFilter: FragmentSqlToken[] = [];
  let queryFilter;

  const applyFilters = (
    tableIdentifier: IdentifierSqlToken,
    filters: FilterInput,
    not = false
  ) => {
    if ("AND" in filters) {
      for (const filterData of filters.AND) {
        applyFilters(tableIdentifier, filterData);
      }
    } else if ("OR" in filters) {
      for (const filterData of filters.OR) {
        applyFilters(tableIdentifier, filterData, true);
      }
    } else {
      const query = applyFilter(tableIdentifier, filters);

      if (not) {
        orFilter.push(query);
      } else {
        andFilter.push(query);
      }
    }
  };

  applyFilters(tableIdentifier, filters, not);

  if (andFilter.length > 0 && orFilter.length > 0) {
    queryFilter = sql.join(
      [
        sql.fragment`(${sql.join(andFilter, sql.fragment` AND `)})`,
        sql.fragment`(${sql.join(orFilter, sql.fragment` OR `)})`,
      ],
      sql.fragment`${
        "AND" in filters ? sql.fragment` AND ` : sql.fragment` OR `
      }`
    );
  } else if (andFilter.length > 0) {
    queryFilter = sql.join(andFilter, sql.fragment` AND `);
  } else if (orFilter.length > 0) {
    queryFilter = sql.join(orFilter, sql.fragment` OR `);
  }

  return queryFilter ? sql.fragment`WHERE ${queryFilter}` : sql.fragment``;
};

export { applyFilter, createFilterFragment };

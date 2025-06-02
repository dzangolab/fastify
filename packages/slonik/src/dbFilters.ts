import humps from "humps";
import { sql } from "slonik";

import type { BaseFilterInput, FilterInput } from "./types";
import type { IdentifierSqlToken, FragmentSqlToken } from "slonik";

const applyFilter = (
  tableIdentifier: IdentifierSqlToken,
  filter: BaseFilterInput,
): FragmentSqlToken => {
  const key = humps.decamelize(filter.key);
  const operator = filter.operator || "eq";
  const not = filter.not || false;
  const insensitive: boolean =
    filter.insensitive === true ||
    filter.insensitive === "true" ||
    filter.insensitive === "1";

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

      if (insensitive) {
        value = sql.fragment`unaccent(lower(${value}))`;
      }

      break;
    }
    case "eq":
    default: {
      clauseOperator = not ? sql.fragment`!=` : sql.fragment`=`;

      if (insensitive) {
        value = sql.fragment`unaccent(lower(${value}))`;
      }

      break;
    }
    case "gt": {
      clauseOperator = not ? sql.fragment`<` : sql.fragment`>`;

      if (insensitive) {
        value = sql.fragment`unaccent(lower(${value}))`;
      }

      break;
    }
    case "gte": {
      clauseOperator = not ? sql.fragment`<` : sql.fragment`>=`;

      if (insensitive) {
        value = sql.fragment`unaccent(lower(${value}))`;
      }

      break;
    }
    case "lte": {
      clauseOperator = not ? sql.fragment`>` : sql.fragment`<=`;

      if (insensitive) {
        value = sql.fragment`unaccent(lower(${value}))`;
      }

      break;
    }
    case "lt": {
      clauseOperator = not ? sql.fragment`>` : sql.fragment`<`;

      if (insensitive) {
        value = sql.fragment`unaccent(lower(${value}))`;
      }

      break;
    }
    case "in": {
      const values = value.split(",").filter(Boolean);

      if (values.length === 0) {
        throw new Error("IN operator requires at least one value");
      }

      clauseOperator = not ? sql.fragment`NOT IN` : sql.fragment`IN`;

      value = insensitive
        ? sql.fragment`(${sql.join(
            values.map((item) => sql.fragment`unaccent(lower(${item}))`),
            sql.fragment`, `,
          )})`
        : sql.fragment`(${sql.join(values, sql.fragment`, `)})`;

      break;
    }
    case "bt": {
      const [start, end] = value.split(",");

      if (!start || !end) {
        throw new Error("BETWEEN operator requires exactly two values");
      }

      clauseOperator = not ? sql.fragment`NOT BETWEEN` : sql.fragment`BETWEEN`;

      value = insensitive
        ? sql.fragment`unaccent(lower(${start})) AND unaccent(lower(${end}))`
        : sql.fragment`${start} AND ${end}`;

      break;
    }
  }

  return insensitive
    ? sql.fragment`unaccent(lower(${databaseField})) ${clauseOperator} ${value}`
    : sql.fragment`${databaseField} ${clauseOperator} ${value}`;
};

const applyFiltersToQuery = (
  filters: FilterInput,
  tableIdentifier: IdentifierSqlToken,
  not = false,
): FragmentSqlToken => {
  const andFilter: FragmentSqlToken[] = [];
  const orFilter: FragmentSqlToken[] = [];
  let queryFilter;

  const applyFilters = (
    filters: FilterInput,
    tableIdentifier: IdentifierSqlToken,
    not = false,
  ) => {
    if ("AND" in filters) {
      for (const filterData of filters.AND) {
        applyFilters(filterData, tableIdentifier);
      }
    } else if ("OR" in filters) {
      for (const filterData of filters.OR) {
        applyFilters(filterData, tableIdentifier, true);
      }
    } else {
      const query = applyFilter(tableIdentifier, filters as BaseFilterInput);

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
        sql.fragment`(${sql.join(andFilter, sql.fragment` AND `)})`,
        sql.fragment`(${sql.join(orFilter, sql.fragment` OR `)})`,
      ],
      sql.fragment`${
        "AND" in filters ? sql.fragment` AND ` : sql.fragment` OR `
      }`,
    );
  } else if (andFilter.length > 0) {
    queryFilter = sql.join(andFilter, sql.fragment` AND `);
  } else if (orFilter.length > 0) {
    queryFilter = sql.join(orFilter, sql.fragment` OR `);
  }

  return queryFilter ? sql.fragment`WHERE ${queryFilter}` : sql.fragment``;
};

export { applyFilter, applyFiltersToQuery };

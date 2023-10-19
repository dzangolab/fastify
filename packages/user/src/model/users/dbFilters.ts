import humps from "humps";
import { sql } from "slonik";

import type { FilterInput } from "@dzangolab/fastify-slonik";
import type { IdentifierSqlToken, FragmentSqlToken } from "slonik";

const applyFilter = (
  filter: FilterInput,
  tableIdentifier: IdentifierSqlToken
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

const applyFiltersToQuery = (
  filters: FilterInput,
  tableIdentifier: IdentifierSqlToken,
  not = false
) => {
  const andFilter: FragmentSqlToken[] = [];
  const orFilter: FragmentSqlToken[] = [];
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
      const query =
        humps.decamelize(filters.key) === "roles"
          ? applyRolesFilter(filters, tableIdentifier)
          : applyFilter(filters, tableIdentifier);

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
      sql.fragment`${filters.AND ? sql.fragment` AND ` : sql.fragment` OR `}`
    );
  } else if (andFilter.length > 0) {
    queryFilter = sql.join(andFilter, sql.fragment` AND `);
  } else if (orFilter.length > 0) {
    queryFilter = sql.join(orFilter, sql.fragment` OR `);
  }

  return queryFilter ? sql.fragment`WHERE ${queryFilter}` : sql.fragment``;
};

const applyRolesFilter = (
  filter: FilterInput,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tableIdentifier: IdentifierSqlToken
) => {
  const { operator, value } = filter;
  const not = filter.not || false;

  const notFragment = not ? sql.fragment`NOT` : sql.fragment``;

  switch (operator) {
    case "eq": {
      const valueFragment = value.split(",").sort();

      return sql.fragment`${notFragment}
        (
          SELECT jsonb_agg(value ORDER BY value) AS sorted_array
          FROM jsonb_array_elements_text(user_role.role)
        ) = ${sql.jsonb(valueFragment)}`;
    }

    case "in": {
      const valueFragment = sql.fragment`(${sql.join(
        value.split(","),
        sql.fragment`, `
      )})`;

      return sql.fragment`${notFragment} EXISTS
        (
          SELECT roles
          FROM jsonb_array_elements_text(user_role.role) as roles
          WHERE roles IN ${valueFragment}
        )`;
    }
  }

  return sql.fragment`TRUE`;
};

export { applyFiltersToQuery };

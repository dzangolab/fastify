import { sql } from "slonik";

interface FilterType {
  key: string;
  operator: string;
  not: boolean;
  value: string;
}

export interface Filter extends FilterType {
  AND: FilterType[];
  OR: FilterType[];
}

const applyFilter = (filter: FilterType, tableName: string) => {
  const key = filter.key;
  const operator = filter.operator || "eq";
  const not = filter.not || false;
  let value = filter.value;

  const databaseField = sql.identifier([tableName, key]);
  let clauseOperator;

  switch (operator) {
    case "ct": {
      value = `%${value}%`;
      clauseOperator = not ? sql`NOT ILIKE` : sql`ILIKE`;
      break;
    }
    case "sw": {
      value = `${value}%`;
      clauseOperator = not ? sql`NOT ILIKE` : sql`ILIKE`;
      break;
    }
    case "ew": {
      value = `%${value}`;
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
  }

  return sql`${databaseField} ${clauseOperator} ${value}`;
};

const applyFiltersToQuery = (filter: Filter, tableName: string) => {
  let filterQuery;

  if ("AND" in filter || "OR" in filter) {
    if ("AND" in filter) {
      const filterAND = filter.AND;
      const andFilter = [];

      for (const data of filterAND) {
        const ft = applyFilter(data, tableName);
        andFilter.push(ft);
      }

      filterQuery = sql.join(andFilter, sql` AND `);
    }

    if ("OR" in filter) {
      const filterOR = filter.OR;
      const orFilter = [];

      for (const data of filterOR) {
        const ft = applyFilter(data, tableName);
        orFilter.push(ft);
      }

      filterQuery = sql.join(orFilter, sql` OR `);
    }

    return filterQuery ? sql`WHERE ${filterQuery}` : sql``;
  }

  const query = applyFilter(filter, tableName);

  return sql`WHERE ${query}`;
};

export { applyFiltersToQuery };

import { sql } from "slonik";

export interface Filter {
  AND: Filter[];
  OR: Filter[];
  key: string;
  operator: string;
  not: boolean;
  value: string;
}

const applyFilter = (filter: Filter, tableName: string) => {
  const key = filter.key;
  const operator = filter.operator || "eq";
  const not = filter.not || false;
  let value = filter.value;

  const databaseField = sql.identifier([tableName, key]);
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
  }

  return sql`${databaseField} ${clauseOperator} ${value}`;
};

const applyFiltersToQuery = (
  filter: Filter,
  tableName: string,
  not = false
) => {
  const andFilter: any = [];
  const orFilter: any = [];
  let isJoin = true;
  function applyFilters(filter: Filter, tableName: string, not = false) {
    if (filter.AND) {
      for (const filterData of filter.AND) applyFilters(filterData, tableName);
    } else if (filter.OR) {
      for (const filterData of filter.OR)
        applyFilters(filterData, tableName, true);
    } else {
      const query = applyFilter(filter, tableName);

      if (not) {
        orFilter.push(query);
      } else {
        andFilter.push(query);
      }

      isJoin = not;
    }
  }

  applyFilters(filter, tableName, not);

  let queryFilter;
  if (andFilter.length > 0 && orFilter.length > 0) {
    queryFilter = sql.join(
      [
        sql`(${sql.join(andFilter, sql` AND `)})`,
        sql`(${sql.join(orFilter, sql` OR `)})`,
      ],
      sql`${isJoin ? sql` AND ` : sql` OR `}`
    );
  } else if (andFilter.length > 0) {
    queryFilter = sql.join(andFilter, sql` AND `);
  } else if (orFilter.length > 0) {
    queryFilter = sql.join(orFilter, sql` OR `);
  }

  return queryFilter ? sql`WHERE ${queryFilter}` : sql``;
};

export { applyFiltersToQuery };

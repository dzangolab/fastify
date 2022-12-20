import { sql } from "slonik";

export interface FilterType {
  key: string;
  operator: string;
  not: boolean;
  value: string;
}

const applyFilter = (filter: FilterType, tableName: string) => {
  const key = filter.key;
  const operator = filter.operator || "eq";
  const not = filter.not || false;
  const value = filter.value;

  const databaseField = sql.identifier([tableName, key]);
  let clauseOperator;

  switch (operator) {
    case "eq":
    default: {
      clauseOperator = not ? sql`!=` : sql`=`;
      break;
    }
    case "gt": {
      clauseOperator = not ? sql`<` : sql`>`;
      break;
    }
  }

  return sql`WHERE ${databaseField} ${clauseOperator} ${value}`;
};

export { applyFilter };

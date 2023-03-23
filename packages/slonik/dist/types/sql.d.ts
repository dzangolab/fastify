import type { FilterInput, SortInput } from "./types";
import type { IdentifierSqlToken } from "slonik";
declare const createFilterFragment: (filters: FilterInput | undefined, tableIdentifier: IdentifierSqlToken) => Readonly<{
    type: "SLONIK_TOKEN_FRAGMENT";
    sql: string;
    values: import("slonik").PrimitiveValueExpression[];
}>;
declare const createLimitFragment: (limit: number, offset?: number) => Readonly<{
    type: "SLONIK_TOKEN_FRAGMENT";
    sql: string;
    values: import("slonik").PrimitiveValueExpression[];
}>;
declare const createSortFragment: (tableIdentifier: IdentifierSqlToken, sort?: SortInput[]) => Readonly<{
    type: "SLONIK_TOKEN_FRAGMENT";
    sql: string;
    values: import("slonik").PrimitiveValueExpression[];
}>;
declare const createTableFragment: (table: string, schema?: string) => Readonly<{
    type: "SLONIK_TOKEN_FRAGMENT";
    sql: string;
    values: import("slonik").PrimitiveValueExpression[];
}>;
declare const createTableIdentifier: (table: string, schema?: string) => IdentifierSqlToken;
declare const createWhereIdFragment: (id: number | string) => Readonly<{
    type: "SLONIK_TOKEN_FRAGMENT";
    sql: string;
    values: import("slonik").PrimitiveValueExpression[];
}>;
export { createFilterFragment, createLimitFragment, createSortFragment, createTableFragment, createTableIdentifier, createWhereIdFragment, };
//# sourceMappingURL=sql.d.ts.map
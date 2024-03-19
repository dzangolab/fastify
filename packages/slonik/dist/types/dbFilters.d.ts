import { FilterInput } from "./types";
import type { IdentifierSqlToken } from "slonik";
declare const applyFilter: (filter: FilterInput, tableIdentifier: IdentifierSqlToken) => Readonly<{
    type: "SLONIK_TOKEN_FRAGMENT";
    sql: string;
    values: import("slonik").PrimitiveValueExpression[];
}>;
declare const applyFiltersToQuery: (filters: FilterInput, tableIdentifier: IdentifierSqlToken, not?: boolean) => Readonly<{
    type: "SLONIK_TOKEN_FRAGMENT";
    sql: string;
    values: import("slonik").PrimitiveValueExpression[];
}>;
export { applyFilter, applyFiltersToQuery };
//# sourceMappingURL=dbFilters.d.ts.map
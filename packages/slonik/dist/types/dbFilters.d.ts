import { FilterInput } from "./types";
import type { IdentifierSqlToken } from "slonik";
declare const applyFiltersToQuery: (filters: FilterInput, tableIdentifier: IdentifierSqlToken, not?: boolean) => Readonly<{
    type: "SLONIK_TOKEN_FRAGMENT";
    sql: string;
    values: import("slonik").PrimitiveValueExpression[];
}>;
export { applyFiltersToQuery };
//# sourceMappingURL=dbFilters.d.ts.map
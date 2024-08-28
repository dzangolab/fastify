import type { BaseFilterInput, FilterInput } from "./types";
import type { IdentifierSqlToken, FragmentSqlToken } from "slonik";
declare const applyFilter: (tableIdentifier: IdentifierSqlToken, filter: BaseFilterInput) => FragmentSqlToken;
declare const applyFiltersToQuery: (filters: FilterInput, tableIdentifier: IdentifierSqlToken, not?: boolean) => FragmentSqlToken;
export { applyFilter, applyFiltersToQuery };
//# sourceMappingURL=dbFilters.d.ts.map
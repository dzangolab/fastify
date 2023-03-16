import { FilterInput } from "./types";
import type { IdentifierSqlToken, QueryResultRow, TaggedTemplateLiteralInvocation } from "slonik";
declare const applyFiltersToQuery: (filters: FilterInput, tableIdentifier: IdentifierSqlToken, not?: boolean) => TaggedTemplateLiteralInvocation<QueryResultRow>;
export { applyFiltersToQuery };
//# sourceMappingURL=dbFilters.d.ts.map
import { QueryResultRow, TaggedTemplateLiteralInvocation } from "slonik";
import { FilterInput } from "./types";
declare const applyFiltersToQuery: (filters: FilterInput, tableName: string, not?: boolean) => TaggedTemplateLiteralInvocation<QueryResultRow>;
export { applyFiltersToQuery };
//# sourceMappingURL=dbFilters.d.ts.map
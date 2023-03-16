import type { FilterInput, SortInput } from "./types";
import type { IdentifierSqlToken } from "slonik";
declare const createFilterFragment: (filters: FilterInput | undefined, tableIdentifier: IdentifierSqlToken) => import("slonik").TaggedTemplateLiteralInvocation<import("slonik").QueryResultRow>;
declare const createLimitFragment: (limit: number, offset?: number) => import("slonik").TaggedTemplateLiteralInvocation<import("slonik").QueryResultRow>;
declare const createSortFragment: (tableIdentifier: IdentifierSqlToken, sort?: SortInput[]) => import("slonik").TaggedTemplateLiteralInvocation<import("slonik").QueryResultRow>;
declare const createTableFragment: (table: string, schema?: string) => import("slonik").TaggedTemplateLiteralInvocation<import("slonik").QueryResultRow>;
declare const createTableIdentifier: (table: string, schema?: string) => IdentifierSqlToken;
declare const createWhereIdFragment: (id: number | string) => import("slonik").TaggedTemplateLiteralInvocation<import("slonik").QueryResultRow>;
export { createFilterFragment, createLimitFragment, createSortFragment, createTableFragment, createTableIdentifier, createWhereIdFragment, };
//# sourceMappingURL=sql.d.ts.map
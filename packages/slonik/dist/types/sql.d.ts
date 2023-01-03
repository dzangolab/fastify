import { FilterInput, SortInput } from "./types";
declare const createLimitFragment: (limit: number, offset?: number) => import("slonik").TaggedTemplateLiteralInvocation<import("slonik").QueryResultRow>;
declare const createTableFragment: (table: string) => import("slonik").TaggedTemplateLiteralInvocation<import("slonik").QueryResultRow>;
declare const createWhereIdFragment: (id: number | string) => import("slonik").TaggedTemplateLiteralInvocation<import("slonik").QueryResultRow>;
declare const createFilterFragment: (filters: FilterInput | undefined, tableName: string) => import("slonik").TaggedTemplateLiteralInvocation<import("slonik").QueryResultRow>;
declare const createSortFragment: (tableName: string, sort?: SortInput[]) => import("slonik").TaggedTemplateLiteralInvocation<import("slonik").QueryResultRow>;
export { createLimitFragment, createTableFragment, createWhereIdFragment, createFilterFragment, createSortFragment, };
//# sourceMappingURL=sql.d.ts.map
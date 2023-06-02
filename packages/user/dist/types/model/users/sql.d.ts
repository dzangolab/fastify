import type { SortInput } from "@dzangolab/fastify-slonik";
import type { IdentifierSqlToken } from "slonik";
declare const createSortFragment: (tableIdentifier: IdentifierSqlToken, sort?: SortInput[]) => Readonly<{
    type: "SLONIK_TOKEN_FRAGMENT";
    sql: string;
    values: import("slonik").PrimitiveValueExpression[];
}>;
declare const createSortRoleFragment: (identifier: IdentifierSqlToken, sort?: SortInput[]) => Readonly<{
    type: "SLONIK_TOKEN_FRAGMENT";
    sql: string;
    values: import("slonik").PrimitiveValueExpression[];
}>;
export { createSortFragment, createSortRoleFragment };
//# sourceMappingURL=sql.d.ts.map
import type { SortInput } from "@dzangolab/fastify-slonik";
import type { IdentifierSqlToken } from "slonik";
declare const createSortFragment: (tableIdentifier: IdentifierSqlToken, sort?: SortInput[]) => import("slonik").FragmentSqlToken;
declare const createSortRoleFragment: (identifier: IdentifierSqlToken, sort?: SortInput[]) => import("slonik").FragmentSqlToken;
export { createSortFragment, createSortRoleFragment };
//# sourceMappingURL=sql.d.ts.map
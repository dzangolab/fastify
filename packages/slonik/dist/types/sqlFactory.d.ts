import { FilterInput, SortInput } from "./types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { QueryResultRow, SqlTaggedTemplate } from "slonik";
declare const SqlFactory: <T extends QueryResultRow, I extends QueryResultRow>(sql: SqlTaggedTemplate, tableName: string, config: ApiConfig) => {
    all: (fields: string[]) => import("slonik").TaggedTemplateLiteralInvocation<T>;
    create: (data: I) => import("slonik").TaggedTemplateLiteralInvocation<T>;
    delete: (id: number) => import("slonik").TaggedTemplateLiteralInvocation<T>;
    findById: (id: number) => import("slonik").TaggedTemplateLiteralInvocation<T>;
    list: (limit: number | undefined, offset?: number, filters?: FilterInput, sort?: SortInput[]) => import("slonik").TaggedTemplateLiteralInvocation<T>;
    update: (id: number, data: I) => import("slonik").TaggedTemplateLiteralInvocation<T>;
};
export default SqlFactory;
//# sourceMappingURL=sqlFactory.d.ts.map
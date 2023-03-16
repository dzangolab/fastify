import type { FilterInput, Service, SqlFactory, SortInput } from "./types";
import type { QueryResultRow } from "slonik";
declare class DefaultSqlFactory<T extends QueryResultRow, C extends QueryResultRow, U extends QueryResultRow> implements SqlFactory<T, C, U> {
    protected _service: Service<T, C, U>;
    constructor(service: Service<T, C, U>);
    getAllSql: (fields: string[]) => import("slonik").TaggedTemplateLiteralInvocation<T>;
    getCreateSql: (data: C) => import("slonik").TaggedTemplateLiteralInvocation<T>;
    getDeleteSql: (id: number | string) => import("slonik").TaggedTemplateLiteralInvocation<T>;
    getFindByIdSql: (id: number | string) => import("slonik").TaggedTemplateLiteralInvocation<T>;
    getListSql: (limit: number, offset?: number, filters?: FilterInput, sort?: SortInput[]) => import("slonik").TaggedTemplateLiteralInvocation<T>;
    getTableFragment: () => import("slonik").TaggedTemplateLiteralInvocation<QueryResultRow>;
    getUpdateSql: (id: number | string, data: U) => import("slonik").TaggedTemplateLiteralInvocation<T>;
    getCount: (filters?: FilterInput) => import("slonik").TaggedTemplateLiteralInvocation<{
        count: number;
    }>;
    get config(): import("@dzangolab/fastify-config").ApiConfig;
    get database(): import("./types/database").Database;
    get service(): Service<T, C, U>;
    get schema(): string;
    get table(): string;
}
export default DefaultSqlFactory;
//# sourceMappingURL=sqlFactory.d.ts.map
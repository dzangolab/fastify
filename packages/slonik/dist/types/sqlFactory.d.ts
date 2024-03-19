import { z } from "zod";
import type { FilterInput, Service, SqlFactory, SortInput } from "./types";
import type { QueryResultRow, QuerySqlToken } from "slonik";
declare class DefaultSqlFactory<T extends QueryResultRow, C extends QueryResultRow, U extends QueryResultRow> implements SqlFactory<T, C, U> {
    protected _service: Service<T, C, U>;
    constructor(service: Service<T, C, U>);
    getAllSql: (fields: string[], sort?: SortInput[]) => QuerySqlToken;
    getCreateSql: (data: C) => QuerySqlToken;
    getCountSql: (filters?: FilterInput) => QuerySqlToken;
    getDeleteSql: (id: number | string) => QuerySqlToken;
    getFindByIdSql: (id: number | string) => QuerySqlToken;
    getListSql: (limit: number, offset?: number, filters?: FilterInput, sort?: SortInput[]) => QuerySqlToken;
    getSortInput: (sort?: SortInput[]) => SortInput[];
    getTableFragment: () => Readonly<{
        type: "SLONIK_TOKEN_FRAGMENT";
        sql: string;
        values: import("slonik").PrimitiveValueExpression[];
    }>;
    getUpdateSql: (id: number | string, data: U) => QuerySqlToken;
    get config(): import("@dzangolab/fastify-config/dist/types/types").ApiConfig;
    get database(): import("./types/database").Database;
    get sortDirection(): import("./types/database").SortDirection;
    get sortKey(): string;
    get service(): Service<T, C, U>;
    get schema(): string;
    get table(): string;
    get validationSchema(): z.ZodTypeAny;
}
export default DefaultSqlFactory;
//# sourceMappingURL=sqlFactory.d.ts.map
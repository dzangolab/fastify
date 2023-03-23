import { z } from "zod";
import type { FilterInput, Service, SqlFactory, SortInput } from "./types";
import type { QueryResultRow, QuerySqlToken } from "slonik";
declare class DefaultSqlFactory<T extends QueryResultRow, C extends QueryResultRow, U extends QueryResultRow> implements SqlFactory<T, C, U> {
    protected _service: Service<T, C, U>;
    constructor(service: Service<T, C, U>);
    getAllSql: (fields: string[]) => QuerySqlToken;
    getCreateSql: (data: C) => QuerySqlToken;
    getDeleteSql: (id: number | string) => QuerySqlToken;
    getFindByIdSql: (id: number | string) => QuerySqlToken;
    getListSql: (limit: number, offset?: number, filters?: FilterInput, sort?: SortInput[]) => QuerySqlToken;
    getTableFragment: () => Readonly<{
        type: "SLONIK_TOKEN_FRAGMENT";
        sql: string;
        values: import("slonik").PrimitiveValueExpression[];
    }>;
    getUpdateSql: (id: number | string, data: U) => QuerySqlToken;
    getCount: (filters?: FilterInput) => QuerySqlToken;
    get config(): import("@dzangolab/fastify-config").ApiConfig;
    get database(): import("./types/database").Database;
    get service(): Service<T, C, U>;
    get schema(): string;
    get table(): string;
    get validationSchema(): z.ZodTypeAny;
}
export default DefaultSqlFactory;
//# sourceMappingURL=sqlFactory.d.ts.map
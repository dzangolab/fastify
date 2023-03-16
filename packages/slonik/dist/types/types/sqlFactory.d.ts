import type { Service } from "./service";
import type { FilterInput, SortInput } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { TaggedTemplateLiteralInvocation } from "slonik";
import type { QueryResultRow } from "slonik/dist/src/types";
interface SqlFactory<T extends QueryResultRow, C extends QueryResultRow, U extends QueryResultRow> {
    config: ApiConfig;
    service: Service<T, C, U>;
    getAllSql(fields: string[]): TaggedTemplateLiteralInvocation<T>;
    getCreateSql(data: C): TaggedTemplateLiteralInvocation<T>;
    getDeleteSql(id: number | string): TaggedTemplateLiteralInvocation<T>;
    getFindByIdSql(id: number | string): TaggedTemplateLiteralInvocation<T>;
    getListSql(limit: number, offset?: number, filters?: FilterInput, sort?: SortInput[]): TaggedTemplateLiteralInvocation<T>;
    getTableFragment(): TaggedTemplateLiteralInvocation<QueryResultRow>;
    getUpdateSql(id: number | string, data: U): TaggedTemplateLiteralInvocation<T>;
    getCount(filters?: FilterInput): TaggedTemplateLiteralInvocation<{
        count: number;
    }>;
}
export type { SqlFactory };
//# sourceMappingURL=sqlFactory.d.ts.map
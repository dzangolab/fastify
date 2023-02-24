import type { Service } from "./service";
import type { FilterInput, SortInput } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { SqlSqlToken, QueryResultRow, MixedRow } from "slonik";

interface SqlFactory<
  T extends MixedRow,
  C extends QueryResultRow,
  U extends QueryResultRow
> {
  config: ApiConfig;
  service: Service<T, C, U>;

  getAllSql(fields: string[]): SqlSqlToken<QueryResultRow>;
  getCreateSql(data: C): SqlSqlToken<QueryResultRow>;
  getDeleteSql(id: number | string): SqlSqlToken<QueryResultRow>;
  getFindByIdSql(id: number | string): SqlSqlToken<QueryResultRow>;
  getListSql(
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[]
  ): SqlSqlToken<QueryResultRow>;
  getTableFragment(): SqlSqlToken<QueryResultRow>;
  getUpdateSql(id: number | string, data: U): SqlSqlToken<QueryResultRow>;
  getCount(filters?: FilterInput): SqlSqlToken<{ count: number }>;
}

export type { SqlFactory };

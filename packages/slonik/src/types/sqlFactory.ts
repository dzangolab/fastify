import type { Service } from "./service";
import type { FilterInput, SortInput } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FragmentSqlToken, QueryResultRow, QuerySqlToken } from "slonik";

interface SqlFactory<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow
> {
  config: ApiConfig;
  service: Service<T, C, U>;

  getAllSql(fields: string[], sort?: SortInput[]): QuerySqlToken;
  getCreateSql(data: C): QuerySqlToken;
  getDeleteSql(id: number | string): QuerySqlToken;
  getFindByIdSql(id: number | string): QuerySqlToken;
  getListSql(
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[]
  ): QuerySqlToken;
  getSortInput(sort?: SortInput[]): SortInput[];
  getTableFragment(): FragmentSqlToken;
  getUpdateSql(id: number | string, data: U): QuerySqlToken;
  getCountSql(filters?: FilterInput): QuerySqlToken;
}

export type { SqlFactory };

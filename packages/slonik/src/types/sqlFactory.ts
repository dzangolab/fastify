import type { Database, FilterInput, SortInput } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FragmentSqlToken, QuerySqlToken, ValueExpression } from "slonik";

interface SqlFactory {
  config: ApiConfig;
  database: Database;
  schema: "public" | string;
  table: string;

  getAllSql(fields: string[], sort?: SortInput[]): QuerySqlToken;
  getCreateSql(data: Record<string, ValueExpression>): QuerySqlToken;
  getDeleteSql(id: number | string): QuerySqlToken;
  getFindByIdSql(id: number | string): QuerySqlToken;
  getFindOneSql(filters?: FilterInput, sort?: SortInput[]): QuerySqlToken;
  getFindSql(filters?: FilterInput, sort?: SortInput[]): QuerySqlToken;
  getListSql(
    limit?: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[],
  ): QuerySqlToken;
  getSortInput(sort?: SortInput[]): SortInput[];
  getTableFragment(): FragmentSqlToken;
  getUpdateSql(
    id: number | string,
    data: Record<string, ValueExpression>,
  ): QuerySqlToken;
  getCountSql(filters?: FilterInput): QuerySqlToken;
  getLimitDefault(): number;
  getLimitMax(): number;
}

export type { SqlFactory };

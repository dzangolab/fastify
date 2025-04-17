import type { Database, FilterInput, SortInput } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type {
  FragmentSqlToken,
  IdentifierSqlToken,
  QuerySqlToken,
  ValueExpression,
} from "slonik";

interface SqlFactory {
  config: ApiConfig;
  database: Database;
  limitDefault: number;
  limitMax: number;
  schema: "public" | string;
  table: string;
  tableIdentifier: IdentifierSqlToken;

  getAllSql(fields: string[], sort?: SortInput[]): QuerySqlToken;
  getCountSql(filters?: FilterInput): QuerySqlToken;
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
  getTableFragment(): FragmentSqlToken;
  getUpdateSql(
    id: number | string,
    data: Record<string, ValueExpression>,
  ): QuerySqlToken;
}

export type { SqlFactory };

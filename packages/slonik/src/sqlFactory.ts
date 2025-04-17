import humps from "humps";
import { sql } from "slonik";
import { z } from "zod";

import {
  createFilterFragment,
  createLimitFragment,
  createSortFragment,
  createTableFragment,
  createTableIdentifier,
} from "./sql";

import type {
  Database,
  FilterInput,
  SqlFactory,
  SortInput,
  SortDirection,
} from "./types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FragmentSqlToken, QuerySqlToken, ValueExpression } from "slonik";

class DefaultSqlFactory implements SqlFactory {
  static readonly TABLE = undefined as unknown as string;
  static readonly LIMIT_DEFAULT: number = 20;
  static readonly LIMIT_MAX: number = 50;
  static readonly SORT_DIRECTION: SortDirection = "ASC";
  static readonly SORT_KEY: string = "id";

  protected _config: ApiConfig;
  protected _database: Database;
  protected _factory: SqlFactory | undefined;
  protected _schema = "public";
  protected _validationSchema: z.ZodTypeAny = z.any();

  constructor(config: ApiConfig, database: Database, schema?: string) {
    this._config = config;
    this._database = database;

    if (schema) {
      this._schema = schema;
    }
  }

  getAllSql(fields: string[], sort?: SortInput[]): QuerySqlToken {
    const identifiers = [];

    const fieldsObject: Record<string, true> = {};

    for (const field of fields) {
      identifiers.push(sql.identifier([humps.decamelize(field)]));
      fieldsObject[humps.camelize(field)] = true;
    }

    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    // [RL 2023-03-30] this should be done checking if the validation schema is of instanceof ZodObject
    const allSchema =
      this.validationSchema._def.typeName === "ZodObject"
        ? (this.validationSchema as z.AnyZodObject).pick(fieldsObject)
        : z.any();

    return sql.type(allSchema)`
      SELECT ${sql.join(identifiers, sql.fragment`, `)}
      FROM ${this.getTableFragment()}
      ${createSortFragment(tableIdentifier, this.getSortInput(sort))}
    `;
  }

  getCountSql(filters?: FilterInput): QuerySqlToken {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    const countSchema = z.object({
      count: z.number(),
    });

    return sql.type(countSchema)`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()}
      ${createFilterFragment(filters, tableIdentifier)};
    `;
  }

  getCreateSql(data: Record<string, ValueExpression>): QuerySqlToken {
    const identifiers = [];
    const values = [];

    for (const column in data) {
      const value = data[column];
      identifiers.push(sql.identifier([humps.decamelize(column)]));
      values.push(value);
    }

    return sql.type(this.validationSchema)`
      INSERT INTO ${this.getTableFragment()}
        (${sql.join(identifiers, sql.fragment`, `)})
      VALUES (${sql.join(values, sql.fragment`, `)})
      RETURNING *;
    `;
  }

  getDeleteSql(id: number | string): QuerySqlToken {
    return sql.type(this.validationSchema)`
      DELETE FROM ${this.getTableFragment()}
      WHERE id = ${id}
      RETURNING *;
    `;
  }

  getFindByIdSql(id: number | string): QuerySqlToken {
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE id = ${id};
    `;
  }

  getFindOneSql(filters?: FilterInput, sort?: SortInput[]): QuerySqlToken {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${createFilterFragment(filters, tableIdentifier)}
      ${createSortFragment(tableIdentifier, this.getSortInput(sort))}
      LIMIT 1;
    `;
  }

  getFindSql(filters?: FilterInput, sort?: SortInput[]): QuerySqlToken {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${createFilterFragment(filters, tableIdentifier)}
      ${createSortFragment(tableIdentifier, this.getSortInput(sort))};
    `;
  }

  getLimitDefault(): number {
    return (
      this.config.slonik?.pagination?.defaultLimit ||
      (this.constructor as typeof DefaultSqlFactory).LIMIT_DEFAULT
    );
  }

  getLimitMax(): number {
    return (
      this.config.slonik?.pagination?.maxLimit ||
      (this.constructor as typeof DefaultSqlFactory).LIMIT_MAX
    );
  }

  getListSql(
    limit?: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[],
  ): QuerySqlToken {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    limit = Math.min(limit ?? this.getLimitDefault(), this.getLimitMax());

    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${createFilterFragment(filters, tableIdentifier)}
      ${createSortFragment(tableIdentifier, this.getSortInput(sort))}
      ${createLimitFragment(limit, offset)};
    `;
  }

  getSortInput(sort?: SortInput[]): SortInput[] {
    return (
      sort || [
        {
          key: this.sortKey,
          direction: this.sortDirection,
        },
      ]
    );
  }

  getTableFragment(): FragmentSqlToken {
    return createTableFragment(this.table, this.schema);
  }

  getUpdateSql(
    id: number | string,
    data: Record<string, ValueExpression>,
  ): QuerySqlToken {
    const columns = [];

    for (const column in data) {
      const value = data[column];
      columns.push(
        sql.fragment`${sql.identifier([humps.decamelize(column)])} = ${value}`,
      );
    }

    return sql.type(this.validationSchema)`
      UPDATE ${this.getTableFragment()}
      SET ${sql.join(columns, sql.fragment`, `)}
      WHERE id = ${id}
      RETURNING *;
    `;
  }

  get config(): ApiConfig {
    return this._config;
  }

  get database(): Database {
    return this._database;
  }

  get schema(): string {
    return this._schema || "public";
  }

  get sortDirection(): SortDirection {
    return (this.constructor as typeof DefaultSqlFactory).SORT_DIRECTION;
  }

  get sortKey(): string {
    return (this.constructor as typeof DefaultSqlFactory).SORT_KEY;
  }

  get table(): string {
    return (this.constructor as typeof DefaultSqlFactory).TABLE;
  }

  get validationSchema(): z.ZodTypeAny {
    return this._validationSchema || z.any();
  }
}

export default DefaultSqlFactory;

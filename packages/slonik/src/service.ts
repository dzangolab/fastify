import { ValueExpression } from "slonik";

import DefaultSqlFactory from "./sqlFactory";

import type {
  Database,
  FilterInput,
  Service,
  SortInput,
  SqlFactory,
} from "./types";
import type { PaginatedList } from "./types/service";
import type { ApiConfig } from "@dzangolab/fastify-config";

/* eslint-disable brace-style */
abstract class BaseService<
  T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  C extends Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  U extends Record<string, any>,
> implements Service<T, C, U>
{
  /* eslint-enabled */
  protected _config: ApiConfig;
  protected _database: Database;
  protected _factory: SqlFactory | undefined;
  protected _schema = "public";

  constructor(config: ApiConfig, database: Database, schema?: string) {
    this._config = config;
    this._database = database;

    if (schema) {
      this._schema = schema;
    }
  }

  /**
   * Only for entities that support it. Returns the full list of entities,
   * with no filtering, no custom sorting order, no pagination,
   * but with a restricted set of data.
   * Example: to get the full list of countries to populate the CountryPicker
   */
  async all(
    fields: string[],
    sort?: SortInput[],
  ): Promise<Partial<readonly T[]>> {
    const query = this.factory.getAllSql(fields, sort);

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result as Partial<readonly T[]>;
  }

  async create(data: C): Promise<T | undefined> {
    const updatedData = this.convertToValueExpressions(data);
    const query = this.factory.getCreateSql(updatedData);

    const result = (await this.database.connect(async (connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    })) as T;

    return result ? this.postCreate(result) : undefined;
  }

  async delete(id: number | string): Promise<T | null> {
    const query = this.factory.getDeleteSql(id);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result as T | null;
  }

  async find(filters?: FilterInput, sort?: SortInput[]): Promise<readonly T[]> {
    const query = this.factory.getFindSql(filters, sort);

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result as readonly T[];
  }

  async findById(id: number | string): Promise<T | null> {
    const query = this.factory.getFindByIdSql(id);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result as T | null;
  }

  async findOne(filters?: FilterInput, sort?: SortInput[]): Promise<T | null> {
    const query = this.factory.getFindOneSql(filters, sort);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result as T | null;
  }

  async list(
    limit?: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[],
  ): Promise<PaginatedList<T>> {
    const query = this.factory.getListSql(limit, offset, filters, sort);

    const [totalCount, filteredCount, data] = await Promise.all([
      this.count(),
      this.count(filters),
      this.database.connect((connection) => {
        return connection.any(query);
      }),
    ]);

    return {
      totalCount,
      filteredCount,
      data: data as readonly T[],
    };
  }

  async count(filters?: FilterInput): Promise<number> {
    const query = this.factory.getCountSql(filters);

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return (result as { count: number }[])[0].count;
  }

  async update(id: number | string, data: U): Promise<T> {
    const updatedData = this.convertToValueExpressions(data);
    const query = this.factory.getUpdateSql(id, updatedData);

    return (await this.database.connect((connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    })) as Promise<T>;
  }

  get config(): ApiConfig {
    return this._config;
  }

  get database(): Database {
    return this._database;
  }

  get factory(): SqlFactory {
    if (!this._factory) {
      const sqlFactoryClass = this.sqlFactoryClass;

      this._factory = new sqlFactoryClass(
        this.config,
        this.database,
        this.schema,
      );
    }

    return this._factory;
  }

  get schema(): string {
    return this._schema || "public";
  }

  get sqlFactoryClass() {
    return DefaultSqlFactory;
  }

  get table(): string {
    return this.factory.table;
  }

  protected async postCreate(result: T): Promise<T> {
    return result;
  }

  isValueExpression(value: unknown): value is ValueExpression {
    return (
      value === null ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value instanceof Date ||
      Buffer.isBuffer(value)
    );
  }

  convertToValueExpressions(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>,
  ): Record<string, ValueExpression> {
    return Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(data).filter(([_, value]) =>
        this.isValueExpression(value),
      ),
    );
  }
}

export default BaseService;

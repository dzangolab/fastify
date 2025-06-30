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
  C extends Record<string, unknown>,
  U extends Record<string, unknown>,
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
    await this.preProcess("all");

    const query = this.factory.getAllSql(fields, sort);

    const result = (await this.database.connect((connection) => {
      return connection.any(query);
    })) as Partial<readonly T[]>;

    return await this.postProcess<Partial<readonly T[]>>("all", result);
  }

  async count(filters?: FilterInput): Promise<number> {
    await this.preProcess("count");

    const query = this.factory.getCountSql(filters);

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    const count = (result as { count: number }[])[0].count;

    return await this.postProcess<number>("count", count);
  }

  async create(data: C): Promise<T | undefined> {
    const processedData = await this.preProcess("create", data);

    const query = this.factory.getCreateSql(processedData || data);

    const result = (await this.database.connect(async (connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    })) as T;

    return result ? await this.postProcess<T>("create", result) : undefined;
  }

  async delete(id: number | string, force?: boolean): Promise<T | null> {
    await this.preProcess("delete", id);

    const query = this.factory.getDeleteSql(id, force);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result ? await this.postProcess<T>("delete", result) : result;
  }

  async find(filters?: FilterInput, sort?: SortInput[]): Promise<readonly T[]> {
    await this.preProcess("find");

    const query = this.factory.getFindSql(filters, sort);

    const result = (await this.database.connect((connection) => {
      return connection.any(query);
    })) as readonly T[];

    return await this.postProcess<readonly T[]>("find", result);
  }

  async findById(id: number | string): Promise<T | null> {
    await this.preProcess("findById");

    const query = this.factory.getFindByIdSql(id);

    const result = (await this.database.connect((connection) => {
      return connection.maybeOne(query);
    })) as T | null;

    // eslint-disable-next-line unicorn/no-null
    return result ? await this.postProcess<T>("findById", result) : null;
  }

  async findOne(filters?: FilterInput, sort?: SortInput[]): Promise<T | null> {
    await this.preProcess("findOne");

    const query = this.factory.getFindOneSql(filters, sort);

    const result = (await this.database.connect((connection) => {
      return connection.maybeOne(query);
    })) as T | null;

    // eslint-disable-next-line unicorn/no-null
    return result ? await this.postProcess<T>("findOne", result) : null;
  }

  async list(
    limit?: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[],
  ): Promise<PaginatedList<T>> {
    await this.preProcess("list");

    const query = this.factory.getListSql(limit, offset, filters, sort);

    const [totalCount, filteredCount, data] = await Promise.all([
      this.count(),
      this.count(filters),
      this.database.connect((connection) => {
        return connection.any(query);
      }),
    ]);

    const result = {
      totalCount,
      filteredCount,
      data: data as readonly T[],
    };

    return await this.postProcess<PaginatedList<T>>("list", result);
  }

  async update(id: number | string, data: U): Promise<T> {
    const processedData = await this.preProcess("update", data);

    const query = this.factory.getUpdateSql(id, processedData || data);

    const result = (await this.database.connect((connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    })) as T;

    return await this.postProcess<T>("update", result);
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

  protected async preProcess<D>(
    action: string,
    data?: D,
  ): Promise<D | undefined> {
    const hookName = `pre${action.charAt(0).toUpperCase()}${action.slice(1)}`;

    const preHookFunction = (this as Record<string, unknown>)[hookName];

    if (typeof preHookFunction === "function") {
      const preHook = preHookFunction as (data?: D) => Promise<D | undefined>;

      const processedData = await preHook(data);

      // FIXME only performing a shallow runtime check, using JavaScript's typeof,
      // which is limited and not reliable for complex data types like arrays, objects, classes, etc.
      if (typeof processedData === typeof data) {
        return processedData;
      }
    }

    return data;
  }

  protected async postCreate(result: T): Promise<T> {
    return result;
  }

  protected async postProcess<R>(action: string, result: R): Promise<R> {
    const hookName = `post${action.charAt(0).toUpperCase()}${action.slice(1)}`;

    const postHookFunction = (this as Record<string, unknown>)[hookName];

    if (typeof postHookFunction === "function") {
      const postHook = postHookFunction as (result: R) => Promise<R>;

      const processedResult = await postHook(result);

      // FIXME only performing a shallow runtime check, using JavaScript's typeof,
      // which is limited and not reliable for complex data types like arrays, objects, classes, etc.
      if (typeof processedResult === typeof result) {
        return processedResult;
      }
    }

    return result;
  }
}

export default BaseService;

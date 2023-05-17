import { z } from "zod";

import DefaultSqlFactory from "./sqlFactory";

import type {
  Database,
  FilterInput,
  Service,
  SortInput,
  SqlFactory,
} from "./types";
import type { SortDirection } from "./types/database";
import type { PaginatedList } from "./types/service";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
abstract class BaseService<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow
> implements Service<T, C, U>
{
  /* eslint-enabled */
  static readonly TABLE = undefined as unknown as string;
  static readonly LIMIT_DEFAULT: number = 20;
  static readonly LIMIT_MAX: number = 50;
  static readonly SORT_DIRECTION: SortDirection = "ASC";
  static readonly SORT_KEY: string = "id";

  protected _config: ApiConfig;
  protected _database: Database;
  protected _factory: SqlFactory<T, C, U> | undefined;
  protected _schema = "public";
  protected _validationSchema: z.ZodTypeAny = z.any();

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
  all = async (
    fields: string[],
    sort?: SortInput[]
  ): Promise<Partial<readonly T[]>> => {
    const query = this.factory.getAllSql(fields, sort);

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result as Partial<readonly T[]>;
  };

  create = async (data: C): Promise<T | undefined> => {
    const query = this.factory.getCreateSql(data);

    const result = (await this.database.connect(async (connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    })) as T;

    return result ? this.postCreate(result) : undefined;
  };

  delete = async (id: number | string): Promise<T | null> => {
    const query = this.factory.getDeleteSql(id);

    const result = await this.database.connect((connection) => {
      return connection.one(query);
    });

    return result as T;
  };

  findById = async (id: number | string): Promise<T | null> => {
    const query = this.factory.getFindByIdSql(id);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result as T;
  };

  getLimitDefault = (): number => {
    return (
      this.config.slonik?.pagination?.defaultLimit ||
      (this.constructor as typeof BaseService).LIMIT_DEFAULT
    );
  };

  getLimitMax = (): number => {
    return (
      this.config.slonik?.pagination?.maxLimit ||
      (this.constructor as typeof BaseService).LIMIT_MAX
    );
  };

  list = async (
    limit?: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[]
  ): Promise<PaginatedList<T>> => {
    const query = this.factory.getListSql(
      Math.min(limit ?? this.getLimitDefault(), this.getLimitMax()),
      offset,
      filters,
      sort
    );

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
      data,
    };
  };

  count = async (filters?: FilterInput): Promise<number> => {
    const query = this.factory.getCountSql(filters);

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result[0].count;
  };

  update = async (id: number | string, data: U): Promise<T> => {
    const query = this.factory.getUpdateSql(id, data);

    return await this.database.connect((connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    });
  };

  get config(): ApiConfig {
    return this._config;
  }

  get database() {
    return this._database;
  }

  get factory(): SqlFactory<T, C, U> {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new DefaultSqlFactory<T, C, U>(this);
    }

    return this.factory as SqlFactory<T, C, U>;
  }

  get sortDirection(): SortDirection {
    return (this.constructor as typeof BaseService).SORT_DIRECTION;
  }

  get sortKey(): string {
    return (this.constructor as typeof BaseService).SORT_KEY;
  }

  get schema(): string {
    return this._schema || "public";
  }

  get table(): string {
    return (this.constructor as typeof BaseService).TABLE;
  }

  get validationSchema(): z.ZodTypeAny {
    return this._validationSchema || z.any();
  }

  protected postCreate = async (result: T): Promise<T> => {
    return result;
  };
}

export default BaseService;

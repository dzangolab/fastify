import SqlFactory from "./sqlFactory";

import type {
  Database,
  FilterInput,
  Service,
  SortInput,
  SqlFactoryInterface,
} from "./types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class DefaultService<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow
> implements Service<T, C, U>
{
  /* eslint-enabled */
  static readonly FACTORY_CLASSNAME = "SqlFactory";
  static readonly LIMIT_DEFAULT = 20;
  static readonly LIMIT_MAX = 50;

  protected _config: ApiConfig;
  protected _database: Database;
  protected _factory: SqlFactory<T, C, U> | undefined;
  protected _schema: string | undefined;
  protected _table: string | undefined;

  constructor(
    config: ApiConfig,
    database: Database,
    table?: string,
    schema?: string
  ) {
    this._config = config;
    this._database = database;
    this._table = table;
    this._schema = schema;
  }

  /**
   * Only for entities that support it. Returns the full list of entities,
   * with no filtering, no custom sorting order, no pagination,
   * but with a restricted set of data.
   * Example: to get the full list of countries to populate the CountryPicker
   */
  all = async (fields: string[]): Promise<readonly T[]> => {
    const query = this.factory.getAllSql(fields);

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result as T[];
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

  delete = async (id: number): Promise<T | null> => {
    const query = this.factory.getDeleteSql(id);

    const result = await this.database.connect((connection) => {
      return connection.one(query);
    });

    return result as T;
  };

  findById = async (id: number): Promise<T | null> => {
    const query = this.factory.getFindByIdSql(id);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result as T;
  };

  getLimitDefault = (): number => {
    return (
      this.config.slonik?.pagination?.defaultLimit ||
      DefaultService.LIMIT_DEFAULT
    );
  };

  getLimitMax = (): number => {
    return this.config.slonik?.pagination?.maxLimit || DefaultService.LIMIT_MAX;
  };

  list = async (
    limit?: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[]
  ): Promise<readonly T[]> => {
    const query = this.factory.getListSql(
      Math.min(limit ?? this.getLimitDefault(), this.getLimitMax()),
      offset,
      filters,
      sort
    );

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result as T[];
  };

  update = async (id: number, data: U): Promise<T> => {
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

  get factory(): SqlFactoryInterface<T, C, U> {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new SqlFactory<T, C, U>(this);
    }

    return this.factory as SqlFactory<T, C, U>;
  }

  get schema(): string {
    return this._schema || "public";
  }

  get table(): string {
    return this._table as string;
  }

  protected postCreate = async (result: T): Promise<T> => {
    return result;
  };
}

export default DefaultService;

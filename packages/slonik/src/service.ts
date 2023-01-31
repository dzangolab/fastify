import SqlFactory from "./sqlFactory";

import type { Database, FilterInput, SortInput } from "./types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { QueryResultRow } from "slonik";

class Service<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow
> {
  static readonly LIMIT_DEFAULT = 20;
  static readonly LIMIT_MAX = 50;

  protected config: ApiConfig;
  protected database: Database;

  protected factory: SqlFactory<T, C, U> | undefined;
  protected schema = "public";
  protected table: string;

  constructor(
    config: ApiConfig,
    database: Database,
    table: string,
    schema?: string
  ) {
    this.config = config;
    this.database = database;
    this.table = table;

    if (schema) {
      this.schema = schema;
    }
  }

  /**
   * Only for entities that support it. Returns the full list of entities,
   * with no filtering, no custom sorting order, no pagination,
   * but with a restricted set of data.
   * Example: to get the full list of countries to populate the CountryPicker
   */
  all = async (fields: string[]): Promise<readonly T[]> => {
    const query = this.getSqlFactory().getAllSql(fields);

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result as T[];
  };

  create = async (data: C): Promise<T> => {
    const query = this.getSqlFactory().getCreateSql(data);

    return (await this.database.connect(async (connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    })) as T;
  };

  delete = async (id: number): Promise<T | null> => {
    const query = this.getSqlFactory().getDeleteSql(id);

    const result = await this.database.connect((connection) => {
      return connection.one(query);
    });

    return result as T;
  };

  findById = async (id: number): Promise<T | null> => {
    const query = this.getSqlFactory().getFindByIdSql(id);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result as T;
  };

  getLimitDefault = () => {
    return (
      this.config.slonik?.pagination?.defaultLimit || Service.LIMIT_DEFAULT
    );
  };

  getLimitMax = () => {
    return this.config.slonik?.pagination?.maxLimit || Service.LIMIT_MAX;
  };

  list = async (
    limit?: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[]
  ): Promise<readonly T[]> => {
    const query = this.getSqlFactory().getListSql(
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
    const query = this.getSqlFactory().getUpdateSql(id, data);

    return await this.database.connect((connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    });
  };

  protected getSqlFactory = () => {
    if (!this.factory) {
      this.factory = new SqlFactory<T, C, U>(this.table, this.schema);
    }

    return this.factory;
  };
}

export default Service;

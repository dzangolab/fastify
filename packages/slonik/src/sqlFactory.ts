import humps from "humps";
import { sql } from "slonik";

import {
  createFilterFragment,
  createLimitFragment,
  createSortFragment,
  createTableFragment,
  createTableIdentifier,
} from "./sql";

import type { FilterInput, SlonikEnabledConfig, SortInput } from "./types";
import type { QueryResultRow } from "slonik";

class SqlFactory<
  Config extends SlonikEnabledConfig,
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow
> {
  config: Config;
  schema: string;
  table: string;

  constructor(config: Config, table: string, schema?: string) {
    this.config = config;
    this.schema = schema || "public";
    this.table = table;
  }

  getAllSql = (fields: string[]) => {
    const identifiers = [];

    for (const field of fields) {
      identifiers.push(sql`${sql.identifier([humps.decamelize(field)])}`);
    }

    return sql<T>`
      SELECT ${sql.join(identifiers, sql`, `)}
      FROM ${this.getTableFragment()}
      ORDER BY id ASC
    `;
  };

  getCreateSql = (data: C) => {
    const keys: string[] = [];
    const values = [];

    for (const column in data) {
      const key = column as keyof C;
      const value = data[key];
      keys.push(humps.decamelize(key as string));
      values.push(value);
    }

    const identifiers = keys.map((key) => {
      return sql.identifier([key]);
    });

    return sql<T>`
      INSERT INTO ${this.getTableFragment()}
        (${sql.join(identifiers, sql`, `)})
      VALUES (${sql.join(values, sql`, `)})
      RETURNING *;
    `;
  };

  getDeleteSql = (id: number) => {
    return sql<T>`
      DELETE FROM ${this.getTableFragment()}
      WHERE id = ${id}
      RETURNING *;
    `;
  };

  getFindByIdSql = (id: number) => {
    return sql<T>`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE id = ${id}
    `;
  };

  getListSql = (
    limit?: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[]
  ) => {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    return sql<T>`
      SELECT *
      FROM ${this.getTableFragment()}
      ${createFilterFragment(filters, tableIdentifier)}
      ${createSortFragment(tableIdentifier, sort)}
      ${createLimitFragment(
        Math.min(
          limit ?? this.config.pagination.default_limit,
          this.config?.pagination.max_limit
        ),
        offset
      )};
    `;
  };

  getTableFragment = () => {
    return createTableFragment(this.table, this.schema);
  };

  getUpdateSql = (id: number, data: U) => {
    const columns = [];

    for (const column in data) {
      const value = data[column as keyof U];
      columns.push(
        sql`${sql.identifier([humps.decamelize(column)])} = ${value}`
      );
    }

    return sql<T>`
      UPDATE ${this.getTableFragment()}
      SET ${sql.join(columns, sql`, `)}
      WHERE id = ${id}
      RETURNING *;
    `;
  };
}

export default SqlFactory;

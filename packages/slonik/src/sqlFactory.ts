import humps from "humps";
import { sql } from "slonik";

import {
  createFilterFragment,
  createLimitFragment,
  createSortFragment,
  createTableFragment,
  createTableIdentifier,
} from "./sql";

import type { FilterInput, Service, SqlFactory, SortInput } from "./types";
import type { QueryResultRow, QuerySqlToken } from "slonik";

/* eslint-disable brace-style */
class DefaultSqlFactory<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow
> implements SqlFactory<T, C, U>
{
  /* eslint-enabled */
  protected _service: Service<T, C, U>;

  constructor(service: Service<T, C, U>) {
    this._service = service;
  }

  getAllSql = (fields: string[]): QuerySqlToken => {
    const identifiers = [];

    for (const field of fields) {
      identifiers.push(sql.identifier([humps.decamelize(field)]));
    }

    return sql.unsafe`
      SELECT ${sql.join(identifiers, sql.fragment`, `)}
      FROM ${this.getTableFragment()}
      ORDER BY id ASC;
    `;
  };

  getCreateSql = (data: C): QuerySqlToken => {
    const identifiers = [];
    const values = [];

    for (const column in data) {
      const key = column as keyof C;
      const value = data[key];
      identifiers.push(sql.identifier([humps.decamelize(key as string)]));
      values.push(value);
    }

    return sql.unsafe`
      INSERT INTO ${this.getTableFragment()}
        (${sql.join(identifiers, sql.fragment`, `)})
      VALUES (${sql.join(values, sql.fragment`, `)})
      RETURNING *;
    `;
  };

  getDeleteSql = (id: number | string): QuerySqlToken => {
    return sql.unsafe`
      DELETE FROM ${this.getTableFragment()}
      WHERE id = ${id}
      RETURNING *;
    `;
  };

  getFindByIdSql = (id: number | string): QuerySqlToken => {
    return sql.unsafe`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE id = ${id};
    `;
  };

  getListSql = (
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[]
  ): QuerySqlToken => {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    return sql.unsafe`
      SELECT *
      FROM ${this.getTableFragment()}
      ${createFilterFragment(filters, tableIdentifier)}
      ${createSortFragment(tableIdentifier, sort)}
      ${createLimitFragment(limit, offset)};
    `;
  };

  getTableFragment = () => {
    return createTableFragment(this.table, this.schema);
  };

  getUpdateSql = (id: number | string, data: U): QuerySqlToken => {
    const columns = [];

    for (const column in data) {
      const value = data[column as keyof U];
      columns.push(
        sql.fragment`${sql.identifier([humps.decamelize(column)])} = ${value}`
      );
    }

    return sql.unsafe`
      UPDATE ${this.getTableFragment()}
      SET ${sql.join(columns, sql.fragment`, `)}
      WHERE id = ${id}
      RETURNING *;
    `;
  };

  getCount = (filters?: FilterInput): QuerySqlToken => {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    return sql.unsafe`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()}
      ${createFilterFragment(filters, tableIdentifier)};
    `;
  };

  get config() {
    return this.service.config;
  }

  get database() {
    return this.service.database;
  }

  get service() {
    return this._service;
  }

  get schema() {
    return this.service.schema;
  }

  get table() {
    return this.service.table;
  }
}

export default DefaultSqlFactory;

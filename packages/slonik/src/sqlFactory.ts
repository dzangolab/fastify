import humps from "humps";
import { sql } from "slonik";
import { z } from "zod";

import {
  createLimitFragment,
  createSortFragment,
  createTableFragment,
  createTableIdentifier,
  createWhereFragment,
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

  getAllSql = (fields: string[], sort?: SortInput[]): QuerySqlToken => {
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

    return sql.type(this.validationSchema)`
      INSERT INTO ${this.getTableFragment()}
        (${sql.join(identifiers, sql.fragment`, `)})
      VALUES (${sql.join(values, sql.fragment`, `)})
      RETURNING *;
    `;
  };

  getCountSql = (filters?: FilterInput): QuerySqlToken => {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    const countSchema = z.object({
      count: z.number(),
    });

    return sql.type(countSchema)`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()}
      ${createWhereFragment(filters, tableIdentifier)};
    `;
  };

  getDeleteSql = (id: number | string): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      DELETE FROM ${this.getTableFragment()}
      WHERE id = ${id}
      RETURNING *;
    `;
  };

  getFindByIdSql = (id: number | string): QuerySqlToken => {
    return sql.type(this.validationSchema)`
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

    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${createWhereFragment(filters, tableIdentifier)}
      ${createSortFragment(tableIdentifier, this.getSortInput(sort))}
      ${createLimitFragment(limit, offset)};
    `;
  };

  getSortInput = (sort?: SortInput[]): SortInput[] => {
    return (
      sort || [
        {
          key: this.sortKey,
          direction: this.sortDirection,
        },
      ]
    );
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

    return sql.type(this.validationSchema)`
      UPDATE ${this.getTableFragment()}
      SET ${sql.join(columns, sql.fragment`, `)}
      WHERE id = ${id}
      RETURNING *;
    `;
  };

  get config() {
    return this.service.config;
  }

  get database() {
    return this.service.database;
  }

  get sortDirection() {
    return this.service.sortDirection;
  }

  get sortKey() {
    return this.service.sortKey;
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

  get validationSchema() {
    return this.service.validationSchema;
  }
}

export default DefaultSqlFactory;

import {
  createLimitFragment,
  createTableFragment,
  createFilterFragment,
  createSortFragment,
} from "./sql";
import { FilterInput, SortInput } from "./types";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { QueryResultRow, SqlTaggedTemplate } from "slonik";

const SqlFactory = <T extends QueryResultRow, I extends QueryResultRow>(
  sql: SqlTaggedTemplate,
  tableName: string,
  config: ApiConfig
) => {
  return {
    all: (fields: string[], schema?: string ) => {
      const columns = [];

      for (const field of fields) {
        columns.push(sql`${sql.identifier([field])}`);
      }

      return sql<T>`
        SELECT ${sql.join(columns, sql`, `)}
        FROM ${createTableFragment(tableName, schema)}
        ORDER BY id ASC
      `;
    },

    create: (data: I) => {
      const keys: string[] = [];
      const values = [];

      for (const column in data) {
        const key = column as keyof I;
        const value = data[key];
        keys.push(key as string);
        values.push(value);
      }

      const identifiers = keys.map((key) => {
        return sql.identifier([key]);
      });

      return sql<T>`
        INSERT INTO ${createTableFragment(tableName)}
        (${sql.join(identifiers, sql`, `)}, created_at, updated_at)
        VALUES (${sql.join(values, sql`, `)}, NOW(), NOW())
        RETURNING *;
      `;
    },

    delete: (id: number) => {
      return sql<T>`
        DELETE FROM ${createTableFragment(tableName)}
        WHERE id = ${id}
        RETURNING *;
      `;
    },

    findById: (id: number) => {
      return sql<T>`
        SELECT *
        FROM ${createTableFragment(tableName)}
        WHERE id = ${id}
      `;
    },

    list: (
      limit: number | undefined,
      offset?: number,
      filters?: FilterInput,
      sort?: SortInput[]
    ) => {
      return sql<T>`
        SELECT *
        FROM ${createTableFragment(tableName)}
        ${createFilterFragment(filters, tableName)}
        ${createSortFragment(tableName, sort)}
        ${createLimitFragment(
          Math.min(
            limit ?? config.pagination.default_limit,
            config?.pagination.max_limit
          ),
          offset
        )};
      `;
    },

    update: (id: number, data: I) => {
      const columns = [];

      for (const column in data) {
        const value = data[column as keyof I];
        columns.push(sql`${sql.identifier([column])} = ${value}`);
      }

      return sql<T>`
        UPDATE ${createTableFragment(tableName)}
        SET ${sql.join(columns, sql`, `)}
        WHERE id = ${id}
        RETURNING *;
      `;
    },
  };
};

export default SqlFactory;

import humps from "humps";
import { sql } from "slonik";

import type { SortInput } from "@dzangolab/fastify-slonik";
import type { IdentifierSqlToken } from "slonik";

const createSortFragment = (
  tableIdentifier: IdentifierSqlToken,
  sort?: SortInput[]
) => {
  if (sort && sort.length > 0) {
    const arraySort = [];

    for (const data of sort) {
      const direction =
        data.direction === "ASC" ? sql.fragment`ASC` : sql.fragment`DESC`;

      let roleFragment;

      if (data.key === "roles") {
        roleFragment = sql.fragment`user_role.role ->> 0`;
      }

      const sortIdentifier = sql.identifier([
        ...tableIdentifier.names,
        humps.decamelize(data.key),
      ]);

      arraySort.push(
        sql.fragment`${roleFragment ?? sortIdentifier} ${direction}`
      );
    }

    return sql.fragment`ORDER BY ${sql.join(arraySort, sql.fragment`,`)}`;
  }

  return sql.fragment``;
};

const createSortRoleFragment = (
  identifier: IdentifierSqlToken,
  sort?: SortInput[]
) => {
  let direction = sql.fragment`ASC`;

  if (!Array.isArray(sort)) {
    sort = [];
  }

  sort.some((sortItem) => {
    if (sortItem.key === "roles" && sortItem.direction != "ASC") {
      direction = sql.fragment`DESC`;

      return true;
    }

    return false;
  });

  return sql.fragment`ORDER BY ${identifier} ${direction}`;
};

export { createSortFragment, createSortRoleFragment };

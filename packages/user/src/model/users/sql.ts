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

      const sortIdentifier = sql.identifier(
        data.key === "roles"
          ? ["user_role", "role"]
          : [...tableIdentifier.names, humps.decamelize(data.key)]
      );

      arraySort.push(sql.fragment`${sortIdentifier} ${direction}`);
    }

    return sql.fragment`ORDER BY ${sql.join(arraySort, sql.fragment`,`)}`;
  }

  return sql.fragment``;
};

export default createSortFragment;

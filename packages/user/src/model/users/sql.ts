import humps from "humps";
import { sql } from "slonik";

import { applyFiltersToQuery } from "./dbFilters";

import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { FragmentSqlToken, IdentifierSqlToken } from "slonik";

const createSortFragment = (
  tableIdentifier: IdentifierSqlToken,
  sort?: SortInput[],
): FragmentSqlToken => {
  if (sort && sort.length > 0) {
    const arraySort = [];

    for (const data of sort) {
      const direction =
        data.direction === "ASC" ? sql.fragment`ASC` : sql.fragment`DESC`;

      let sortFragment;

      if (data.key === "roles") {
        sortFragment = sql.fragment`user_role.role ->> 0`;
      } else if (data.key === "name") {
        sortFragment = sql.fragment`LOWER(CONCAT_WS(' ', ${tableIdentifier}.given_name, ${tableIdentifier}.middle_names, ${tableIdentifier}.surname))`;
      } else {
        sortFragment = sql.identifier([
          ...tableIdentifier.names,
          humps.decamelize(data.key),
        ]);
      }

      arraySort.push(sql.fragment`${sortFragment} ${direction}`);
    }

    return sql.fragment`ORDER BY ${sql.join(arraySort, sql.fragment`,`)}`;
  }

  return sql.fragment``;
};

const createSortRoleFragment = (
  identifier: IdentifierSqlToken,
  sort?: SortInput[],
): FragmentSqlToken => {
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

const createFilterFragment = (
  filters: FilterInput | undefined,
  tableIdentifier: IdentifierSqlToken,
) => {
  if (filters) {
    return applyFiltersToQuery(filters, tableIdentifier);
  }

  return sql.fragment``;
};

export { createSortFragment, createSortRoleFragment, createFilterFragment };

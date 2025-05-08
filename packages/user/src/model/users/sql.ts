import { applyFilter } from "@dzangolab/fastify-slonik";
import humps from "humps";
import { sql } from "slonik";

import type {
  BaseFilterInput,
  FilterInput,
  SortInput,
} from "@dzangolab/fastify-slonik";
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

      let roleFragment;

      if (data.key === "roles") {
        roleFragment = sql.fragment`user_role.role ->> 0`;
      }

      const sortIdentifier = sql.identifier([
        ...tableIdentifier.names,
        humps.decamelize(data.key),
      ]);

      arraySort.push(
        sql.fragment`${roleFragment ?? sortIdentifier} ${direction}`,
      );
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

const applyFiltersToQuery = (
  filters: FilterInput,
  tableIdentifier: IdentifierSqlToken,
  not = false,
): FragmentSqlToken => {
  const andFilter: FragmentSqlToken[] = [];
  const orFilter: FragmentSqlToken[] = [];
  let queryFilter;

  const applyFilters = (
    filters: FilterInput,
    tableIdentifier: IdentifierSqlToken,
    not = false,
  ) => {
    if ("AND" in filters) {
      for (const filterData of filters.AND) {
        applyFilters(filterData, tableIdentifier);
      }
    } else if ("OR" in filters) {
      for (const filterData of filters.OR) {
        applyFilters(filterData, tableIdentifier, true);
      }
    } else {
      const query =
        humps.decamelize(filters.key) === "roles"
          ? applyRolesFilter(filters)
          : applyFilter(tableIdentifier, filters);

      if (not) {
        orFilter.push(query);
      } else {
        andFilter.push(query);
      }
    }
  };

  applyFilters(filters, tableIdentifier, not);

  if (andFilter.length > 0 && orFilter.length > 0) {
    queryFilter = sql.join(
      [
        sql.fragment`(${sql.join(andFilter, sql.fragment` AND `)})`,
        sql.fragment`(${sql.join(orFilter, sql.fragment` OR `)})`,
      ],
      sql.fragment`${
        "AND" in filters ? sql.fragment` AND ` : sql.fragment` OR `
      }`,
    );
  } else if (andFilter.length > 0) {
    queryFilter = sql.join(andFilter, sql.fragment` AND `);
  } else if (orFilter.length > 0) {
    queryFilter = sql.join(orFilter, sql.fragment` OR `);
  }

  return queryFilter ? sql.fragment`WHERE ${queryFilter}` : sql.fragment``;
};

const applyRolesFilter = (filter: BaseFilterInput) => {
  const { value, not = false } = filter;

  const notFragment = not ? sql.fragment`NOT` : sql.fragment``;

  const valueFragment = sql.fragment`(${sql.join(
    value.split(","),
    sql.fragment`, `,
  )})`;

  return sql.fragment`${notFragment} EXISTS (
    SELECT roles
    FROM jsonb_array_elements_text(user_role.role) as roles
    WHERE roles IN ${valueFragment}
  )`;
};

const filterFragment = (
  tableIdentifier: IdentifierSqlToken,
  filters: FilterInput | undefined,
) => {
  if (filters) {
    return applyFiltersToQuery(filters, tableIdentifier);
  }

  return sql.fragment``;
};

export { createSortFragment, createSortRoleFragment, filterFragment };

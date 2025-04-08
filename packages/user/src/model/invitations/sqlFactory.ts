import {
  DefaultSqlFactory,
  createTableIdentifier,
  createFilterFragment,
  createSortFragment,
  createLimitFragment,
  createTableFragment,
} from "@dzangolab/fastify-slonik";
import { sql } from "slonik";

import { TABLE_INVITATIONS, TABLE_USERS } from "../../constants";

import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { QuerySqlToken } from "slonik";

/* eslint-disable brace-style */
class InvitationSqlFactory extends DefaultSqlFactory {
  /* eslint-enabled */
  static readonly TABLE = TABLE_INVITATIONS;

  getFindByTokenSql = (token: string): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE token = ${token};
    `;
  };

  getListSql = (
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[],
  ): QuerySqlToken => {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    const usersTable = createTableFragment(
      this.config.user.tables?.users?.name || TABLE_USERS,
      this.schema,
    );

    return sql.type(this.validationSchema)`
      SELECT ${this.getTableFragment()}.*, ROW_TO_JSON("user") as "invited_by"
      FROM ${this.getTableFragment()}
      join ${usersTable} "user" on ${this.getTableFragment()}."invited_by_id" = "user"."id"
      ${createFilterFragment(filters, tableIdentifier)}
      ${createSortFragment(tableIdentifier, this.getSortInput(sort))}
      ${createLimitFragment(limit, offset)};
    `;
  };
}

export default InvitationSqlFactory;

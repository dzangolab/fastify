import {
  DefaultSqlFactory,
  createTableIdentifier,
  createFilterFragment,
  createSortFragment,
  createLimitFragment,
  createTableFragment,
} from "@dzangolab/fastify-slonik";
import { sql } from "slonik";

import type {
  SqlFactory,
  FilterInput,
  SortInput,
} from "@dzangolab/fastify-slonik";
import type { QueryResultRow, QuerySqlToken } from "slonik";

/* eslint-disable brace-style */
class InvitationSqlFactory<
    Invitation extends QueryResultRow,
    InvitationCreateInput extends QueryResultRow,
    InvitationUpdateInput extends QueryResultRow
  >
  extends DefaultSqlFactory<
    Invitation,
    InvitationCreateInput,
    InvitationUpdateInput
  >
  implements
    SqlFactory<Invitation, InvitationCreateInput, InvitationUpdateInput>
{
  /* eslint-enabled */
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
    sort?: SortInput[]
  ): QuerySqlToken => {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    const usersTable = createTableFragment(
      this.config.user.table?.name || "users",
      this.schema
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

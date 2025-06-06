import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import { sql } from "slonik";

import { TABLE_INVITATIONS } from "../../constants";
import UserSqlFactory from "../users/sqlFactory";

import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { FragmentSqlToken, QuerySqlToken } from "slonik";

/* eslint-disable brace-style */
class InvitationSqlFactory extends DefaultSqlFactory {
  /* eslint-enabled */
  static readonly TABLE = TABLE_INVITATIONS;

  getFindByTokenSql = (token: string): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.tableFragment}
      WHERE token = ${token};
    `;
  };

  getListSql = (
    limit?: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[],
  ): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      SELECT ${this.tableFragment}.*, ROW_TO_JSON("user") AS "invited_by"
      FROM ${this.tableFragment}
      JOIN ${this.getUserTableFragment()} AS "user" ON ${this.tableFragment}."invited_by_id" = "user"."id"
      ${this.getFilterFragment(filters)}
      ${this.getSortFragment(sort)}
      ${this.getLimitFragment(limit, offset)};
    `;
  };

  getUserTableFragment(): FragmentSqlToken {
    const userSqlFactory = new UserSqlFactory(
      this.config,
      this.database,
      this.schema,
    );

    return userSqlFactory.tableFragment;
  }

  get table() {
    return this.config.user?.tables?.invitations?.name || super.table;
  }
}

export default InvitationSqlFactory;

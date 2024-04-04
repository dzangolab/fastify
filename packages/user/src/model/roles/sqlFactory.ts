import {
  DefaultSqlFactory,
  createLimitFragment,
  createFilterFragment,
  createTableIdentifier,
} from "@dzangolab/fastify-slonik";
import humps from "humps";
import { QueryResultRow, QuerySqlToken, sql } from "slonik";

import { createSortFragment, createSortRoleFragment } from "./sql";

import type { SqlFactory } from "../../types/roles/sqlFactory";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";

/* eslint-disable brace-style */
class RoleSqlFactory<
    Role extends QueryResultRow,
    RoleCreateInput extends QueryResultRow,
    RoleUpdateInput extends QueryResultRow
  >
  extends DefaultSqlFactory<Role, RoleCreateInput, RoleUpdateInput>
  implements SqlFactory<Role, RoleCreateInput, RoleUpdateInput>
{
  /* eslint-enabled */

  getAddRolePermissionSql = (
    roleId: number,
    permissions: string[]
  ): QuerySqlToken => {
    const permissionsTable = createTableIdentifier(
      "role_permissions",
      this.schema
    );

    return sql.type(this.validationSchema)`
      INSERT INTO ${permissionsTable} ("role_id", "permission")
      SELECT *
      FROM ${sql.unnest(
        [permissions.map((permission) => [roleId, permission])],
        ["integer", "varchar"]
      )}
      RETURNING *;
    `;
  };
}

export default RoleSqlFactory;

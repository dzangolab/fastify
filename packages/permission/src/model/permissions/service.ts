import { BaseService } from "@dzangolab/fastify-slonik";

import RoleSqlFactory from "./sqlFactory";
import { TABLE_PERMISSIONS } from "../../constants";

import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class RoleService<
    T extends QueryResultRow,
    C extends QueryResultRow,
    U extends QueryResultRow
  >
  extends BaseService<T, C, U>
  implements Service<T, C, U>
{
  /* eslint-enabled */
  static readonly TABLE = TABLE_PERMISSIONS;

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new RoleSqlFactory<T, C, U>(this);
    }

    return this._factory as RoleSqlFactory<T, C, U>;
  }
}

export default RoleService;

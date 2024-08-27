import { BaseService } from "@dzangolab/fastify-slonik";

import RoleSqlFactory from "./sqlFactory";
import { TABLE_MODEL_ROLES } from "../../constants";

import type { Service, SortInput } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class ModelRolesService<
    T extends QueryResultRow,
    C extends QueryResultRow,
    U extends QueryResultRow
  >
  extends BaseService<T, C, U>
  implements Service<T, C, U>
{
  /* eslint-enabled */
  static readonly TABLE = TABLE_MODEL_ROLES;

  all = async (
    fields: string[],
    sort?: SortInput[]
  ): Promise<Partial<readonly T[]>> => {
    const query = this.factory.getAllSql(fields, sort);

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result as Partial<readonly T[]>;
  };

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

export default ModelRolesService;

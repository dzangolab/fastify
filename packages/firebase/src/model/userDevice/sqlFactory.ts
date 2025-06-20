import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import { QuerySqlToken, sql } from "slonik";

import { TABLE_USER_DEVICES } from "../../constants";

class UserDeviceSqlFactory extends DefaultSqlFactory {
  static readonly TABLE = TABLE_USER_DEVICES;

  getDeleteExistingTokenSql(token: string): QuerySqlToken {
    return sql.type(this.validationSchema)`
      DELETE
      FROM ${this.tableFragment}
      WHERE device_token = ${token}
      RETURNING *;
    `;
  }

  getFindByUserIdSql(userId: string): QuerySqlToken {
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.tableFragment}
      WHERE user_id = ${userId};
    `;
  }

  get table() {
    return this.config.firebase.table?.userDevices?.name || super.table;
  }
}

export default UserDeviceSqlFactory;

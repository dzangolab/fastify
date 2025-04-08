import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import { QuerySqlToken, sql } from "slonik";

import { TABLE_USER_DEVICES } from "../../constants";

class UserDeviceSqlFactory extends DefaultSqlFactory {
  getFindByUserIdSql(userId: string): QuerySqlToken {
    return sql.type(this.validationSchema)`
      SELECT * 
      FROM ${this.getTableFragment()}
      WHERE user_id = ${userId};
    `;
  }

  getDeleteExistingTokenSql(token: string): QuerySqlToken {
    return sql.type(this.validationSchema)`
      DELETE
      FROM ${this.getTableFragment()}
      WHERE device_token = ${token}
      RETURNING *;
    `;
  }

  get table() {
    return this.config.firebase.table?.userDevices?.name || TABLE_USER_DEVICES;
  }
}

export default UserDeviceSqlFactory;

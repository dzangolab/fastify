import { DefaultSqlFactory, SqlFactory } from "@dzangolab/fastify-slonik";
import { QueryResultRow, QuerySqlToken, sql } from "slonik";

class UserDeviceSqlFactory<
    UserDevice extends QueryResultRow,
    UserDeviceCreateInput extends QueryResultRow,
    UserDeviceUpdateInput extends QueryResultRow,
  >
  extends DefaultSqlFactory<
    UserDevice,
    UserDeviceCreateInput,
    UserDeviceUpdateInput
  >
  // eslint-disable-next-line prettier/prettier
implements SqlFactory<UserDevice, UserDeviceCreateInput, UserDeviceUpdateInput> {
  getFindByUserIdSql = (userId: string): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      SELECT * 
      FROM ${this.getTableFragment()}
      WHERE user_id = ${userId};
    `;
  };

  getDeleteExistingTokenSql = (token: string): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      DELETE
      FROM ${this.getTableFragment()}
      WHERE device_token = ${token}
      RETURNING *;
    `;
  };
}

export default UserDeviceSqlFactory;

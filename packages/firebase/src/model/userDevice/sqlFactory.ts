import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import { QueryResultRow, QuerySqlToken, sql } from "slonik";

class UserDeviceSqlFactory<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow,
> extends DefaultSqlFactory<T, C, U> {
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
}

export default UserDeviceSqlFactory;

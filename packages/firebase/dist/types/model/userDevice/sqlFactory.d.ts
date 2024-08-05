import { DefaultSqlFactory, SqlFactory } from "@dzangolab/fastify-slonik";
import { QueryResultRow, QuerySqlToken } from "slonik";
declare class UserDeviceSqlFactory<UserDevice extends QueryResultRow, UserDeviceCreateInput extends QueryResultRow, UserDeviceUpdateInput extends QueryResultRow> extends DefaultSqlFactory<UserDevice, UserDeviceCreateInput, UserDeviceUpdateInput> implements SqlFactory<UserDevice, UserDeviceCreateInput, UserDeviceUpdateInput> {
    getFindByUserIdSql: (userId: string) => QuerySqlToken;
    getDeleteExistingTokenSql: (token: string) => QuerySqlToken;
}
export default UserDeviceSqlFactory;
//# sourceMappingURL=sqlFactory.d.ts.map
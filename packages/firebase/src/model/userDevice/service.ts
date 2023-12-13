import { BaseService, Service } from "@dzangolab/fastify-slonik";
import { QueryResultRow } from "slonik";

import UserDeviceSqlFactory from "./sqlFactory";
import { TABLE_USER_DEVICES } from "../../constants";

class UserDeviceService<
    UserDevice extends QueryResultRow,
    UserDeviceCreateInput extends QueryResultRow,
    UserDeviceUpdateInput extends QueryResultRow
  >
  extends BaseService<UserDevice, UserDeviceCreateInput, UserDeviceUpdateInput>
  // eslint-disable-next-line prettier/prettier
  implements Service<UserDevice, UserDeviceCreateInput, UserDeviceUpdateInput> {
  get table() {
    return TABLE_USER_DEVICES;
  }

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new UserDeviceSqlFactory<
        UserDevice,
        UserDeviceCreateInput,
        UserDeviceUpdateInput
      >(this);
    }

    return this._factory as UserDeviceSqlFactory<
      UserDevice,
      UserDeviceCreateInput,
      UserDeviceUpdateInput
    >;
  }

  create = async (
    data: UserDeviceCreateInput
  ): Promise<UserDevice | undefined> => {
    const { deviceToken } = data;

    const deleteExistingDeviceQuery =
      this.factory.getDeleteUserWithDeviceTokenSql(deviceToken as string);

    await this.database.connect((connection) => {
      return connection.any(deleteExistingDeviceQuery);
    });

    const createQuery = this.factory.getCreateSql(data);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(createQuery);
    });

    return result as UserDevice;
  };

  getUserDeviceByUserId = async (
    userId: string
  ): Promise<UserDevice | undefined> => {
    const query = this.factory.getFindByUserIdSql(userId);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result as UserDevice;
  };
}

export default UserDeviceService;

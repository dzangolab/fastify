import { BaseService, Service } from "@dzangolab/fastify-slonik";

import UserDeviceSqlFactory from "./sqlFactory";
import { TABLE_USER_DEVICES } from "../../constants";

import type { QueryResultRow } from "slonik";

class UserDeviceService<
    UserDevice extends QueryResultRow,
    UserDeviceCreateInput extends QueryResultRow,
    UserDeviceUpdateInput extends QueryResultRow,
  >
  extends BaseService<UserDevice, UserDeviceCreateInput, UserDeviceUpdateInput>
  // eslint-disable-next-line prettier/prettier
  implements Service<UserDevice, UserDeviceCreateInput, UserDeviceUpdateInput> {
  get table() {
    return this.config.firebase.table?.userDevices?.name || TABLE_USER_DEVICES;
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
    data: UserDeviceCreateInput,
  ): Promise<UserDevice | undefined> => {
    const { deviceToken } = data;
    await this.removeByDeviceToken(deviceToken as string);

    const createQuery = this.factory.getCreateSql(data);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(createQuery);
    });

    return result as UserDevice;
  };

  getByUserId = async (userId: string): Promise<UserDevice[] | undefined> => {
    const query = this.factory.getFindByUserIdSql(userId);

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result as UserDevice[];
  };

  removeByDeviceToken = async (
    deviceToken: string,
  ): Promise<UserDevice | undefined> => {
    const query = this.factory.getDeleteExistingTokenSql(deviceToken);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result;
  };
}

export default UserDeviceService;

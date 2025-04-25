import { BaseService } from "@dzangolab/fastify-slonik";

import UserDeviceSqlFactory from "./sqlFactory";
import {
  UserDevice,
  UserDeviceCreateInput,
  UserDeviceUpdateInput,
} from "../../types";

class UserDeviceService extends BaseService<
  UserDevice,
  UserDeviceCreateInput,
  UserDeviceUpdateInput
> {
  async create(data: UserDeviceCreateInput): Promise<UserDevice | undefined> {
    const { deviceToken } = data;

    await this.removeByDeviceToken(deviceToken as string);

    const createQuery = this.factory.getCreateSql(data);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(createQuery);
    });

    return result as UserDevice;
  }

  async getByUserId(userId: string): Promise<UserDevice[] | undefined> {
    const query = this.factory.getFindByUserIdSql(userId);

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result as UserDevice[];
  }

  async removeByDeviceToken(
    deviceToken: string,
  ): Promise<UserDevice | undefined> {
    const query = this.factory.getDeleteExistingTokenSql(deviceToken);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result;
  }

  get factory(): UserDeviceSqlFactory {
    return super.factory as UserDeviceSqlFactory;
  }

  get sqlFactoryClass() {
    return UserDeviceSqlFactory;
  }
}

export default UserDeviceService;

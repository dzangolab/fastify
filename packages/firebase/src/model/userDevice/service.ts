import { BaseService } from "@dzangolab/fastify-slonik";

import UserDeviceSqlFactory from "./sqlFactory";
import { TABLE_USER_DEVICES } from "../../constants";

import type { QueryResultRow } from "slonik";

class UserDeviceService<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow,
> extends BaseService<T, C, U> {
  get table() {
    return this.config.firebase.table?.userDevices?.name || TABLE_USER_DEVICES;
  }

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new UserDeviceSqlFactory<T, C, U>(this);
    }

    return this._factory as UserDeviceSqlFactory<T, C, U>;
  }

  async create(data: C): Promise<T | undefined> {
    const { deviceToken } = data;
    await this.removeByDeviceToken(deviceToken as string);

    const createQuery = this.factory.getCreateSql(data);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(createQuery);
    });

    return result as T;
  }

  async getByUserId(userId: string): Promise<T[] | undefined> {
    const query = this.factory.getFindByUserIdSql(userId);

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result as T[];
  }

  async removeByDeviceToken(deviceToken: string): Promise<T | undefined> {
    const query = this.factory.getDeleteExistingTokenSql(deviceToken);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result;
  }
}

export default UserDeviceService;

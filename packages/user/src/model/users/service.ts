import { BaseService } from "@dzangolab/fastify-slonik";

import UserSqlFactory from "./sqlFactory";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database, Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class UserService<
    UserProfile extends QueryResultRow,
    UserProfileCreateInput extends QueryResultRow,
    UserProfileUpdateInput extends QueryResultRow
  >
  extends BaseService<
    UserProfile,
    UserProfileCreateInput,
    UserProfileUpdateInput
  >
  implements
    Service<UserProfile, UserProfileCreateInput, UserProfileUpdateInput>
{
  /* eslint-enabled */
  static readonly TABLE = "users";
  static readonly LIMIT_DEFAULT = 20;
  static readonly LIMIT_MAX = 50;

  constructor(config: ApiConfig, database: Database, schema?: string) {
    super(config, database, schema);
  }

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new UserSqlFactory<
        UserProfile,
        UserProfileCreateInput,
        UserProfileUpdateInput
      >(this);
    }

    return this._factory as UserSqlFactory<
      UserProfile,
      UserProfileCreateInput,
      UserProfileUpdateInput
    >;
  }
}

export default UserService;

import { BaseService } from "@dzangolab/fastify-slonik";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import UserSqlFactory from "./sqlFactory";
import validatePassword from "../../validator/password";
import userService from "../user-profiles/service";

import type { User, UserCreateInput, UserUpdateInput } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database, Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class UserService<
    User extends QueryResultRow,
    UserCreateInput extends QueryResultRow,
    UserUpdateInput extends QueryResultRow
  >
  extends BaseService<User, UserCreateInput, UserUpdateInput>
  // eslint-disable-next-line prettier/prettier
  implements Service<User, UserCreateInput, UserUpdateInput> {

  constructor(config: ApiConfig, database: Database) {
    super(config, database);
  }

  /* eslint-enabled */
  static readonly LIMIT_DEFAULT = 20;
  static readonly LIMIT_MAX = 50;

  get table() {
    return this.config.user?.table?.name || "users";
  }

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new UserSqlFactory<
        User,
        UserCreateInput,
        UserUpdateInput
      >(this);
    }

    return this._factory as UserSqlFactory<
      User,
      UserCreateInput,
      UserUpdateInput
    >;
  }

  changePassword = async (
    userId: string,
    oldPassword: string,
    newPassword: string
  ) => {
    const passwordValidation = validatePassword(newPassword, this.config);

    if (!passwordValidation.success) {
      return {
        status: "FIELD_ERROR",
        message: passwordValidation.message,
      };
    }

    const userInfo = await ThirdPartyEmailPassword.getUserById(userId);

    if (oldPassword && newPassword) {
      if (userInfo) {
        const isPasswordValid =
          await ThirdPartyEmailPassword.emailPasswordSignIn(
            userInfo.email,
            oldPassword
          );

        if (isPasswordValid.status === "OK") {
          const result = await ThirdPartyEmailPassword.updateEmailOrPassword({
            userId,
            password: newPassword,
          });

          if (result) {
            await Session.revokeAllSessionsForUser(userId);

            return {
              status: "OK",
            };
          } else {
            throw {
              status: "FAILED",
              message: "Oops! Something went wrong, couldn't change password",
            };
          }
        } else {
          return {
            status: "INVALID_PASSWORD",
            message: "Invalid password",
          };
        }
      } else {
        throw {
          status: "NOT_FOUND",
          message: "User not found",
        };
      }
    } else {
      return {
        status: "FIELD_ERROR",
        message: "Password cannot be empty",
      };
    }
  };

  getUserById = async (userId: string) => {
    const user = await ThirdPartyEmailPassword.getUserById(userId);

    const service: userService<
      User & QueryResultRow,
      UserCreateInput,
      UserUpdateInput
    > = new userService(this.config, this.database);

    /* eslint-disable-next-line unicorn/no-null */
    let profile: User | null = null;

    try {
      profile = await service.findById(userId);
    } catch {
      // FIXME [OP 2022-AUG-22] Handle error properly
      // DataIntegrityError
    }

    const roles = await UserRoles.getRolesForUser(userId);

    return {
      email: user?.email,
      id: userId,
      ...profile,
      roles: roles.roles,
      timeJoined: user?.timeJoined,
    };
  };
}

export default UserService;

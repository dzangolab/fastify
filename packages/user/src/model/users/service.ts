import { BaseService, Service } from "@dzangolab/fastify-slonik";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import UsersSqlFactory from "./sqlFactory";
import userProfileService from "../user-profiles/service";

import type {
  UserProfile,
  UserProfileCreateInput,
  UserProfileUpdateInput,
} from "../../types";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class UserService<
    User extends QueryResultRow,
    UserCreateInput extends QueryResultRow,
    UserUpdateInput extends QueryResultRow
  >
  extends BaseService<User, UserCreateInput, UserUpdateInput>
  implements Service<User, UserCreateInput, UserUpdateInput>
{
  /* eslint-enabled */
  static readonly TABLE = "st__all_auth_recipe_users";
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
      this._factory = new UsersSqlFactory<
        User,
        UserCreateInput,
        UserUpdateInput
      >(this);
    }

    return this._factory as UsersSqlFactory<
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
    const userInfo = await ThirdPartyEmailPassword.getUserById(userId);
    const passwordValidationAlphabet = /^(?=.*?[a-z]).{8,}$/;
    const passwordValidationNumber = /^(?=.*?\d).{8,}$/;
    const passwordValidationLength = /^.{8,}$/;

    if (!passwordValidationLength.test(newPassword)) {
      return {
        status: "FIELD_ERROR",
        message: "Password must contain at least 8 characters",
      };
    }

    if (!passwordValidationAlphabet.test(newPassword)) {
      return {
        status: "FIELD_ERROR",
        message: "Password must contain at least one lower case alphabet",
      };
    }

    if (!passwordValidationNumber.test(newPassword)) {
      return {
        status: "FIELD_ERROR",
        message: "Password must contain at least one number",
      };
    }

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

    const service: userProfileService<
      UserProfile & QueryResultRow,
      UserProfileCreateInput,
      UserProfileUpdateInput
    > = new userProfileService(this.config, this.database);

    /* eslint-disable-next-line unicorn/no-null */
    let profile: UserProfile | null = null;

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
      profile: profile,
      roles: roles.roles,
      timeJoined: user?.timeJoined,
    };
  };
}

export default UserService;

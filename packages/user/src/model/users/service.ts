import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import userProfileService from "../user-profiles/service";

import type {
  UserProfile,
  UserProfileCreateInput,
  UserProfileUpdateInput,
} from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";
import validatePassword from "../../utils/validatePassword";

class UserService {
  config: ApiConfig;
  database: Database;
  constructor(config: ApiConfig, database: Database) {
    this.config = config;
    this.database = database;
  }

  changePassword = async (
    userId: string,
    oldPassword: string,
    newPassword: string
  ) => {
    const passwordValidation = validatePassword(newPassword);

    if (!passwordValidation.success) {
      return {
        status: "FIELD_ERROR",
        message: passwordValidation.error.issues[0].message,
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

import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import validatePassword from "../../validator/password";
import userProfileService from "../user-profiles/service";

import type {
  UserProfile,
  UserProfileCreateInput,
  UserProfileUpdateInput,
} from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Tenant } from "@dzangolab/fastify-multi-tenant";
import type { Database } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

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
    newPassword: string,
    tenant?: Tenant
  ) => {
    const passwordValidation = validatePassword(newPassword, this.config);

    if (!passwordValidation.success) {
      return {
        status: "FIELD_ERROR",
        message: passwordValidation.message,
      };
    }

    const userInfo = await ThirdPartyEmailPassword.getUserById(userId, {
      tenant,
    });

    if (oldPassword && newPassword) {
      if (userInfo) {
        const isPasswordValid =
          await ThirdPartyEmailPassword.emailPasswordSignIn(
            userInfo.email,
            oldPassword,
            { tenant }
          );

        if (isPasswordValid.status === "OK") {
          const result = await ThirdPartyEmailPassword.updateEmailOrPassword({
            userId,
            password: newPassword,
            userContext: { tenant },
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

  getUserById = async (userId: string, tenant?: Tenant) => {
    const user = await ThirdPartyEmailPassword.getUserById(userId, { tenant });

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

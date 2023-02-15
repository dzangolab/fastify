import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

import UserProfileService from "../user-profiles/service";

import type {
  UserProfile,
  UserProfileCreateInput,
  UserProfileUpdateInput,
} from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class UserService extends UserProfileService<
  UserProfile & QueryResultRow,
  UserProfileCreateInput,
  UserProfileUpdateInput
> {
  /* eslint-enabled */
  constructor(config: ApiConfig, database: Database, schema?: string) {
    super(config, database, schema);
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
}

export default UserService;

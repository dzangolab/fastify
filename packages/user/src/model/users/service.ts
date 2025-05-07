import { BaseService } from "@dzangolab/fastify-slonik";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

import UserSqlFactory from "./sqlFactory";
import validatePassword from "../../validator/password";

import type { User, UserCreateInput, UserUpdateInput } from "../../types";

class UserService extends BaseService<User, UserCreateInput, UserUpdateInput> {
  async changeEmail(id: string, email: string) {
    const response = await ThirdPartyEmailPassword.updateEmailOrPassword({
      userId: id,
      email: email,
    });

    if (response.status !== "OK") {
      throw new Error(response.status);
    }

    const query = this.factory.getUpdateSql(id, { email });

    return await this.database.connect((connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    });
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
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
            oldPassword,
            { dbSchema: this.schema },
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
  }

  get factory(): UserSqlFactory {
    return super.factory as UserSqlFactory;
  }

  get sqlFactoryClass() {
    return UserSqlFactory;
  }
}

export default UserService;

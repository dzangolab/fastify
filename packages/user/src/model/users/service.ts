import { BaseService } from "@dzangolab/fastify-slonik";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

import UserSqlFactory from "./sqlFactory";
import { TABLE_USERS } from "../../constants";
import validatePassword from "../../validator/password";

import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class UserService<
    User extends QueryResultRow,
    UserCreateInput extends QueryResultRow,
    UserUpdateInput extends QueryResultRow,
  >
  extends BaseService<User, UserCreateInput, UserUpdateInput>
  // eslint-disable-next-line prettier/prettier
  implements Service<User, UserCreateInput, UserUpdateInput> {

  changePassword = async (
    userId: string,
    oldPassword: string,
    newPassword: string,
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
  };

  changeEmail = async (id: string, email: string) => {
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
  };

  get table() {
    return this.config.user?.tables?.users?.name || TABLE_USERS;
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
}

export default UserService;

import { File, FileService, Multipart } from "@dzangolab/fastify-s3";
import { BaseService } from "@dzangolab/fastify-slonik";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

import UserSqlFactory from "./sqlFactory";
import CustomApiError from "../../customApiError";
import validatePassword from "../../validator/password";

import type { User, UserCreateInput, UserUpdateInput } from "../../types";

class UserService extends BaseService<User, UserCreateInput, UserUpdateInput> {
  protected photoPath = "photo";
  protected photoFilename = "photo";

  protected _fileService: FileService | undefined;
  protected _supportedMimeTypes: string[] = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

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

  async deleteMe(userId: string, password: string) {
    const user = await ThirdPartyEmailPassword.getUserById(userId);

    if (!user) {
      throw new CustomApiError({
        message: "User not found",
        name: "NOT_FOUND",
        statusCode: 422,
      });
    }

    if (!password) {
      throw new CustomApiError({
        message: "Invalid password",
        name: "INVALID_PASSWORD",
        statusCode: 422,
      });
    }

    const signInResponse = await ThirdPartyEmailPassword.emailPasswordSignIn(
      user.email,
      password,
      { dbSchema: this.schema },
    );

    if (signInResponse.status === "OK") {
      return await this.delete(userId);
    } else {
      throw new CustomApiError({
        message: "Invalid password",
        name: "INVALID_PASSWORD",
        statusCode: 422,
      });
    }
  }

  async deleteFile(fileId: number): Promise<File | undefined | null> {
    if (!this.bucket) {
      console.warn(
        "S3 bucket for user model is not configured. Skipping file delete.",
      );

      return undefined;
    }

    const result = await this.fileService.deleteFile(fileId, {
      bucket: this.bucket,
    });

    return result;
  }

  async uploadPhoto(
    photo: Multipart,
    userId: string,
    uploadedById: string,
    uploadedAt?: number,
  ): Promise<File | undefined> {
    const filename = this.photoFilename;
    const path = this.getPhotoPath(userId);

    return this.upload(photo, path, filename, uploadedById, uploadedAt);
  }

  get bucket(): string | undefined {
    return this.config.user.s3?.bucket;
  }

  get factory(): UserSqlFactory {
    return super.factory as UserSqlFactory;
  }

  get fileService() {
    if (!this._fileService) {
      this._fileService = new FileService(
        this.config,
        this.database,
        this.schema,
      );
    }

    return this._fileService;
  }

  get sqlFactoryClass() {
    return UserSqlFactory;
  }

  protected async postDelete(result: User): Promise<User> {
    await Session.revokeAllSessionsForUser(result.id);

    return result;
  }

  protected getPhotoPath(userId: string): string {
    return `${userId}/${this.photoPath}`;
  }

  protected async getUserWithPhoto(user: User): Promise<User> {
    if (user.photoId) {
      const file = await this.fileService.presignedUrl(user.photoId, {
        signedUrlExpiresInSecond: 604_800,
      });

      user.photo = {
        id: user.photoId,
        url: file?.url || "",
      };
    }

    return user;
  }

  protected async postFindById(result: User): Promise<User> {
    return await this.getUserWithPhoto(result);
  }

  protected async postFindOne(result: User): Promise<User> {
    return await this.getUserWithPhoto(result);
  }

  protected async postUpdate(result: User): Promise<User> {
    return await this.getUserWithPhoto(result);
  }

  protected async upload(
    data: Multipart,
    path: string,
    filename: string,
    uploadedById: string,
    uploadedAt?: number,
  ): Promise<File | undefined> {
    if (!this.bucket) {
      console.warn(
        "S3 bucket for user model is not configured. Skipping file upload.",
      );

      return undefined;
    }

    if (!this._supportedMimeTypes.includes(data.mimetype)) {
      throw new CustomApiError({
        message: "Unsupported file type for profile picture",
        name: "UNSUPPORTED_FILE_TYPE",
        statusCode: 422,
      });
    }

    this.fileService.filename = filename;

    const file = await this.fileService.upload({
      file: {
        fileContent: data,
        fileFields: {
          uploadedById: uploadedById,
          uploadedAt: uploadedAt || Date.now(),
          bucket: this.bucket,
        },
      },
      options: {
        path,
      },
    });

    return file;
  }
}

export default UserService;

import AWS from "aws-sdk";

import type { ApiConfig } from "@dzangolab/fastify-config";

class s3Client {
  protected _storageClient: AWS.S3;
  protected _config: ApiConfig;
  protected _bucket: string = undefined as unknown as string;

  constructor(config: ApiConfig) {
    this._config = config;
    this._storageClient = this._init();
  }

  get config() {
    return this._config;
  }

  get bucket() {
    return this._bucket;
  }

  set bucket(bucket: string) {
    this._bucket = bucket;
  }

  public async deleteFile(filePath: string): Promise<boolean> {
    const parameters = {
      Bucket: this._config.s3.s3Bucket,
      Key: filePath,
    };

    try {
      await this._storageClient.deleteObject(parameters).promise();

      return true;
    } catch {
      return false;
    }
  }

  public async generatePresignedUrl(
    filePath: string,
    signedUrlExpireInSecond: number
  ): Promise<string | undefined> {
    try {
      const parameters = {
        Bucket: this._config.s3.s3Bucket,
        Key: filePath,
        Expires: signedUrlExpireInSecond,
      };

      const signedUrl = await this._storageClient.getSignedUrlPromise(
        "getObject",
        parameters
      );

      return signedUrl;
    } catch {
      return;
    }
  }

  public async getFile(filePath: string): Promise<AWS.S3.Body | undefined> {
    try {
      const parameters = {
        Bucket: this._config.s3.s3Bucket,
        Key: filePath,
      };

      const response = await this._storageClient
        .getObject(parameters)
        .promise();

      return response.Body;
    } catch {
      return;
    }
  }

  public async uploadFile(
    filePath: string,
    fileStream: AWS.S3.Body,
    mimetype: string
  ): Promise<boolean> {
    const parameters = {
      Bucket: this.config.s3.s3Bucket,
      Key: filePath,
      Body: fileStream,
      ContentType: mimetype,
    } as AWS.S3.Types.PutObjectRequest;

    try {
      await this._storageClient.upload(parameters).promise();

      return true;
    } catch {
      return false;
    }
  }

  public async updateFile(
    filePath: string,
    fileStream: AWS.S3.Body,
    mimetype: string
  ): Promise<boolean> {
    try {
      // First delete the existing file
      await this.deleteFile(filePath);

      // Then upload the updated file
      return await this.uploadFile(filePath, fileStream, mimetype);
    } catch {
      return false;
    }
  }

  protected _init(): AWS.S3 {
    return new AWS.S3({
      credentials: {
        accessKeyId: this.config.s3.s3AccessKey,
        secretAccessKey: this.config.s3.s3SecretKey,
      },
      endpoint: this.config.s3.s3EndPoint,
      s3ForcePathStyle: this.config.s3.s3ForcePathStyle,
      signatureVersion: "v4",
      region: this.config.s3.s3Region,
    });
  }
}

export default s3Client;

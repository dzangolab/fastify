import AWS from "aws-sdk";

import type { File } from "../types/file";
import type { ApiConfig } from "@dzangolab/fastify-config";

class s3Client {
  protected _storageClient: AWS.S3;
  protected _config: ApiConfig;
  protected _bucket: string = undefined as unknown as string;
  protected _file: File = undefined as unknown as File;
  protected _path: string = undefined as unknown as string;
  protected _filename: string = undefined as unknown as string;

  constructor(config: ApiConfig) {
    this._config = config;
    this._storageClient = this.init();
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

  get filename() {
    return this._filename;
  }

  set filename(filename: string) {
    this._filename = filename;
  }

  get path() {
    return this._path;
  }

  set path(path: string) {
    this._path = path;
  }

  get file() {
    return this._file;
  }

  set file(file: File) {
    this._file = file;
  }

  get key() {
    let formattedPath = this.path;

    if (!formattedPath.endsWith("/")) {
      formattedPath += "/";
    }

    return `${formattedPath}${this.filename}`;
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

  public async get(filePath: string): Promise<AWS.S3.Body | undefined> {
    try {
      const parameters = {
        Bucket: this.bucket,
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

  public async upload(
    fileStream: AWS.S3.Body,
    mimetype: string
  ): Promise<boolean> {
    const parameters = {
      Bucket: this.bucket,
      Key: this.key,
      Body: fileStream,
      ContentType: mimetype,
    } as AWS.S3.Types.PutObjectRequest;

    try {
      await this._storageClient.upload(parameters).promise();

      return true;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  }

  protected init(): AWS.S3 {
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

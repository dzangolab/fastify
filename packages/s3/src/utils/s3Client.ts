import AWS from "aws-sdk";

import type { ApiConfig } from "@dzangolab/fastify-config";

class s3Client {
  protected _bucket: string = undefined as unknown as string;
  protected _config: ApiConfig;
  protected _storageClient: AWS.S3;

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

  public async generatePresignedUrl(
    filePath: string,
    originalFileName: string,
    signedUrlExpiresInSecond = 3600
  ): Promise<string | undefined> {
    const parameters = {
      Bucket: this.bucket,
      Key: filePath,
      Expires: signedUrlExpiresInSecond,
      ResponseContentDisposition: `attachment; filename="${originalFileName}"`,
    };

    return await this._storageClient.getSignedUrlPromise(
      "getObject",
      parameters
    );
  }

  public async get(
    filePath: string
  ): Promise<AWS.S3.GetObjectOutput | undefined> {
    const parameters = {
      Bucket: this.bucket,
      Key: filePath,
    };

    return this._storageClient.getObject(parameters).promise();
  }

  public async upload(
    fileStream: AWS.S3.Body,
    key: string,
    mimetype: string
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const parameters = {
      Bucket: this.bucket,
      Key: key,
      Body: fileStream,
      ContentType: mimetype,
    } as AWS.S3.Types.PutObjectRequest;

    return this._storageClient.upload(parameters).promise();
  }

  protected init(): AWS.S3 {
    return new AWS.S3({
      credentials: {
        accessKeyId: this.config.s3.accessKey,
        secretAccessKey: this.config.s3.secretKey,
      },
      endpoint: this.config.s3.endPoint,
      s3ForcePathStyle: this.config.s3.forcePathStyle,
      region: this.config.s3.region,
    });
  }
}

export default s3Client;

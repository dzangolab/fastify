import { Readable } from "node:stream";

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  PutObjectCommandOutput,
  GetObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import type { ApiConfig } from "@dzangolab/fastify-config";

class s3Client {
  protected _bucket: string = undefined as unknown as string;
  protected _config: ApiConfig;
  protected _storageClient: S3Client;

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
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: filePath,
      ResponseContentDisposition: `attachment; filename="${originalFileName}"`,
    });

    return await getSignedUrl(this._storageClient, command, {
      expiresIn: signedUrlExpiresInSecond,
    });
  }

  public async get(filePath: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: filePath,
    });

    const response = await this._storageClient.send(command);

    const stream: Readable = response.Body as Readable;

    const streamValue = await this.readStream(stream);

    return {
      ContentType: response.ContentType,
      Body: streamValue,
    };
  }

  public async upload(
    fileStream: Buffer,
    key: string,
    mimetype: string
  ): Promise<PutObjectCommandOutput> {
    const putCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: fileStream,
      ContentType: mimetype,
    });

    const headObjectResponse = await this.getFileInBucket(key);

    if (headObjectResponse) {
      throw new Error("File already exists in S3.");
    }

    return await this._storageClient.send(putCommand);
  }

  public async getFileInBucket(
    key: string
  ): Promise<HeadObjectCommandOutput | null> {
    const headObjectCommand = new HeadObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await this._storageClient.send(headObjectCommand);
  }

  protected init(): S3Client {
    return new S3Client({
      credentials: {
        accessKeyId: this.config.s3.accessKey,
        secretAccessKey: this.config.s3.secretKey,
      },
      endpoint: this.config.s3.endPoint,
      forcePathStyle: this.config.s3.forcePathStyle,
      region: this.config.s3.region,
    });
  }

  private async readStream(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];

      // Process incoming data chunks
      stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));

      // Resolve with concatenated buffer when stream ends
      stream.once("end", () => resolve(Buffer.concat(chunks)));

      // Reject the promise if there's an error with the stream
      stream.once("error", reject);
    });
  }
}

export default s3Client;

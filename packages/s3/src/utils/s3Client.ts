import { Readable } from "node:stream";

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  PutObjectCommandOutput,
  ListObjectsCommand,
  ListObjectsCommandOutput,
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

  /**
   * Generates a presigned URL for downloading a file from the specified S3 bucket.
   *
   * @param {string} filePath - The path or key of the file in the bucket.
   * @param {string} originalFileName - The name to be used when downloading the file.
   * @param {number} signedUrlExpiresInSecond - (Optional) The expiration time of the presigned URL in seconds (default: 3600 seconds).
   * @returns {Promise<string | undefined>} A Promise that resolves with the generated presigned URL or undefined if an error occurs.
   */
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

  /**
   * Retrieves a file from the specified S3 bucket.
   *
   * @param {string} filePath - The path or key of the file to retrieve from the bucket.
   * @returns {Promise<{ ContentType: string, Body: Buffer }>} A Promise that resolves with the retrieved file's content type and content as a Buffer.
   */
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

  /**
   * Uploads a file to the specified S3 bucket.
   *
   * @param {Buffer} fileStream - The file content as a Buffer.
   * @param {string} key - The key (file name) to use when storing the file in the bucket.
   * @param {string} mimetype - The MIME type of the file.
   * @returns {Promise<PutObjectCommandOutput>} A Promise that resolves with information about the uploaded object.
   */
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

    return await this._storageClient.send(putCommand);
  }

  /**
   * Checks if a file with the given key exists in the S3 bucket.
   * @param key - The key (combination of path & file name) to check for in the bucket.
   * @returns Promise<boolean> - True if the file exists; otherwise, false.
   */
  public async isFileExists(key: string): Promise<boolean> {
    try {
      const headObjectCommand = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this._storageClient.send(headObjectCommand);

      return !!response;
    } catch (error: any) {
      if (error.name === "NotFound") {
        return false;
      }

      throw error;
    }
  }

  /**
   * Retrieves a list of objects from the S3 bucket with a specified prefix.
   *
   * @param {string} baseName - The prefix used to filter objects within the S3 bucket.
   * @returns {Promise<ListObjectsCommandOutput>} A Promise that resolves to the result of the list operation.
   */
  public async getObjects(baseName: string): Promise<ListObjectsCommandOutput> {
    return await this._storageClient.send(
      new ListObjectsCommand({
        Bucket: this.bucket,
        Prefix: baseName,
      })
    );
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

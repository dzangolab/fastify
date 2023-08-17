import AWS from "aws-sdk";

import { envS3Client } from "./envS3Client";

import type { ApiConfig } from "@dzangolab/fastify-config";

export class s3Client {
  private storageClient: AWS.S3;
  private envS3Client;

  constructor(apiConfig: ApiConfig) {
    this.envS3Client = new envS3Client(apiConfig);
    this.storageClient = this.initializeStorageClient();
  }

  public async generatePresignedUrl(
    filePath: string,
    signedUrlExpireInSecond: number
  ): Promise<string | undefined> {
    try {
      const parameters = {
        Bucket: this.envS3Client.getBucket(),
        Key: filePath,
        Expires: signedUrlExpireInSecond,
      };

      const signedUrl = await this.storageClient.getSignedUrlPromise(
        "getObject",
        parameters
      );

      return signedUrl;
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
      Bucket: this.envS3Client.getBucket(),
      Key: filePath,
      Body: fileStream,
      ContentType: mimetype,
    } as AWS.S3.Types.PutObjectRequest;

    try {
      await this.storageClient.upload(parameters).promise();

      return true;
    } catch {
      return false;
    }
  }

  private initializeStorageClient(): AWS.S3 {
    return new AWS.S3({
      credentials: {
        accessKeyId: this.envS3Client.getAccessKey(),
        secretAccessKey: this.envS3Client.getSecretKey(),
      },
      endpoint: this.envS3Client.getEndPoint(),
      s3ForcePathStyle: this.envS3Client.getS3ForcePathStyle(),
      signatureVersion: "v4",
      region: this.envS3Client.getRegion(),
    });
  }
}

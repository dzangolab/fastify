import type { ApiConfig } from "@dzangolab/fastify-config";

export class envS3Client {
  private endPoint: string;
  private accessKey: string;
  private secretKey: string;
  private bucket: string;
  private region: string;
  private s3ForcePathStyle: boolean;

  constructor(apiConfig: ApiConfig) {
    this.endPoint = apiConfig.s3.config.endPoint as string;
    this.accessKey = apiConfig.s3.config.accessKey as string;
    this.secretKey = apiConfig.s3.config.secretKey as string;
    this.bucket = apiConfig.s3.config.bucket as string;
    this.region = apiConfig.s3.config.region as string;
    this.s3ForcePathStyle = apiConfig.s3.config.s3ForcePathStyle === true;
  }

  getAccessKey(): string {
    return this.accessKey;
  }

  getSecretKey(): string {
    return this.secretKey;
  }

  getEndPoint(): string {
    return this.endPoint;
  }

  getS3ForcePathStyle(): boolean {
    return this.s3ForcePathStyle;
  }

  getRegion(): string {
    return this.region;
  }

  getBucket(): string {
    return this.bucket;
  }
}

import type { ApiConfig } from "@dzangolab/fastify-config";

export class envS3Client {
  private endPoint: string;
  private accessKey: string;
  private secretKey: string;
  private bucket: string;
  private region: string;
  private s3ForcePathStyle: boolean;

  constructor(apiConfig: ApiConfig) {
    this.endPoint = apiConfig.s3.config.endPoint || "";
    this.accessKey = apiConfig.s3.config.accessKey || "";
    this.secretKey = apiConfig.s3.config.secretKey || "";
    this.bucket = apiConfig.s3.config.bucket || "";
    this.region = apiConfig.s3.config.region || "";
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

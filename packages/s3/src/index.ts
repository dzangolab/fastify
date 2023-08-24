declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    s3: {
      s3EndPoint?: string;
      s3AccessKey: string;
      s3SecretKey: string;
      s3Region: string;
      s3ForcePathStyle?: boolean;
      table?: {
        name?: string;
      };
    };
  }
}

export { default as FileService } from "./model/files/service";
export { default as S3Client } from "./utils/s3Client";
export type { FilePayload, MultipartBody } from "./types";
export type { File, FileCreateInput, FileUpdateInput } from "./types/file";

export { default } from "./plugin";

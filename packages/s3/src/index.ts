declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    s3: {
      accessKey: string;
      endPoint?: string;
      forcePathStyle?: boolean;
      secretKey: string;
      region: string;
      table?: {
        name?: string;
      };
    };
  }
}

export { default as FileService } from "./model/files/service";
export { default as S3Client } from "./utils/s3Client";
export type { FilePayload, Multipart } from "./types";
export type { File, FileCreateInput, FileUpdateInput } from "./types/file";

export { default } from "./plugin";

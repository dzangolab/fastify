import type { ServerResponse } from "node:http";

declare module "fastify" {
  interface FastifyReply {
    setHeader: ServerResponse["setHeader"];
  }
}

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    s3: {
      table?: {
        name?: string;
      };
      s3EndPoint: string;
      s3AccessKey: string;
      s3SecretKey: string;
      s3Bucket?: string;
      s3Region: string;
      s3ForcePathStyle: boolean;
    };
  }
}

export { default as FileService } from "./model/files/service";
export { default as S3Client } from "./utils/s3Client";
export type { FileUploadType } from "./types";
export type { File, FileCreateInput, FileUpdateInput } from "./types/file";

export { default } from "./plugin";

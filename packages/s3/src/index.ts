import type { FilenameResolutionStrategy } from "./types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { GraphqlEnabledPlugin } from "@dzangolab/fastify-graphql";

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    s3: {
      accessKey: string;
      bucket: string | Record<string, string>;
      endPoint?: string;
      fileSizeLimitInBytes?: number;
      filenameResolutionStrategy?: FilenameResolutionStrategy;
      forcePathStyle?: boolean;
      secretKey: string;
      region?: string;
      table?: {
        name?: string;
      };
    };
  }
}

export * from "./constants";

export { default as FileService } from "./model/files/service";
export { default as S3Client } from "./utils/s3Client";
export type { FilePayload, Multipart } from "./types";
export type { File, FileCreateInput, FileUpdateInput } from "./types/file";
export type { FileUpload as GraphQLFileUpload } from "graphql-upload-minimal";

export { default } from "./plugin";
export { default as ajvFilePlugin } from "./plugins/ajvFile";
export { default as multipartParserPlugin } from "./plugins/multipartParser";

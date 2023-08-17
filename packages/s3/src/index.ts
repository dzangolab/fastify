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
      config: {
        endPoint: string;
        accessKey: string;
        secretKey: string;
        bucket: string;
        region: string;
        s3ForcePathStyle: boolean;
      };
    };
  }
}

export { default as FileService } from "./model/files/service";
export type { File, FileCreateInput, FileUpdateInput } from "./types";

export { default } from "./plugin";

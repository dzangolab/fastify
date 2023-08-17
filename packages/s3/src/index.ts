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
    };
  }
}

export { default as FileService } from "./model/files/service";
export type { File, FileCreateInput, FileUpdateInput } from "./types";

export { default } from "./plugin";

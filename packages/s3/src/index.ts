import type { ServerResponse } from "node:http";

declare module "fastify" {
  interface FastifyReply {
    setHeader: ServerResponse["setHeader"];
  }
}

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    file: null;
  }
}

export { default as FileService } from "./model/files/service";
// [DU 2023-AUG-07] use formatDate from  "@dzangolab/fastify-slonik" package
export { formatDate } from "@dzangolab/fastify-slonik";

export type { File, FileCreateInput, FileUpdateInput } from "./types";

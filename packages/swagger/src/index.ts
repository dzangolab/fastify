declare module "fastify" {
  interface FastifyInstance {
    apiDocumentationPath: string | undefined;
  }
}

export { default } from "./plugin";

export type * from "./types";

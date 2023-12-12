import "@dzangolab/fastify-mercurius";
import { verifySession } from "supertokens-node/recipe/session/framework/fastify";

declare module "fastify" {
  interface FastifyInstance {
    verifySession: typeof verifySession;
  }
}

declare module "mercurius" {
  interface MercuriusContext {
    user: any;
  }
}

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    firebase?: {
      projectId: string;
      privateKey: string;
      clientEmail: string;
    };
  }
}

export { default } from "./plugin";

export { default as deviceResolver } from "./model/device/resolver";
export { default as deviceRoutes } from "./model/device/controller";
export * from "./lib";

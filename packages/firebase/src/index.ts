import "@dzangolab/fastify-mercurius";
import { verifySession } from "supertokens-node/recipe/session/framework/fastify";

import deviceHandlers from "./model/userDevice/handlers";
import { User } from "./types";

declare module "fastify" {
  interface FastifyInstance {
    verifySession: typeof verifySession;
  }
}

declare module "mercurius" {
  interface MercuriusContext {
    user: User;
  }
}

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    firebase?: {
      projectId: string;
      privateKey: string;
      clientEmail: string;
      table?: {
        userDevices?: {
          name: string;
        };
      };
    };
    handlers?: {
      userDevice?: {
        addUserDevice?: typeof deviceHandlers.addUserDevice;
      };
    };
  }
}

export { default } from "./plugin";

export { default as deviceResolver } from "./model/userDevice/resolver";
export { default as deviceRoutes } from "./model/userDevice/controller";
export { default as DeviceService } from "./model/userDevice/service";
export * from "./lib";

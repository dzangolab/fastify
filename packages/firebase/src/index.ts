import { verifySession } from "supertokens-node/recipe/session/framework/fastify";

import type { FirebaseConfig, User } from "./types";

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
    firebase: FirebaseConfig;
  }
}

export { default } from "./plugin";

export { default as notificationRoutes } from "./model/notification/controller";
export { default as notificationResolver } from "./model/notification/resolver";

export { default as userDeviceResolver } from "./model/userDevice/resolver";
export { default as userDeviceRoutes } from "./model/userDevice/controller";
export { default as UserDeviceService } from "./model/userDevice/service";
export { default as firebaseSchema } from "./graphql/schema";

export * from "./lib";

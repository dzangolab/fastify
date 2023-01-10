import "@dzangolab/fastify-mercurius";

import { verifySession } from "supertokens-node/recipe/session/framework/fastify";

declare module "fastify" {
  interface FastifyInstance {
    verifySession: typeof verifySession;
  }
}

export { default } from "./plugin";

export type { User, UserInput } from "./types";

export { default as userResolver } from "./model/users/resolver";
export { default as userService } from "./model/users/service";

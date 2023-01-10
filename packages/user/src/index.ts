import "@dzangolab/fastify-mercurius";

import { verifySession } from "supertokens-node/recipe/session/framework/fastify";

declare module "fastify" {
  interface FastifyInstance {
    verifySession: typeof verifySession;
  }
}

export type { User, UserInput } from "./types";

export { default } from "./users/controller";
export { default as userResolver } from "./users/resolver";
export { default as userService } from "./users/service";

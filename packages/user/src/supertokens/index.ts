import Session from "supertokens-node/lib/build/recipe/session/sessionClass";
import { verifySession } from "supertokens-node/recipe/session/framework/fastify";

declare module "fastify" {
  interface FastifyInstance {
    verifySession: typeof verifySession;
  }

  interface FastifyRequest {
    session?: Session;
  }
}

export { default } from "./plugin";

export type { SupertokensConfig } from "./types";

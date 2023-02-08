import "@dzangolab/fastify-mercurius";

import { verifySession } from "supertokens-node/recipe/session/framework/fastify";

declare module "fastify" {
  interface FastifyInstance {
    verifySession: typeof verifySession;
  }
}

export { default } from "./plugin";

export type {
  UserProfile,
  UserProfileCreateInput,
  UserProfileUpdateInput,
} from "./types";

export { default as userProfileResolver } from "./model/user-profile/resolver";
export { default as userProfileService } from "./model/user-profile/service";
export { default as userProfileRoutes } from "./model/user-profile/controller";

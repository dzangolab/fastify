import { verifySession } from "supertokens-node/recipe/session/framework/fastify";
import organizationsHandlers from "./model/organizations/handlers";
import type { User } from "./types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
declare module "fastify" {
    interface FastifyInstance {
        verifySession: typeof verifySession;
    }
}
declare module "mercurius" {
    interface MercuriusContext {
        user: User;
        config: ApiConfig;
        database: Database;
    }
}
declare module "@dzangolab/fastify-config" {
    interface ApiConfig {
        organization?: {
            handlers?: {
                organization?: {
                    create?: typeof organizationsHandlers.createOrganization;
                    delete?: typeof organizationsHandlers.deleteOrganization;
                    list?: typeof organizationsHandlers.listOrganization;
                    organization?: typeof organizationsHandlers.organization;
                    update?: typeof organizationsHandlers.updateOrganization;
                };
            };
        };
    }
}
export { default as organizationRoutes } from "./model/organizations/controller";
export { default as organizationResolver } from "./model/organizations/resolver";
export { default as organizationSchema } from "./model/organizations/schema";
export { default as organizationService } from "./model/organizations/service";
export { default } from "./plugin";
//# sourceMappingURL=index.d.ts.map
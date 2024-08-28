import type { GraphqlEnabledPlugin } from "../../types";
declare module "mercurius" {
    interface MercuriusContext {
        propertyOne: string;
    }
}
declare module "fastify" {
    interface FastifyInstance {
        propertyOne: string;
    }
}
declare const plugin: GraphqlEnabledPlugin;
export default plugin;
//# sourceMappingURL=testPluginAsync.d.ts.map
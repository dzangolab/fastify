import type { MercuriusEnabledPlugin } from "../../types";
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
declare const plugin: MercuriusEnabledPlugin;
export default plugin;
//# sourceMappingURL=testPluginAsync.d.ts.map
import type { MercuriusEnabledPlugin } from "../../types";
declare module "mercurius" {
    interface MercuriusContext {
        propertyTwo: string;
    }
}
declare module "fastify" {
    interface FastifyInstance {
        propertyTwo: string;
    }
}
declare const plugin: MercuriusEnabledPlugin;
export default plugin;
//# sourceMappingURL=testPlugin.d.ts.map
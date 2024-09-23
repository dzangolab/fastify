import type { FastifyMailer, MailerConfig } from "./types";
declare module "fastify" {
    interface FastifyInstance {
        mailer: FastifyMailer;
    }
}
declare module "@dzangolab/fastify-config" {
    interface ApiConfig {
        /**
         * @deprecated Pass mailer config directly to the plugin.
         */
        mailer?: MailerConfig;
    }
}
export { default } from "./plugin";
export type { FastifyMailer, FastifyMailerNamedInstance, MailerConfig, } from "./types";
//# sourceMappingURL=index.d.ts.map
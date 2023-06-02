import type { FastifyMailer, MailerConfig } from "./types";
declare module "fastify" {
    interface FastifyInstance {
        mailer: FastifyMailer;
    }
    interface FastifyRequest {
        mailer: FastifyMailer;
    }
}
declare module "@dzangolab/fastify-config" {
    interface ApiConfig {
        mailer: MailerConfig;
    }
}
declare module "mercurius" {
    interface MercuriusContext {
        mailer?: FastifyMailer;
    }
}
export { default } from "./plugin";
export type { FastifyMailer, FastifyMailerNamedInstance, MailerConfig, } from "./types";
//# sourceMappingURL=index.d.ts.map
import type { MailerConfig } from "./types";
import type { Transporter } from "nodemailer";
export interface FastifyMailerNamedInstance {
    [namespace: string]: Transporter;
}
export type FastifyMailer = FastifyMailerNamedInstance & Transporter;
declare module "fastify" {
    interface FastifyInstance {
        mailer: FastifyMailer;
    }
}
declare module "@dzangolab/fastify-config" {
    interface ApiConfig {
        mailer: MailerConfig;
    }
}
export { default } from "./plugin";
export type { MailerConfig } from "./types";
//# sourceMappingURL=index.d.ts.map
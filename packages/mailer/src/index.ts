import type { FastifyMailer, MailerConfig } from "./types";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { ApiConfig } from "@dzangolab/fastify-config";

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

export type {
  FastifyMailer,
  FastifyMailerNamedInstance,
  MailerConfig,
} from "./types";

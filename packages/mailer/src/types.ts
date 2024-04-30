import type { Transporter } from "nodemailer";
import type { Options } from "nodemailer/lib/mailer/";
import type { Options as SMTPOptions } from "nodemailer/lib/smtp-transport";
import type { IPluginOptions } from "nodemailer-mjml";

interface MailerConfig {
  defaults: Partial<Options> & {
    from: {
      address: string;
      name: string;
    };
  };
  /**
   * This is mailer interceptor.
   * Any email send from the app will be forward to theses addresses.
   * This is only for development and testing.
   */
  recipients?: string[];
  templating: IPluginOptions;
  templateData?: Record<never, never>;
  test?: {
    enabled: boolean;
    path: string;
    to: string;
  };
  transport: SMTPOptions;
}

interface FastifyMailerNamedInstance {
  [namespace: string]: Transporter;
}

type FastifyMailer = FastifyMailerNamedInstance & Transporter;

export type { FastifyMailerNamedInstance, FastifyMailer, MailerConfig };

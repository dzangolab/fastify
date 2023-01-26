import type { IPluginOptions } from "nodemailer-mjml";
import type { Options } from "nodemailer/lib/mailer/";
import type { Options as SMTPOptions } from "nodemailer/lib/smtp-transport";

interface MailerConfig {
  defaults: Partial<Options> & {
    from: {
      address: string;
      name: string;
    };
  };
  test?: {
    enabled: boolean;
    path: string;
    to: string;
  };
  templating: IPluginOptions;
  templateData?: Record<never, never>;
  transport: SMTPOptions;
}

export type { MailerConfig };

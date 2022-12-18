import type { IPluginOptions } from "nodemailer-mjml";

interface MailerConfig {
  defaults: Record<string, unknown> & {
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
  transport: Record<string, unknown> & {
    auth:
      | false
      | {
          pass: string;
          user: string;
        };
    host: string;
    port: number;
    secure: boolean;
  };
}

export type { MailerConfig };

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
     * Any email sent from the API will be directed to these addresses.
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
//# sourceMappingURL=types.d.ts.map
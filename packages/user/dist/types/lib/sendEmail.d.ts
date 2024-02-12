import "@dzangolab/fastify-mailer";
import type { FastifyInstance } from "fastify";
declare const sendEmail: ({ fastify, subject, templateData, templateName, to, }: {
    fastify: FastifyInstance;
    subject: string;
    templateData?: Record<string, string> | undefined;
    templateName: string;
    to: string;
}) => Promise<any>;
export default sendEmail;
//# sourceMappingURL=sendEmail.d.ts.map
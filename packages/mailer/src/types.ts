interface MailerConfig {
  defaults: {
    bcc?: string;
    cc?: string;
    from?: string;
    replyTo?: string;
    sender?: string;
  };
  namespace?: string;
  transport: {
    auth: {
      pass: string;
      type?: string;
      user: string;
    };
    authMethod?: string;
    host: string;
    ignoreTLS?: boolean;
    port?: number;
    requireTLS?: boolean;
    secure: boolean;
    tls?: {
      rejectUnauthorized?: boolean;
    };
  };
}

export type { MailerConfig };

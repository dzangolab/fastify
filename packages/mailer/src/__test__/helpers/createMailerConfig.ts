const createMailerConfig = () => {
  return {
    mailer: {
      defaults: {
        from: {
          address: "monorepo@dzangolab.com",
          name: "Dzangolab Monorepo Team",
        },
      },
      test: { enabled: true, path: "/test/email", to: "test@dzangolab.com" },
      templating: { templateFolder: "mjml/templates" },
      templateData: { baseCDNUrl: "http://localhost:20075/" },
      transport: {
        auth: { pass: "pass", user: "user" },
        host: "localhost",
        port: 20073,
        requireTLS: false,
        secure: false,
      },
    },
  };
};

export default createMailerConfig;

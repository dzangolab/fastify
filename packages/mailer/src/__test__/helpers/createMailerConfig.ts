const createMailerConfig = () => {
  return {
    mailer: {
      defaults: {
        from: {
          address: "sender@example.com",
          name: "Mailer Team",
        },
      },
      test: { enabled: true, path: "/test/email", to: "receiver@example.com" },
      templating: { templateFolder: "mjml/templates" },
      templateData: { exampleUrl: "http://localhost:2000/" },
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

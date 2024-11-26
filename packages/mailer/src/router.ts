import mjml2html from "mjml";

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const router = async (
  fastify: FastifyInstance,
  options: {
    path: string;
    to: string;
  },
) => {
  const { path, to } = options;

  fastify.get(path, (request: FastifyRequest, reply: FastifyReply) => {
    const { mailer } = fastify;

    const html = mjml2html(
      `<mjml>
        <mj-head>
          <mj-attributes>
            <mj-text align="center" color="#555" />
          </mj-attributes>
        </mj-head>
        <mj-body background-color="#eee">
          <mj-section background-color="#fff">
            <mj-column>
              <mj-text align="center">
                <h2>@dzangolab/fastify-mailer</h2>
              </mj-text>
              <mj-text>If you receive this email, then the mail functionality in your Fastify server is enabled and working correctly.</mj-text>
            </mj-column>  
          </mj-section>
        </mj-body>
      </mjml>`,
    );

    mailer.sendMail(
      {
        html: html.html,
        subject: "test email",
        to,
      },
      (error: unknown, info: { from: unknown; to: unknown }) => {
        if (error) {
          /* eslint-disable-next-line unicorn/consistent-destructuring */
          fastify.log.error(error);

          reply.status(500);

          return reply.send({
            statusCode: 500,
            status: "ERROR",
            message: "Something went wrong",
            error,
          });
        }

        reply.status(200);

        reply.send({
          status: "ok",
          message: "Email successfully sent",
          info,
        });
      },
    );
  });
};

export default router;

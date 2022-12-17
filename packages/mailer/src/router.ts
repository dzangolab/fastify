import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const router = async (
  fastify: FastifyInstance,
  options: {
    path: string;
    to: string;
  }
) => {
  const { path, to } = options;

  fastify.get(path, (request: FastifyRequest, reply: FastifyReply) => {
    const { mailer } = fastify;

    mailer.sendMail(
      {
        to,
        subject: "test email",
        text: "If you receive this email, then the mail functionality in your Fastify server is enabled and working correctly.",
      },
      (error: unknown, info: { from: unknown; to: unknown }) => {
        if (error) {
          /* eslint-disable-next-line unicorn/consistent-destructuring */
          fastify.log.error(error);

          reply.status(500);

          reply.send({
            status: "error",
            message: "Something went wrong",
            error,
          });
        }

        console.log("ok");

        reply.status(200);

        reply.send({
          status: "ok",
          message: "Email successfully sent",
          info,
        });
      }
    );
  });
};

export default router;

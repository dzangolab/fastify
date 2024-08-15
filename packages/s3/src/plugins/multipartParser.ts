import fastifyPlugin from "fastify-plugin";

import { processMultipartFormData } from "../utils";

import type { FastifyInstance, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    graphqlFileUploadMultipart?: boolean;
  }
}

const plugin = (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  if (!fastify.hasContentTypeParser("multipart")) {
    fastify.addContentTypeParser("multipart", (req, _payload, done) => {
      if (
        req.config.graphql?.enabled &&
        req.routerPath.startsWith(req.config.graphql.path as string)
      ) {
        req.graphqlFileUploadMultipart = true;

        // eslint-disable-next-line unicorn/no-null
        done(null);
      } else {
        processMultipartFormData(req, _payload, done);
      }
    });
  }

  done();
};

export default fastifyPlugin(plugin);

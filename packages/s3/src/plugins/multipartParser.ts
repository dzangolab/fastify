import fastifyPlugin from "fastify-plugin";

import { processMultipartFormData } from "../utils";

import type { FastifyInstance } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    mercuriusUploadMultipart?: boolean;
  }
}

const plugin = (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  if (!fastify.hasContentTypeParser("multipart")) {
    fastify.addContentTypeParser("multipart", (request, _payload, done) => {
      if (
        request.config.graphql?.enabled &&
        request.routerPath.startsWith(request.config.graphql.path as string)
      ) {
        request.mercuriusUploadMultipart = true;

        // eslint-disable-next-line unicorn/no-null
        done(null);
      } else {
        processMultipartFormData(request, _payload, done);
      }
    });
  }

  done();
};

export default fastifyPlugin(plugin);

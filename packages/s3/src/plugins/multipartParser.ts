import fastifyPlugin from "fastify-plugin";

import { processMultipartFormData } from "../utils";

import type { FastifyInstance } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    graphqlFileUploadMultipart?: boolean;
  }
}

const plugin = async (fastify: FastifyInstance) => {
  if (!fastify.hasContentTypeParser("multipart")) {
    fastify.addContentTypeParser("multipart", (req, _payload, done) => {
      if (
        req.config.graphql?.enabled &&
        req.routeOptions.url?.startsWith(req.config.graphql.path as string)
      ) {
        req.graphqlFileUploadMultipart = true;

        // eslint-disable-next-line unicorn/no-null
        done(null);
      } else {
        processMultipartFormData(req, _payload, done);
      }
    });
  }
};

export default fastifyPlugin(plugin);

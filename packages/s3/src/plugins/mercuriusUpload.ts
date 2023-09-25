import fastifyPlugin from "fastify-plugin";
import { processRequest, UploadOptions } from "graphql-upload-minimal";

import type { FastifyPluginCallback } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    mercuriusUploadMultipart?: boolean;
  }
}

const plugin: FastifyPluginCallback<UploadOptions> = (
  fastify,
  options,
  done
) => {
  if (!fastify.hasContentTypeParser("multipart")) {
    fastify.addContentTypeParser("multipart", (req, _payload, done) => {
      req.mercuriusUploadMultipart = true;

      // eslint-disable-next-line unicorn/no-null
      done(null);
    });
  }

  fastify.addHook("preValidation", async (request, reply) => {
    if (!request.mercuriusUploadMultipart) {
      return;
    }

    request.body = await processRequest(request.raw, reply.raw, options);
  });

  done();
};

export const mercuriusUpload = fastifyPlugin(plugin, {
  fastify: ">= 4.x",
  name: "mercurius-upload",
});

export default mercuriusUpload;

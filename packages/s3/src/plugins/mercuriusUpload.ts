import { IncomingMessage } from "node:http";
import stream from "node:stream";
import * as util from "node:util";

import Busboy from "busboy";
import fp from "fastify-plugin";
import { processRequest, UploadOptions } from "graphql-upload-minimal";

import type { FastifyPluginCallback, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    mercuriusUploadMultipart?: boolean;
  }
}

const mercuriusGQLUpload: FastifyPluginCallback<UploadOptions> = (
  fastify,
  options,
  done
) => {
  if (!fastify.hasContentTypeParser("multipart")) {
    fastify.addContentTypeParser("multipart", (req, _payload, done) => {
      if (req.routerPath.startsWith(fastify.config.mercurius.path as string)) {
        req.mercuriusUploadMultipart = true;

        // eslint-disable-next-line unicorn/no-null
        done(null);
      } else {
        parseRestMultipartContent(req, _payload, done);
      }
    });
  }

  fastify.addHook("preValidation", async function (request, reply) {
    if (!request.mercuriusUploadMultipart) {
      return;
    }

    request.body = await processRequest(request.raw, reply.raw, options);
  });

  fastify.addHook("onSend", async function (request) {
    if (!request.mercuriusUploadMultipart) {
      return;
    }

    const finishedStream = util.promisify(stream.finished);

    await finishedStream(request.raw);
  });

  done();
};

const parseRestMultipartContent = (
  req: FastifyRequest,
  _payload: IncomingMessage,
  done: (err: Error | null, body?: any) => void
) => {
  const busboyParser = Busboy({
    headers: {
      ...req.headers,
      "content-type": req.headers["content-type"],
    },
  });

  // Objects to store parsed data
  const fields: Record<string, string> = {};
  const files: Record<string, any> = {};

  // Listen for form field data
  busboyParser.on("field", (fieldname, value) => {
    fields[fieldname] = value;
  });

  // Listen for file data
  busboyParser.on(
    "file",
    (
      fieldname: string | number,
      file: any,
      filename: any,
      encoding: any,
      mimetype: any
    ) => {
      const chunks: Buffer[] = [];

      file.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      file.on("end", () => {
        // Concatenate all chunks into a single buffer
        const fileBuffer = Buffer.concat(chunks);

        // Create an array of files for the fieldname
        if (!files[fieldname]) {
          files[fieldname] = [];
        }

        files[fieldname].push({
          ...filename,
          encoding,
          mimetype,
          data: fileBuffer,
        });
      });
    }
  );

  // Listen for the end of the multipart/form-data stream
  busboyParser.on("finish", () => {
    // Attach the parsed data to the request object
    req.body = {
      ...fields,
      ...files,
    };

    // eslint-disable-next-line unicorn/no-null
    done(null, req.body);
  });

  busboyParser.on("error", (err) => {
    console.log(err);
  });

  _payload.pipe(busboyParser);
};

export const mercuriusUpload = fp(mercuriusGQLUpload, {
  fastify: ">= 4.x",
  name: "mercurius-upload",
});

export default mercuriusUpload;

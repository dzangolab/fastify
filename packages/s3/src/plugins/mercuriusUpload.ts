import { IncomingMessage } from "node:http";
import { Readable } from "node:stream";

import Busboy, { FileInfo } from "busboy";
import FastifyPlugin from "fastify-plugin";
import { processRequest, UploadOptions } from "graphql-upload-minimal";

import { Multipart } from "../types";

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

  fastify.addHook("preValidation", async (request, reply) => {
    if (!request.mercuriusUploadMultipart) {
      return;
    }

    request.body = await processRequest(request.raw, reply.raw, options);
  });

  done();
};

const parseRestMultipartContent = (
  req: FastifyRequest,
  _payload: IncomingMessage,
  done: (err: Error | null, body?: unknown) => void
) => {
  const busboyParser = Busboy({
    headers: req.headers,
  });

  const fields: Record<string, string> = {};
  const files: Record<string, Multipart[]> = {};

  busboyParser.on("field", (fieldName, value) => {
    fields[fieldName] = value;
  });

  busboyParser.on(
    "file",
    (fieldName: string, file: Readable, fileInfo: FileInfo) => {
      const chunks: Buffer[] = [];

      file.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      file.on("end", () => {
        const fileBuffer = Buffer.concat(chunks);

        if (!files[fieldName]) {
          files[fieldName] = [];
        }

        files[fieldName].push({
          ...fileInfo,
          mimetype: fileInfo.mimeType,
          data: fileBuffer,
        });
      });
    }
  );

  busboyParser.on("finish", () => {
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

export const mercuriusUpload = FastifyPlugin(mercuriusGQLUpload, {
  fastify: ">= 4.x",
  name: "mercurius-upload",
});

export default mercuriusUpload;

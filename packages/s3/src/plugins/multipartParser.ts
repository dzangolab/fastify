import { IncomingMessage } from "node:http";
import { Readable } from "node:stream";

import Busboy, { FileInfo } from "busboy";
import fastifyPlugin from "fastify-plugin";

import { Multipart } from "../types";

import type { FastifyInstance, FastifyRequest } from "fastify";

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
    fastify.addContentTypeParser("multipart", (req, _payload, done) => {
      if (
        fastify.config.mercurius.enabled &&
        req.routerPath?.startsWith(fastify.config.mercurius.path as string)
      ) {
        req.mercuriusUploadMultipart = true;

        // eslint-disable-next-line unicorn/no-null
        done(null);
      } else {
        processMultipartFormData(req, _payload, done);
      }
    });
  }

  done();
};

const processMultipartFormData = (
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

export default fastifyPlugin(plugin);

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { FastifyRequest } from "fastify";

const buildContext = async (request: FastifyRequest) => {
  return {
    config: request.config as ApiConfig,
    database: request.slonik as Database,
  };
};

export default buildContext;

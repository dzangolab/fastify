import type { FastifyRequest } from "fastify";

const buildContext = async (request: FastifyRequest) => {
  return {
    config: request.config,
    database: request.slonik,
    sql: request.sql,
  };
};

export default buildContext;

import type { FastifyRequest } from "fastify";

type HasPermission = (
  permission: string
) => (request: FastifyRequest) => Promise<void>;

export type { HasPermission };

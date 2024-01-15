import type { Service as BaseService } from "@dzangolab/fastify-slonik";

interface Service<T, C, U> extends BaseService<T, C, U> {
  ownerId: string;
}

export type { Service };

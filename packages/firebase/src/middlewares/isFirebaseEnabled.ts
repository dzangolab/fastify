import type { FastifyInstance } from "fastify";

const isFirebaseEnabled =
  (fastify: FastifyInstance) => async (): Promise<void> => {
    if (fastify.config.firebase.enabled === false) {
      throw new Error("Firebase is not enabled");
    }
  };

export default isFirebaseEnabled;

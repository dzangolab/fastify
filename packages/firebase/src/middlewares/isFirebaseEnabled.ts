import { FastifyInstance } from "fastify";

const isFirebaseEnabled =
  (fastify: FastifyInstance) => async (): Promise<void> => {
    const isEnabled = fastify.config.firebase.enabled;

    if (isEnabled === false) {
      throw new Error("Firebase is not enabled");
    }
  };

export default isFirebaseEnabled;

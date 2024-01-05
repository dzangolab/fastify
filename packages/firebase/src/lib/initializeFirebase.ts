import { ApiConfig } from "@dzangolab/fastify-config";
import { FastifyInstance } from "fastify";
import { initializeApp, credential, apps } from "firebase-admin";

const initializeFirebase = (config: ApiConfig, fastify: FastifyInstance) => {
  if (apps.length === 0) {
    try {
      initializeApp({
        credential: credential.cert({
          projectId: config.firebase.credentials.projectId,
          privateKey: config.firebase.credentials.privateKey.replace(
            /\\n/g,
            "\n"
          ),
          clientEmail: config.firebase.credentials.clientEmail,
        }),
      });
    } catch (error) {
      fastify.log.error("Failed to initialize firebase");
      fastify.log.error(error);
    }
  }
};

export default initializeFirebase;

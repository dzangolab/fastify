import { ApiConfig } from "@dzangolab/fastify-config";
import { FastifyInstance } from "fastify";
import { initializeApp, credential, apps } from "firebase-admin";

const initializeFirebase = (config: ApiConfig, fastify: FastifyInstance) => {
  if (config.firebase && config.firebase.projectId && apps.length === 0) {
    try {
      initializeApp({
        credential: credential.cert({
          projectId: config.firebase.projectId,
          privateKey: config.firebase.privateKey,
          clientEmail: config.firebase.clientEmail,
        }),
      });
    } catch {
      fastify.log.error("Failed to initialize firebase");
    }
  }
};

export default initializeFirebase;

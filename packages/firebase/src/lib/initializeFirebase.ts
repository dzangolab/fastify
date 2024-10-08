import { initializeApp, credential, apps } from "firebase-admin";

import type { FirebaseOptions } from "../types";
import type { FastifyInstance } from "fastify";

const initializeFirebase = (
  firebaseOptions: FirebaseOptions,
  fastify: FastifyInstance,
) => {
  if (apps.length > 0) {
    return;
  }

  if (firebaseOptions?.enabled !== false && !firebaseOptions.credentials) {
    fastify.log.error("Firebase credentials are missing");
    return;
  }

  try {
    initializeApp({
      credential: credential.cert({
        projectId: firebaseOptions.credentials?.projectId,
        privateKey: firebaseOptions.credentials?.privateKey.replaceAll(
          String.raw`\n`,
          "\n",
        ),
        clientEmail: firebaseOptions.credentials?.clientEmail,
      }),
    });
  } catch (error) {
    fastify.log.error("Failed to initialize firebase");
    fastify.log.error(error);
  }
};

export default initializeFirebase;

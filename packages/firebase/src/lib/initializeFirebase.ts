import { ApiConfig } from "@dzangolab/fastify-config";
import { initializeApp, credential } from "firebase-admin";

const initializeFirebase = (config: ApiConfig) => {
  if (config.firebase) {
    initializeApp({
      credential: credential.cert({
        projectId: config.firebase.projectId,
        privateKey: config.firebase.privateKey,
        clientEmail: config.firebase.clientEmail,
      }),
    });
  }
};

export default initializeFirebase;

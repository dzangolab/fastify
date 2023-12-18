import { ApiConfig } from "@dzangolab/fastify-config";
import { initializeApp, credential, apps } from "firebase-admin";

const initializeFirebase = (config: ApiConfig) => {
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
      console.error("Failed to initialize firebase");
    }
  }
};

export default initializeFirebase;

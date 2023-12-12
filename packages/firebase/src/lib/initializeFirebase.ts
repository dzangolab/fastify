import { ApiConfig } from "@dzangolab/fastify-config";
import * as firebaseAdmin from "firebase-admin";

const initializeFirebase = (config: ApiConfig) => {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId: config.firebase.projectId,
      privateKey: config.firebase.privateKey,
      clientEmail: config.firebase.clientEmail,
    }),
  });
};

export default initializeFirebase;

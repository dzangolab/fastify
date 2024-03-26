import EmailVerification from "supertokens-node/recipe/emailverification";

import { TENANT_ID } from "../constants";

/**
 * Auto verify user email.
 */
const verifyEmail = async (userId: string) => {
  const tokenResponse = await EmailVerification.createEmailVerificationToken(
    TENANT_ID,
    userId
  );

  if (tokenResponse.status === "OK") {
    await EmailVerification.verifyEmailUsingToken(
      TENANT_ID,
      tokenResponse.token
    );
  }
};

export default verifyEmail;

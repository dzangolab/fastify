import EmailVerification from "supertokens-node/recipe/emailverification";

/**
 * Auto verify user email.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const verifyEmail = async (userId: string, userContext?: any) => {
  const tokenResponse = await EmailVerification.createEmailVerificationToken(
    userId,
    userContext,
  );

  if (tokenResponse.status === "OK") {
    await EmailVerification.verifyEmailUsingToken(
      tokenResponse.token,
      userContext,
    );
  }
};

export default verifyEmail;

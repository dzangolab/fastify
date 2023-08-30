import EmailVerification from "supertokens-node/recipe/emailverification";

const manuallyVerifyEmail = async (userId: string) => {
  const tokenResponse = await EmailVerification.createEmailVerificationToken(
    userId
  );

  if (tokenResponse.status === "OK") {
    await EmailVerification.verifyEmailUsingToken(tokenResponse.token);
  }
};

export default manuallyVerifyEmail;

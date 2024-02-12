import { sendEmailVerificationEmail } from "./email-verification";
import { createNewSession, verifySession, refreshPOST } from "./session";
import {
  emailPasswordSignIn,
  emailPasswordSignUp,
  emailPasswordSignUpPOST,
  thirdPartySignInUp,
  thirdPartySignInUpPOST,
  resetPasswordUsingToken,
  sendPasswordResetEmail,
  emailPasswordSignInPOST,
  generatePasswordResetTokenPOST,
  getUserById,
} from "./third-party-email-password";

import type {
  EmailVerificationRecipe,
  ThirdPartyEmailPasswordRecipe,
  SessionRecipe,
} from "@dzangolab/fastify-user";

const emailVerificationConfig: EmailVerificationRecipe = {
  sendEmail: sendEmailVerificationEmail,
};

const sessionConfig: SessionRecipe = {
  override: {
    apis: {
      refreshPOST,
      verifySession,
    },
    functions: {
      createNewSession,
    },
  },
};

const thirdPartyEmailPasswordConfig: ThirdPartyEmailPasswordRecipe = {
  override: {
    apis: {
      emailPasswordSignInPOST,
      emailPasswordSignUpPOST,
      generatePasswordResetTokenPOST,
      thirdPartySignInUpPOST,
    },
    functions: {
      emailPasswordSignIn,
      emailPasswordSignUp,
      getUserById,
      resetPasswordUsingToken,
      thirdPartySignInUp,
    },
  },
  sendEmail: sendPasswordResetEmail,
};

const recipes = {
  emailVerification: emailVerificationConfig,
  thirdPartyEmailPassword: thirdPartyEmailPasswordConfig,
  session: sessionConfig,
};

export default recipes;

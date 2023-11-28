import { createNewSession } from "./session";
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
  ThirdPartyEmailPasswordRecipe,
  SessionRecipe,
} from "@dzangolab/fastify-user";

const sessionConfig: SessionRecipe = {
  override: {
    functions: {
      createNewSession: createNewSession,
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
  thirdPartyEmailPassword: thirdPartyEmailPasswordConfig,
  session: sessionConfig,
};

export default recipes;

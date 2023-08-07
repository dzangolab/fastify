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

import type { ThirdPartyEmailPasswordRecipe } from "@dzangolab/fastify-user";

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

export default thirdPartyEmailPasswordConfig;

import {
  emailPasswordSignIn,
  emailPasswordSignUp,
  emailPasswordSignUpPOST,
  thirdPartySignInUp,
  thirdPartySignInUpPOST,
  sendEmail,
  emailPasswordSignInPOST,
  generatePasswordResetTokenPOST,
  getUserById,
} from "./thirdPartyEmailPassword";

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
      thirdPartySignInUp,
    },
  },
  sendEmail,
};

export default thirdPartyEmailPasswordConfig;

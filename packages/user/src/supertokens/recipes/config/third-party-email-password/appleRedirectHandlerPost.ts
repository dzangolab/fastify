import type { FastifyInstance } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const appleRedirectHandlerPOST = (
  originalImplementation: APIInterface,
  fastify: FastifyInstance
): APIInterface["appleRedirectHandlerPOST"] => {
  return async (input) => {
    const { config } = fastify;
    const androidAppId = config.user.supertokens.androidAppId;

    if (originalImplementation.appleRedirectHandlerPOST === undefined) {
      throw new Error("Should never come here");
    }

    if (!androidAppId) {
      throw new Error("Android app id is required");
    }

    const stateInBase64 = input.state;

    // The state value will be undefined for android login.
    if (stateInBase64 === undefined) {
      const queryString = `code=${input.code}&state=${input.state}`;

      const redirectUrl = `intent://callback?${queryString}#Intent;package=${androidAppId};scheme=signinwithapple;end`;

      input.options.res.original.redirect(redirectUrl);
    } else {
      // For the web flow we can use the original implementation
      originalImplementation.appleRedirectHandlerPOST(input);
    }
  };
};

export default appleRedirectHandlerPOST;

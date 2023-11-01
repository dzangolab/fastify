import { ROLE_USER } from "../../../../constants";

import type { FastifyInstance, FastifyError } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const emailPasswordSignInPOST = (
  originalImplementation: APIInterface,
  fastify: FastifyInstance
): APIInterface["emailPasswordSignInPOST"] => {
  return async (input) => {
    if (originalImplementation.emailPasswordSignInPOST === undefined) {
      throw new Error("Should never come here");
    }

    try {
      const originalResponse =
        await originalImplementation.emailPasswordSignInPOST(input);

      if (originalResponse.status === "OK") {
        return originalResponse;
      }

      return originalResponse;
    } catch {
      return {
        status: "GENERAL_ERROR",
        message: "user is blocked",
      };
    }
  };
};

export default emailPasswordSignInPOST;

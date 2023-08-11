import { ROLE_USER } from "@dzangolab/fastify-user";

import type { FastifyError, FastifyInstance } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const emailPasswordSignUpPOST = (
  originalImplementation: APIInterface,
  fastify: FastifyInstance
): APIInterface["emailPasswordSignUpPOST"] => {
  return async (input) => {
    input.userContext.roles = [fastify.config.user.role || ROLE_USER];
    input.userContext.tenant = input.options.req.original.tenant;

    if (originalImplementation.emailPasswordSignUpPOST === undefined) {
      throw new Error("Should never come here");
    }

    if (fastify.config.user.features?.signUp === false) {
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404,
      } as FastifyError;
    }

    return await originalImplementation.emailPasswordSignUpPOST(input);
  };
};

export default emailPasswordSignUpPOST;

import type { FastifyInstance } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const emailPasswordSignInPOST = (
  originalImplementation: APIInterface,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  fastify: FastifyInstance
): APIInterface["emailPasswordSignInPOST"] => {
  return async (input) => {
    input.userContext.tenant = input.options.req.original.tenant;
    input.userContext.dbSchema = input.options.req.original.dbSchema;

    if (originalImplementation.emailPasswordSignInPOST === undefined) {
      throw new Error("Should never come here");
    }

    return await originalImplementation.emailPasswordSignInPOST(input);
  };
};

export default emailPasswordSignInPOST;

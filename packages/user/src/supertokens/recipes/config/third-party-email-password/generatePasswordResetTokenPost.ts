import updateFields from "../../../utils/updateFields";

import type { FastifyInstance } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const generatePasswordResetTokenPOST = (
  originalImplementation: APIInterface,
  fastify: FastifyInstance
): APIInterface["generatePasswordResetTokenPOST"] => {
  return async (input) => {
    input.userContext.tenant = input.options.req.original.tenant;

    if (originalImplementation.generatePasswordResetTokenPOST === undefined) {
      throw new Error("Should never come here");
    }

    input.formFields = updateFields(
      fastify.config,
      input.formFields,
      input.userContext.tenant
    );

    const originalResponse =
      await originalImplementation.generatePasswordResetTokenPOST(input);

    return originalResponse;
  };
};

export default generatePasswordResetTokenPOST;

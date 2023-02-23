import { addTenantId } from "../../../utils/updateEmail";

import type { FastifyInstance } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const emailPasswordSignInPOST = (
  originalImplementation: APIInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance
): typeof originalImplementation.emailPasswordSignInPOST => {
  return async (input) => {
    if (originalImplementation.emailPasswordSignInPOST === undefined) {
      throw new Error("Should never come here");
    }

    const formFields = await addTenantId(
      input.formFields,
      input.options.req.original.tenant
    );

    input.formFields = formFields;

    const originalResponse =
      await originalImplementation.emailPasswordSignInPOST(input);

    return originalResponse;
  };
};

export default emailPasswordSignInPOST;

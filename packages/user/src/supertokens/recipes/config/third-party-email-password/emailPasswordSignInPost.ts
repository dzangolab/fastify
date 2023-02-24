import updateEmail from "../../../utils/updateEmail";

import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const emailPasswordSignInPOST = (
  originalImplementation: APIInterface
): typeof originalImplementation.emailPasswordSignInPOST => {
  return async (input) => {
    if (originalImplementation.emailPasswordSignInPOST === undefined) {
      throw new Error("Should never come here");
    }

    const formFields = updateEmail.appendTenantId(
      input.formFields,
      input.options.req.original.tenant
    );

    input.formFields = formFields;

    const originalResponse =
      await originalImplementation.emailPasswordSignInPOST(input);

    if (originalResponse.status === "OK") {
      return {
        ...originalResponse,
        user: {
          ...originalResponse.user,
          email: updateEmail.removeTenantId(
            originalResponse.user.email,
            input.options.req.original.tenant
          ),
        },
      };
    }

    return originalResponse;
  };
};

export default emailPasswordSignInPOST;

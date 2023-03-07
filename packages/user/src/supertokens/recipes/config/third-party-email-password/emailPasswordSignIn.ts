import updateEmail from "../../../utils/updateEmail";

import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const emailPasswordSignIn = (
  originalImplementation: RecipeInterface
): typeof originalImplementation.emailPasswordSignIn => {
  return async (input) => {
    const originalEmail = input.email;

    input.email = updateEmail.appendTenantId(
      input.email,
      input.userContext.tenant
    );

    let originalResponse = await originalImplementation.emailPasswordSignIn(
      input
    );

    if (originalResponse.status === "OK") {
      originalResponse = {
        ...originalResponse,
        user: { ...originalResponse.user, email: originalEmail },
      };
    }

    return originalResponse;
  };
};

export default emailPasswordSignIn;

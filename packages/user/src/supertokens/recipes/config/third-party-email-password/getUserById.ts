import emailUtility from "../../../utils/email";

import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const getUserById = (
  originalImplementation: RecipeInterface
): RecipeInterface["getUserById"] => {
  return async (input) => {
    let user = await originalImplementation.getUserById(input);

    if (user && input.userContext.tenant) {
      user = {
        ...user,
        email: emailUtility.removeTenantId(
          user.email,
          input.userContext.tenant
        ),
      };
    }

    return user;
  };
};

export default getUserById;

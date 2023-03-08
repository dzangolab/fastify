import updateEmail from "../../.././utils/updateEmail";

import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const getUserById = (
  originalImplementation: RecipeInterface
): typeof originalImplementation.getUserById => {
  return async (input) => {
    let user = await originalImplementation.getUserById(input);

    if (user && input.userContext.tenant) {
      user = {
        ...user,
        email: updateEmail.removeTenantId(user.email, input.userContext.tenant),
      };
    }

    return user;
  };
};

export default getUserById;

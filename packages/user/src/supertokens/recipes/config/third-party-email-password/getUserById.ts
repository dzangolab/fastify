import updateTenantUser from "../../../utils/updateTenantUser";

import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const getUserById = (
  originalImplementation: RecipeInterface
): typeof originalImplementation.getUserById => {
  return async (input) => {
    let user = await originalImplementation.getUserById(input);

    if (user && input.userContext.tenant) {
      user = updateTenantUser(user, input.userContext.tenant);
    }

    return user;
  };
};

export default getUserById;

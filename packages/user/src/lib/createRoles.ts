import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_ADMIN, ROLE_SUPERADMIN, ROLE_USER } from "../constants";

const createRoles = async (roles?: string[]) => {
  const userRoles = [ROLE_ADMIN, ROLE_SUPERADMIN, ROLE_USER, ...(roles ?? [])];

  for (const role of userRoles) {
    await UserRoles.createNewRoleOrAddPermissions(role, []);
  }
};

export default createRoles;

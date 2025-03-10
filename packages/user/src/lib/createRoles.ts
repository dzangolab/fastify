import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_ADMIN, ROLE_SUPERADMIN, ROLE_USER } from "../constants";

const default_roles = [ROLE_ADMIN, ROLE_SUPERADMIN, ROLE_USER];

const createRoles = async (customRoles?: string[]) => {
  const roles = [...default_roles, ...(customRoles ?? [])];

  for (const role of roles) {
    await UserRoles.createNewRoleOrAddPermissions(role, []);
  }
};

export default createRoles;

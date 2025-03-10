import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_ADMIN, ROLE_SUPERADMIN, ROLE_USER } from "../constants";

const roles = [ROLE_ADMIN, ROLE_SUPERADMIN, ROLE_USER];

const createRoles = async () => {
  for (const role of roles) {
    await UserRoles.createNewRoleOrAddPermissions(role, []);
  }
};

export default createRoles;

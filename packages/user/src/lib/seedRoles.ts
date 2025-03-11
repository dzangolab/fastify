import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_ADMIN, ROLE_SUPERADMIN, ROLE_USER } from "../constants";
import { UserConfig } from "../types";

const seedRoles = async (user?: UserConfig) => {
  const roles = [
    ROLE_ADMIN,
    ROLE_SUPERADMIN,
    ROLE_USER,
    ...(user?.roles ?? []),
  ];

  for (const role of roles) {
    await UserRoles.createNewRoleOrAddPermissions(role, []);
  }
};

export default seedRoles;

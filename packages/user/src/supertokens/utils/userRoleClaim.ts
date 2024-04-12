import { PrimitiveArrayClaim } from "supertokens-node/lib/build/recipe/session/claims";

import type { User } from "../../types";

class UserRoleClaim extends PrimitiveArrayClaim<string> {
  constructor() {
    super({
      key: "role",
      fetchValue: async (userId: string, userContext) => {
        const user = userContext.user as User;

        return user.roles.map(({ role }) => role);
      },

      defaultMaxAgeInSeconds: 300,
    });
  }
}

export default UserRoleClaim;

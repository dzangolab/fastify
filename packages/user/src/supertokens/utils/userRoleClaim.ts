import { PrimitiveArrayClaim } from "supertokens-node/lib/build/recipe/session/claims";

class UserRoleClaim extends PrimitiveArrayClaim<string> {
  constructor() {
    super({
      key: "role",
      fetchValue: async (userId: string, userContext) => {
        return userContext.roles;
      },
      defaultMaxAgeInSeconds: 300,
    });
  }
}

export default UserRoleClaim;

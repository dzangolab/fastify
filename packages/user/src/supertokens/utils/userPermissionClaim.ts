import { PrimitiveArrayClaim } from "supertokens-node/lib/build/recipe/session/claims";

import RoleService from "../../model/roles/service";

import type { Role, RoleCreateInput, RoleUpdateInput, User } from "../../types";
import type { FastifyInstance } from "fastify";

class UserPermissionClaim extends PrimitiveArrayClaim<string> {
  constructor(fastify: FastifyInstance) {
    super({
      key: "permission",
      fetchValue: async (userId, userContext) => {
        const roleService = new RoleService<
          Role,
          RoleCreateInput,
          RoleUpdateInput
        >(fastify.config, fastify.slonik);

        const user = userContext.user as User;

        const roles = await roleService.list(undefined, undefined, {
          key: "id",
          operator: "in",
          value: user.roles.map(({ id }) => id).join(","),
        });

        return [
          ...new Set(
            roles.data.flatMap(({ permissions }) => permissions || [])
          ),
        ];
      },

      defaultMaxAgeInSeconds: 300,
    });
  }
}

export default UserPermissionClaim;

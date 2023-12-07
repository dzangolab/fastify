import FastifyPlugin from "fastify-plugin";
import mercurius from "mercurius";
import mercuriusAuth from "mercurius-auth";
import UserRoles from "supertokens-node/recipe/userroles";

import type { FastifyInstance } from "fastify";

const plugin = FastifyPlugin(async (fastify: FastifyInstance) => {
  await fastify.register(mercuriusAuth, {
    authContext: async (context) => {
      let permissions: string[] = [];

      const roles: string[] = context.roles || [];

      for (const role of roles) {
        const response = await UserRoles.getPermissionsForRole(role);

        if (response.status === "OK") {
          permissions = [...new Set([...permissions, ...response.permissions])];
        }
      }

      return {
        permissions: permissions,
      };
    },
    applyPolicy: async (authDirectiveAST, parent, arguments_, context) => {
      const permission = authDirectiveAST.arguments.find(
        (argument: { name: { value: string } }) =>
          argument.name.value === "require"
      ).value.value;

      if (
        context.auth?.permissions === undefined ||
        !context.auth.permissions.includes(permission)
      ) {
        // Added the claim validation errors to match with rest endpoint
        // response for hasPermission
        return new mercurius.ErrorWithProps(
          "INVALID_CLAIMS",
          {
            claimValidationErrors: [
              {
                id: "st-perm",
                reason: {
                  message: "Not have enough permission",
                  expectedToInclude: permission,
                },
              },
            ],
          },
          403
        );
      }

      return true;
    },
    authDirective: "hasPermission",
  });
});

export default plugin;

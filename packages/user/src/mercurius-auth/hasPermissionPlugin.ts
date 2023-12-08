import FastifyPlugin from "fastify-plugin";
import mercurius from "mercurius";
import mercuriusAuth from "mercurius-auth";
import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_SUPER_ADMIN } from "../constants";
import permissionService from "../model/permissions/service";

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
      const { auth, config, database, roles } = context;

      const permission = authDirectiveAST.arguments.find(
        (argument: { name: { value: string } }) =>
          argument.name.value === "permission"
      ).value.value;

      const service = new permissionService(config, database);
      const isPermissionExists = await service.isPermissionExists(permission);

      // ALlow if provided permission is not defined
      if (isPermissionExists) {
        return true;
      }

      // ALlow if user has super admin role
      if (roles && roles.includes(ROLE_SUPER_ADMIN)) {
        return true;
      }

      if (
        auth?.permissions === undefined ||
        !auth.permissions.includes(permission)
      ) {
        // Added the claim validation errors to match with rest endpoint
        // response for hasPermission
        return new mercurius.ErrorWithProps(
          "invalid claim",
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

import type { HasPermission } from "./types";

declare module "fastify" {
  interface FastifyRequest {
    hasPermission: HasPermission;
  }
}

export { default } from "./plugin";

export type { HasPermission } from "./types";

export { default as PermissionService } from "./permission";
export { default as roleRoutes } from "./model/roles/controller";
export { default as permissionRoutes } from "./model/permissions/controller";

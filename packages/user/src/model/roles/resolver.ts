import mercurius from "mercurius";

import RoleService from "./service";
import CustomApiError from "../../customApiError";

import type { MercuriusContext } from "mercurius";

const Mutation = {
  createRole: async (
    parent: unknown,
    arguments_: {
      role: string;
      permissions: string[];
    },
    context: MercuriusContext
  ) => {
    const { app, config, dbSchema, database } = context;

    try {
      const service = new RoleService(config, database, dbSchema);

      const createResponse = await service.create({
        role: arguments_.role,
        permissions: arguments_.permissions,
      });

      return createResponse;
    } catch (error) {
      if (error instanceof CustomApiError) {
        const mercuriusError = new mercurius.ErrorWithProps(error.name);

        mercuriusError.statusCode = error.statusCode;

        return mercuriusError;
      }

      app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );

      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },

  deleteRole: async (
    parent: unknown,
    arguments_: {
      role: string;
    },
    context: MercuriusContext
  ) => {
    const { app, config, dbSchema, database } = context;

    try {
      const service = new RoleService(config, database, dbSchema);

      const { role } = arguments_;

      const deleteResponse = await service.delete(role);

      return deleteResponse;
    } catch (error) {
      if (error instanceof CustomApiError) {
        const mercuriusError = new mercurius.ErrorWithProps(error.name);

        mercuriusError.statusCode = error.statusCode;

        return mercuriusError;
      }

      app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );

      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },

  updateRolePermissions: async (
    parent: unknown,
    arguments_: {
      roleId: number;
      permissions: string[];
    },
    context: MercuriusContext
  ) => {
    const { app, config, database, dbSchema } = context;
    const { permissions, roleId } = arguments_;

    try {
      const service = new RoleService(config, database, dbSchema);

      const updatedPermissionsResponse = await service.updateRolePermissions(
        roleId,
        permissions
      );

      return updatedPermissionsResponse;
    } catch (error) {
      if (error instanceof CustomApiError) {
        const mercuriusError = new mercurius.ErrorWithProps(error.name);

        mercuriusError.statusCode = error.statusCode;

        return mercuriusError;
      }

      app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );

      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
};

const Query = {
  roles: async (
    parent: unknown,
    arguments_: Record<string, never>,
    context: MercuriusContext
  ) => {
    const { app, config, database, dbSchema } = context;

    try {
      const service = new RoleService(config, database, dbSchema);

      const roles = await service.getRoles();

      return roles;
    } catch (error) {
      app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );

      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
  rolePermissions: async (
    parent: unknown,
    arguments_: {
      role: number;
    },
    context: MercuriusContext
  ) => {
    const { app, config, database, dbSchema } = context;
    const { role } = arguments_;

    try {
      if (role) {
        const service = new RoleService(config, database, dbSchema);

        const permissions = await service.getPermissionsForRole(role);

        return permissions;
      }
    } catch (error) {
      app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );

      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
};

export default { Mutation, Query };

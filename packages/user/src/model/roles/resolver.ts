import mercurius from "mercurius";

import RoleService from "./service";

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
    const { app } = context;

    try {
      const service = new RoleService();

      return await service.createRole(arguments_.role, arguments_.permissions);
    } catch (error) {
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
    const { app } = context;

    try {
      const service = new RoleService();

      const { role } = arguments_;

      return await service.deleteRole(role);
    } catch (error) {
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
      role: string;
      permissions: string[];
    },
    context: MercuriusContext
  ) => {
    const { app } = context;
    const { permissions, role } = arguments_;

    try {
      const service = new RoleService();
      const updatedPermissions = await service.updateRolePermissions(
        role,
        permissions
      );

      return updatedPermissions;
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

const Query = {
  roles: async (
    parent: unknown,
    arguments_: Record<string, never>,
    context: MercuriusContext
  ) => {
    const { app } = context;

    try {
      const service = new RoleService();
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
      role: string;
    },
    context: MercuriusContext
  ) => {
    const { app } = context;
    const { role } = arguments_;
    let permissions: string[] = [];

    try {
      if (role) {
        const service = new RoleService();

        permissions = await service.getPermissionsForRole(role);
      }

      return permissions;
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

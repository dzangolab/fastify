import { ApiConfig } from "@dzangolab/fastify-config";
import { Database } from "@dzangolab/fastify-slonik";
import { QueryResultRow } from "slonik";

import ModelRoleService from "./model/modelRoles/service";
import PermissionService from "./model/permissions/service";
import RoleService from "./model/roles/service";
import { PermissionCreateInput } from "./types/permission";
import { RoleCreateInput, RoleUpdateInput } from "./types/role";

class Permission {
  private static instance: Permission | null;
  private static _config: ApiConfig;
  private static _database: Database;
  private static _schema = "public";
  protected static _roleService: RoleService<
    QueryResultRow,
    QueryResultRow,
    QueryResultRow
  >;
  protected static _permissionService: PermissionService<
    QueryResultRow,
    QueryResultRow,
    QueryResultRow
  >;
  protected static _modelRoleService: ModelRoleService<
    QueryResultRow,
    QueryResultRow,
    QueryResultRow
  >;

  // Private constructor to prevent direct instantiation
  private constructor(config: ApiConfig, database: Database, schema?: string) {
    Permission._config = config;
    Permission._database = database;

    if (schema) {
      Permission._schema = schema;
    }

    Permission._roleService = new RoleService(
      Permission._config,
      Permission._database,
      Permission._schema
    );

    Permission._permissionService = new PermissionService(
      Permission._config,
      Permission._database,
      Permission._schema
    );

    Permission._modelRoleService = new ModelRoleService(
      Permission._config,
      Permission._database,
      Permission._schema
    );
  }

  // Initialize the Permission instance with configuration
  static init(config: ApiConfig, database: Database, schema?: string): void {
    if (!Permission.instance) {
      Permission.instance = new Permission(config, database, schema);
    }
  }

  static async createNewPermission(input: PermissionCreateInput) {
    if (!Permission.instance) {
      throw new Error(
        "Permission not initialized. Call Permission.init() first."
      );
    }

    return await Permission._permissionService.create(
      input as unknown as QueryResultRow
    );
  }

  static async getAllPermissions(fields: string[]) {
    if (!Permission.instance) {
      throw new Error(
        "Permission not initialized. Call Permission.init() first."
      );
    }

    return await Permission._permissionService.all(fields);
  }

  static async getPermissionById(id: number) {
    if (!Permission.instance) {
      throw new Error(
        "Permission not initialized. Call Permission.init() first."
      );
    }

    return await Permission._permissionService.findById(id);
  }

  static async deletePermission(id: number) {
    if (!Permission.instance) {
      throw new Error(
        "Permission not initialized. Call Permission.init() first."
      );
    }

    return await Permission._permissionService.delete(id);
  }

  static async createNewRole(input: RoleCreateInput) {
    if (!Permission.instance) {
      throw new Error(
        "Permission not initialized. Call Permission.init() first."
      );
    }

    return await Permission._roleService.create(
      input as unknown as QueryResultRow
    );
  }

  static async getAllRoles(fields: string[]) {
    if (!Permission.instance) {
      throw new Error(
        "Permission not initialized. Call Permission.init() first."
      );
    }

    return await Permission._roleService.all(fields);
  }

  static async getRoleById(id: number) {
    if (!Permission.instance) {
      throw new Error(
        "Permission not initialized. Call Permission.init() first."
      );
    }

    return await Permission._roleService.findById(id);
  }

  static async updateRole(id: number, input: RoleUpdateInput) {
    if (!Permission.instance) {
      throw new Error(
        "Permission not initialized. Call Permission.init() first."
      );
    }

    return await Permission._roleService.update(
      id,
      input as unknown as QueryResultRow
    );
  }

  static async deleteRole(id: number) {
    if (!Permission.instance) {
      throw new Error(
        "Permission not initialized. Call Permission.init() first."
      );
    }

    return await Permission._roleService.delete(id);
  }

  static async addModelRole(
    roleId: number,
    modelId: number,
    modelName: string
  ) {
    if (!Permission.instance) {
      throw new Error(
        "Permission not initialized. Call Permission.init() first."
      );
    }

    return await Permission._modelRoleService.create({
      roleId,
      modelId,
      modelName,
    });
  }
}

export default Permission;

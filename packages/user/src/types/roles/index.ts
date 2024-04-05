interface Role {
  id: number;
  role: string;
  default: string;
}

interface RoleWithPermissions extends Role {
  permissions: string[];
}

interface RoleCreateInput {
  role: string;
  permissions: string[];
}

interface RolePermission {
  id: string;
  roleId: number;
  permission: string;
}

export type { Role, RoleCreateInput, RolePermission, RoleWithPermissions };

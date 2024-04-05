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
  default: boolean;
  permissions: string[];
}

interface RolePermission {
  id: string;
  roleId: number;
  permission: string;
}

export type { Role, RoleCreateInput, RolePermission, RoleWithPermissions };

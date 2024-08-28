declare class RoleService {
    createRole: (role: string, permissions?: string[]) => Promise<{
        status: "OK";
    }>;
    deleteRole: (role: string) => Promise<{
        status: "OK";
    }>;
    getPermissionsForRole: (role: string) => Promise<string[]>;
    getRoles: () => Promise<{
        role: string;
        permissions: string[];
    }[]>;
    updateRolePermissions: (role: string, permissions: string[]) => Promise<{
        status: "OK";
        permissions: string[];
    }>;
}
export default RoleService;
//# sourceMappingURL=service.d.ts.map
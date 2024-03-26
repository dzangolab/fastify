declare class RoleService {
    createRole: (role: string, permissions?: string[]) => Promise<{
        status: "OK";
        createdNewRole: boolean;
    }>;
    deleteRole: (role: string) => Promise<{
        status: "OK";
        didRoleExist: boolean;
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
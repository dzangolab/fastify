declare class RoleService {
    createRole: (role: string) => Promise<void>;
    getPermissionsForRole: (role: string) => Promise<string[]>;
    getRoles: () => Promise<string[]>;
    updateRolePermissions: (role: string, permissions: string[]) => Promise<string[]>;
}
export default RoleService;
//# sourceMappingURL=service.d.ts.map
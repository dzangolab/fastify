import type { Role, RolePermission, RoleWithPermissions } from ".";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type {
  Database,
  FilterInput,
  SortDirection,
  SortInput,
} from "@dzangolab/fastify-slonik";
import type { z } from "zod";

interface Service<T, C, U> {
  config: ApiConfig;
  database: Database;
  sortDirection: SortDirection;
  sortKey: string;
  schema: "public" | string;
  table: string;
  validationSchema: z.ZodTypeAny;

  all(fields: string[]): Promise<Partial<readonly T[]>>;
  create(data: C): Promise<T | undefined>;
  delete(id: number | string): Promise<T | null>;
  findById(id: number | string): Promise<T | null>;
  getLimitDefault(): number;
  getLimitMax(): number;
  list(
    limit?: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[]
  ): Promise<PaginatedList<T>>;
  count(filters?: FilterInput): Promise<number>;
  update(id: number | string, data: U): Promise<T>;
  addRolePermissions(
    id: number,
    permission: string[]
  ): Promise<RolePermission[]>;
  getPermissionsForRole(id: number): Promise<RolePermission[]>;
  getRoles(): Promise<RoleWithPermissions[]>;
  updateRolePermissions(
    roleId: number,
    permission: string[]
  ): Promise<RolePermission[]>;
  removePermissionsFromRole(
    roleId: number,
    permission: string[]
  ): Promise<readonly RolePermission[]>;
}

type PaginatedList<T> = {
  totalCount: number;
  filteredCount: number;
  data: readonly T[];
};

export type { PaginatedList, Service };

import type { Database, FilterInput, SortDirection, SortInput } from "./database";
import type { ApiConfig } from "@dzangolab/fastify-config";
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
    list(limit?: number, offset?: number, filters?: FilterInput, sort?: SortInput[]): Promise<PaginatedList<T>>;
    count(filters?: FilterInput): Promise<number>;
    update(id: number | string, data: U): Promise<T>;
}
type PaginatedList<T> = {
    totalCount: number;
    filteredCount: number;
    data: readonly T[];
};
export type { PaginatedList, Service };
//# sourceMappingURL=service.d.ts.map
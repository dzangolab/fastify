import type { DatabasePool } from "slonik";
import type { ConnectionRoutine, QueryFunction } from "slonik/dist/src/types";
type Database = {
    connect: <T>(connectionRoutine: ConnectionRoutine<T>) => Promise<T>;
    pool: DatabasePool;
    query: QueryFunction;
};
type FilterInput = {
    AND: FilterInput[];
    OR: FilterInput[];
    key: string;
    operator: string;
    not: boolean;
    value: string;
};
type SortDirection = "ASC" | "DESC";
type SortInput = {
    key: string;
    direction: SortDirection;
};
export type { Database, FilterInput, SortInput };
//# sourceMappingURL=database.d.ts.map
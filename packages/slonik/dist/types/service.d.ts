import { z } from "zod";
import type { Database, FilterInput, Service, SortInput, SqlFactory } from "./types";
import type { PaginatedList } from "./types/service";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { QueryResultRow } from "slonik";
declare abstract class BaseService<T extends QueryResultRow, C extends QueryResultRow, U extends QueryResultRow> implements Service<T, C, U> {
    static readonly TABLE: string;
    static readonly LIMIT_DEFAULT = 20;
    static readonly LIMIT_MAX = 50;
    protected _config: ApiConfig;
    protected _database: Database;
    protected _factory: SqlFactory<T, C, U> | undefined;
    protected _schema: string;
    protected _validationSchema: z.ZodTypeAny;
    constructor(config: ApiConfig, database: Database, schema?: string);
    /**
     * Only for entities that support it. Returns the full list of entities,
     * with no filtering, no custom sorting order, no pagination,
     * but with a restricted set of data.
     * Example: to get the full list of countries to populate the CountryPicker
     */
    all: (fields: string[]) => Promise<Partial<readonly T[]>>;
    create: (data: C) => Promise<T | undefined>;
    delete: (id: number | string) => Promise<T | null>;
    findById: (id: number | string) => Promise<T | null>;
    getLimitDefault: () => number;
    getLimitMax: () => number;
    list: (limit?: number, offset?: number, filters?: FilterInput, sort?: SortInput[]) => Promise<PaginatedList<T>>;
    /** @deprecated use list() method instead */
    paginatedList: (limit?: number, offset?: number, filters?: FilterInput, sort?: SortInput[]) => Promise<PaginatedList<T>>;
    count: (filters?: FilterInput) => Promise<number>;
    update: (id: number | string, data: U) => Promise<T>;
    get config(): ApiConfig;
    get database(): Database;
    get factory(): SqlFactory<T, C, U>;
    get schema(): string;
    get table(): string;
    get validationSchema(): z.ZodTypeAny;
    protected postCreate: (result: T) => Promise<T>;
}
export default BaseService;
//# sourceMappingURL=service.d.ts.map
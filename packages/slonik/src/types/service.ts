import type { Database, FilterInput, SortInput } from "./database";
import type { ApiConfig } from "@dzangolab/fastify-config";

interface Service<T, C, U> {
  config: ApiConfig;
  database: Database;
  schema: "public" | string;
  table: string;

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
  ): Promise<readonly T[]>;
  update(id: number | string, data: U): Promise<T>;
}

export type { Service };

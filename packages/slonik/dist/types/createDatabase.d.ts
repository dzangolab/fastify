import type { Database } from "./types";
import type { ClientConfiguration } from "slonik";
declare const createDatabase: (connectionString: string, clientConfiguration?: Partial<ClientConfiguration>) => Promise<Database>;
export default createDatabase;
//# sourceMappingURL=createDatabase.d.ts.map
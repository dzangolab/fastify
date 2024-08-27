import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";
declare const tenants: (request: SessionRequest, reply: FastifyReply) => Promise<void>;
export default tenants;
//# sourceMappingURL=tenants.d.ts.map
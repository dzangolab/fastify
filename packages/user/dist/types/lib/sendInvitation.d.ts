import type { Invitation } from "../types/invitation";
import type { FastifyInstance } from "fastify";
declare const sendInvitation: (fastify: FastifyInstance, invitation: Invitation, url?: string) => Promise<void>;
export default sendInvitation;
//# sourceMappingURL=sendInvitation.d.ts.map
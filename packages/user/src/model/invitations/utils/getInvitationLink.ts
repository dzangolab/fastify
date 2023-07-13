import type { ApiConfig } from "@dzangolab/fastify-config";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getInvitationLink = (id: number, config: ApiConfig) => {
  // [DU 2023-JUL-07] Todo:  Get details from app table or from config
  return "http://localhost:20074/register";
};

export default getInvitationLink;

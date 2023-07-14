import type { ApiConfig } from "@dzangolab/fastify-config";

const getInvitationLink = (
  appId: number,
  token: string,
  config: ApiConfig
): string => {
  // [DU 2023-JUL-07] Todo: Get details from config
  return `${config.appOrigin[2]}/register/token/${token}`;
};

export default getInvitationLink;

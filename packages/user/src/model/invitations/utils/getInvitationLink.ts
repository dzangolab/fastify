import type { ApiConfig } from "@dzangolab/fastify-config";

const getInvitationLink = (
  config: ApiConfig,
  token: string,
  appDomain: string
): string => {
  // [DU 2023-JUL-19] Update the path from config
  return `${appDomain}/register/token/${token}`;
};

export default getInvitationLink;

import { INVITATION_ACCEPT_PATH } from "../constants";

import type { ApiConfig } from "@dzangolab/fastify-config";

const getInvitationLink = (
  config: ApiConfig,
  token: string,
  origin: string
): string => {
  // [DU 2023-JUL-19] Update the path from config
  return `${origin}${INVITATION_ACCEPT_PATH}/${token}`;
};

export default getInvitationLink;

import { INVITATION_ACCEPT_PATH } from "../constants";

import type { Invitation } from "../types/invitation";
import type { ApiConfig } from "@dzangolab/fastify-config";

const getInvitationLink = (
  config: ApiConfig,
  invitation: Invitation,
  origin?: string
): string => {
  const app = config.apps?.find((app) => app.id === invitation.appId);

  // [DU 2023-JUL-19] Update the invitation path from config
  return `${app?.origin || origin}${INVITATION_ACCEPT_PATH}/${
    invitation.token
  }`;
};

export default getInvitationLink;

import type { Invitation } from "../types/invitation";
import type { ApiConfig } from "@dzangolab/fastify-config";

const defaultPath = "register/token";

const getInvitationLink = (
  config: ApiConfig,
  invitation: Invitation,
  origin?: string
): string => {
  const app = config.apps?.find((app) => app.id === invitation.id);

  return `${app?.origin || origin}/${defaultPath}/${invitation.token}`;
};

export default getInvitationLink;

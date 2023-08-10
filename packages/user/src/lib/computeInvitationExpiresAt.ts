import { formatDate } from "@dzangolab/fastify-slonik";

import { invitationExpireAfterInDays } from "../constants";

import type { ApiConfig } from "@dzangolab/fastify-config";

const computeInvitationExpiresAt = (config: ApiConfig, expireTime?: string) => {
  return (
    expireTime ||
    formatDate(
      new Date(
        Date.now() +
          (config.user.invitation?.expireAfterInDays ??
            invitationExpireAfterInDays) *
            (24 * 60 * 60 * 1000)
      )
    )
  );
};

export default computeInvitationExpiresAt;

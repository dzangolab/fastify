import type { Invitation } from "../types/invitation";

const isInvitationValid = (invitation: Invitation): boolean => {
  if (
    invitation.acceptedAt ||
    invitation.revokedAt ||
    Date.now() > invitation.expiresAt
  ) {
    return false;
  }

  return true;
};

export default isInvitationValid;

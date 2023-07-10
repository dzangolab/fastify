import type { Invitation } from "../../../types/invitation";

const isInvitationValid = (invitation: Invitation): boolean => {
  const expiresAt = invitation?.expiresAt as unknown as number;

  if (invitation.acceptedAt || invitation.revokedAt || Date.now() > expiresAt) {
    return false;
  }

  return true;
};

export default isInvitationValid;

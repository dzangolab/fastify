const INVITATION_ACCEPT_PATH = "/register/token";
const INVITATION_EXPIRE_AFTER_IN_DAYS = 30;

const RESET_PASSWORD_PATH = "/auth/reset-password";

// Invitations
const INVITATIONS_TABLE = "invitations";
const ROUTE_INVITATIONS = "/invitations";
const ROUTE_INVITATIONS_ACCEPT = "/invitations/token/:token";
const ROUTE_INVITATIONS_CREATE = "/invitations";
const ROUTE_INVITATIONS_GET_BY_TOKEN = "/invitations/token/:token";
const ROUTE_INVITATIONS_RESEND = "/invitations/resend/:id(^\\d+)";
const ROUTE_INVITATIONS_REVOKE = "/invitations/revoke/:id(^\\d+)";

// Users
const USERS_TABLE = "users";
const ROUTE_CHANGE_PASSWORD = "/change_password";
const ROUTE_ME = "/me";
const ROUTE_USERS = "/users";

const DEFAULT_ROLE = "USER";

export {
  DEFAULT_ROLE,
  INVITATIONS_TABLE,
  INVITATION_ACCEPT_PATH,
  INVITATION_EXPIRE_AFTER_IN_DAYS,
  RESET_PASSWORD_PATH,
  USERS_TABLE,
  ROUTE_INVITATIONS,
  ROUTE_INVITATIONS_ACCEPT,
  ROUTE_INVITATIONS_CREATE,
  ROUTE_INVITATIONS_GET_BY_TOKEN,
  ROUTE_INVITATIONS_RESEND,
  ROUTE_INVITATIONS_REVOKE,
  ROUTE_CHANGE_PASSWORD,
  ROUTE_ME,
  ROUTE_USERS,
};

// Invitations
const INVITATION_ACCEPT_PATH = "/register/token";
const INVITATION_EXPIRE_AFTER_IN_DAYS = 30;
const ROUTE_INVITATIONS = "/invitations";
const ROUTE_INVITATIONS_ACCEPT = "/invitations/token/:token";
const ROUTE_INVITATIONS_CREATE = "/invitations";
const ROUTE_INVITATIONS_GET_BY_TOKEN = "/invitations/token/:token";
const ROUTE_INVITATIONS_RESEND = "/invitations/resend/:id(^\\d+)";
const ROUTE_INVITATIONS_REVOKE = "/invitations/revoke/:id(^\\d+)";
const TABLE_INVITATIONS = "invitations";

// Users
const RESET_PASSWORD_PATH = "/reset-password";
const ROUTE_CHANGE_PASSWORD = "/change_password";
const ROUTE_ME = "/me";
const ROUTE_USERS = "/users";
const TABLE_USERS = "users";
const USER_ROLE = "USER";

export {
  INVITATION_ACCEPT_PATH,
  INVITATION_EXPIRE_AFTER_IN_DAYS,
  RESET_PASSWORD_PATH,
  ROUTE_CHANGE_PASSWORD,
  ROUTE_INVITATIONS,
  ROUTE_INVITATIONS_ACCEPT,
  ROUTE_INVITATIONS_CREATE,
  ROUTE_INVITATIONS_GET_BY_TOKEN,
  ROUTE_INVITATIONS_RESEND,
  ROUTE_INVITATIONS_REVOKE,
  ROUTE_ME,
  ROUTE_USERS,
  TABLE_INVITATIONS,
  TABLE_USERS,
  USER_ROLE,
};

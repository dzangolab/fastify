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
const ROLE_ADMIN = "ADMIN";
const ROLE_USER = "USER";
const ROUTE_CHANGE_PASSWORD = "/change_password";
const ROUTE_SIGNUP_ADMIN = "/signup/admin";
const ROUTE_ME = "/me";
const ROUTE_USERS = "/users";
const ROUTE_USERS_DISABLE = "/users/:id/disable";
const ROUTE_USERS_ENABLE = "/users/:id/enable";
const TABLE_USERS = "users";

// Email verification
const EMAIL_VERIFICATION_MODE = "REQUIRED";
const EMAIL_VERIFICATION_PATH = "/verify-email";

export {
  EMAIL_VERIFICATION_MODE,
  EMAIL_VERIFICATION_PATH,
  INVITATION_ACCEPT_PATH,
  INVITATION_EXPIRE_AFTER_IN_DAYS,
  RESET_PASSWORD_PATH,
  ROLE_ADMIN,
  ROLE_USER,
  ROUTE_CHANGE_PASSWORD,
  ROUTE_INVITATIONS,
  ROUTE_INVITATIONS_ACCEPT,
  ROUTE_INVITATIONS_CREATE,
  ROUTE_INVITATIONS_GET_BY_TOKEN,
  ROUTE_INVITATIONS_RESEND,
  ROUTE_INVITATIONS_REVOKE,
  ROUTE_ME,
  ROUTE_SIGNUP_ADMIN,
  ROUTE_USERS,
  ROUTE_USERS_DISABLE,
  ROUTE_USERS_ENABLE,
  TABLE_INVITATIONS,
  TABLE_USERS,
};

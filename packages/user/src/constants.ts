// Invitations
const INVITATION_ACCEPT_LINK_PATH = "/signup/token/:token";
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
const ROLE_SUPER_ADMIN = "SUPER_ADMIN";
const ROLE_USER = "USER";
const ROUTE_CHANGE_PASSWORD = "/change_password";
const ROUTE_SIGNUP_ADMIN = "/signup/admin";
const ROUTE_ME = "/me";
const ROUTE_USERS = "/users";
const ROUTE_USERS_DISABLE = "/users/:id/disable";
const ROUTE_USERS_ENABLE = "/users/:id/enable";
const TABLE_USERS = "users";

// Roles
const ROUTE_ROLES = "/roles";
const ROUTE_ROLES_PERMISSIONS = "/roles/permissions";

// Permissions
const ROUTE_PERMISSIONS = "/permissions";

// Email verification
const EMAIL_VERIFICATION_MODE = "REQUIRED";
const EMAIL_VERIFICATION_PATH = "/verify-email";

const PERMISSIONS_INVITATIONS_CREATE = "invitations:create";
const PERMISSIONS_INVITATIONS_LIST = "invitations:list";
const PERMISSIONS_INVITATIONS_RESEND = "invitations:resend";
const PERMISSIONS_INVITATIONS_REVOKE = "invitations:revoke";

const PERMISSIONS_USERS_DISABLE = "users:disable";
const PERMISSIONS_USERS_ENABLE = "users:enable";
const PERMISSIONS_USERS_LIST = "users:enable";

export {
  EMAIL_VERIFICATION_MODE,
  EMAIL_VERIFICATION_PATH,
  INVITATION_ACCEPT_LINK_PATH,
  INVITATION_EXPIRE_AFTER_IN_DAYS,
  PERMISSIONS_INVITATIONS_LIST,
  PERMISSIONS_INVITATIONS_RESEND,
  PERMISSIONS_INVITATIONS_REVOKE,
  PERMISSIONS_USERS_DISABLE,
  PERMISSIONS_USERS_ENABLE,
  PERMISSIONS_USERS_LIST,
  RESET_PASSWORD_PATH,
  ROLE_ADMIN,
  ROLE_SUPER_ADMIN,
  ROLE_USER,
  ROUTE_CHANGE_PASSWORD,
  ROUTE_INVITATIONS,
  ROUTE_INVITATIONS_ACCEPT,
  ROUTE_INVITATIONS_CREATE,
  ROUTE_INVITATIONS_GET_BY_TOKEN,
  ROUTE_INVITATIONS_RESEND,
  ROUTE_INVITATIONS_REVOKE,
  ROUTE_ME,
  ROUTE_PERMISSIONS,
  ROUTE_ROLES,
  PERMISSIONS_INVITATIONS_CREATE,
  ROUTE_ROLES_PERMISSIONS,
  ROUTE_SIGNUP_ADMIN,
  ROUTE_USERS,
  ROUTE_USERS_DISABLE,
  ROUTE_USERS_ENABLE,
  TABLE_INVITATIONS,
  TABLE_USERS,
};

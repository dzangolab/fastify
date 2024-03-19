declare const INVITATION_ACCEPT_LINK_PATH = "/signup/token/:token";
declare const INVITATION_EXPIRE_AFTER_IN_DAYS = 30;
declare const ROUTE_INVITATIONS = "/invitations";
declare const ROUTE_INVITATIONS_ACCEPT = "/invitations/token/:token";
declare const ROUTE_INVITATIONS_CREATE = "/invitations";
declare const ROUTE_INVITATIONS_GET_BY_TOKEN = "/invitations/token/:token";
declare const ROUTE_INVITATIONS_RESEND = "/invitations/resend/:id(^\\d+)";
declare const ROUTE_INVITATIONS_REVOKE = "/invitations/revoke/:id(^\\d+)";
declare const TABLE_INVITATIONS = "invitations";
declare const RESET_PASSWORD_PATH = "/reset-password";
declare const ROLE_ADMIN = "ADMIN";
declare const ROLE_SUPER_ADMIN = "SUPER_ADMIN";
declare const ROLE_USER = "USER";
declare const ROUTE_CHANGE_PASSWORD = "/change_password";
declare const ROUTE_SIGNUP_ADMIN = "/signup/admin";
declare const ROUTE_ME = "/me";
declare const ROUTE_USERS = "/users";
declare const ROUTE_USERS_DISABLE = "/users/:id/disable";
declare const ROUTE_USERS_ENABLE = "/users/:id/enable";
declare const TABLE_USERS = "users";
declare const ROUTE_ROLES = "/roles";
declare const ROUTE_ROLES_PERMISSIONS = "/roles/permissions";
declare const ROUTE_PERMISSIONS = "/permissions";
declare const EMAIL_VERIFICATION_MODE = "REQUIRED";
declare const EMAIL_VERIFICATION_PATH = "/verify-email";
declare const PERMISSIONS_INVITATIONS_CREATE = "invitations:create";
declare const PERMISSIONS_INVITATIONS_LIST = "invitations:list";
declare const PERMISSIONS_INVITATIONS_RESEND = "invitations:resend";
declare const PERMISSIONS_INVITATIONS_REVOKE = "invitations:revoke";
declare const PERMISSIONS_USERS_DISABLE = "users:disable";
declare const PERMISSIONS_USERS_ENABLE = "users:enable";
declare const PERMISSIONS_USERS_LIST = "users:enable";
declare const TENANT_ID = "public";
export { EMAIL_VERIFICATION_MODE, EMAIL_VERIFICATION_PATH, INVITATION_ACCEPT_LINK_PATH, INVITATION_EXPIRE_AFTER_IN_DAYS, PERMISSIONS_INVITATIONS_LIST, PERMISSIONS_INVITATIONS_RESEND, PERMISSIONS_INVITATIONS_REVOKE, PERMISSIONS_USERS_DISABLE, PERMISSIONS_USERS_ENABLE, PERMISSIONS_USERS_LIST, TENANT_ID, RESET_PASSWORD_PATH, ROLE_ADMIN, ROLE_SUPER_ADMIN, ROLE_USER, ROUTE_CHANGE_PASSWORD, ROUTE_INVITATIONS, ROUTE_INVITATIONS_ACCEPT, ROUTE_INVITATIONS_CREATE, ROUTE_INVITATIONS_GET_BY_TOKEN, ROUTE_INVITATIONS_RESEND, ROUTE_INVITATIONS_REVOKE, ROUTE_ME, ROUTE_PERMISSIONS, ROUTE_ROLES, PERMISSIONS_INVITATIONS_CREATE, ROUTE_ROLES_PERMISSIONS, ROUTE_SIGNUP_ADMIN, ROUTE_USERS, ROUTE_USERS_DISABLE, ROUTE_USERS_ENABLE, TABLE_INVITATIONS, TABLE_USERS, };
//# sourceMappingURL=constants.d.ts.map
import "@dzangolab/fastify-mercurius";
import h from "fastify-plugin";
import S from "mercurius";
import E from "mercurius-auth";
import I from "@fastify/cors";
import T from "@fastify/formbody";
import v from "supertokens-node";
import { errorHandler as C, plugin as D, wrapResponse as k } from "supertokens-node/framework/fastify";
import { verifySession as b } from "supertokens-node/recipe/session/framework/fastify";
import m from "supertokens-node/recipe/session";
import d, { getUserByThirdPartyInfo as N } from "supertokens-node/recipe/thirdpartyemailpassword";
import l from "supertokens-node/recipe/userroles";
import { DefaultSqlFactory as _, BaseService as F } from "@dzangolab/fastify-slonik";
import "@dzangolab/fastify-mailer";
const L = h(async (s) => {
  s.config.mercurius.enabled && s.register(E, {
    async applyPolicy(e, o, n, t) {
      if (!t.user) {
        const i = new S.ErrorWithProps("unauthorized");
        return i.statusCode = 200, i;
      }
      return !0;
    },
    authDirective: "auth"
  });
}), A = () => ({
  override: {
    functions: function(s) {
      return {
        ...s,
        createNewSession: async function(r) {
          return r.accessTokenPayload = {
            ...r.accessTokenPayload,
            user: await d.getUserById(r.userId, {
              tenant: r.userContext.tenant
            })
          }, s.createNewSession(r);
        }
      };
    }
  }
}), x = (s) => {
  const r = s.config.user.supertokens.recipes;
  return r && r.session ? m.init(r.session(s)) : m.init(A());
}, R = (s) => s.multiTenant?.table?.columns?.id || "id", f = {
  addTenantPrefix: (s, r, e) => (e && (r = e[R(s)] + "_" + r), r),
  removeTenantPrefix: (s, r) => (r && (s = s.slice(Math.max(0, s.indexOf("_") + 1))), s)
}, B = (s, r) => async (e) => {
  const o = e.email;
  e.email = f.addTenantPrefix(
    r.config,
    e.email,
    e.userContext.tenant
  );
  let n = await s.emailPasswordSignIn(
    e
  );
  return n.status === "OK" && (n = {
    ...n,
    user: { ...n.user, email: o }
  }), n;
};
class $ extends _ {
  /* eslint-enabled */
}
class w extends F {
  /* eslint-enabled */
  static LIMIT_DEFAULT = 20;
  static LIMIT_MAX = 50;
  get table() {
    return this.config.user?.table?.name || "users";
  }
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new $(this)), this._factory;
  }
}
const K = (s, r) => async (e) => {
  e.userContext.tenant = e.options.req.original.tenant;
  const { config: o, slonik: n } = r;
  if (s.emailPasswordSignInPOST === void 0)
    throw new Error("Should never come here");
  const t = await s.emailPasswordSignInPOST(e);
  if (t.status !== "OK")
    return t;
  const i = new w(o, n);
  let a = null;
  try {
    a = await i.findById(t.user.id);
  } catch {
  }
  const { roles: c } = await l.getRolesForUser(t.user.id);
  return {
    status: "OK",
    user: {
      ...t.user,
      profile: a,
      roles: c
    },
    session: t.session
  };
}, O = async ({
  fastify: s,
  subject: r,
  templateData: e = {},
  templateName: o,
  to: n
}) => {
  const { config: t, mailer: i, log: a } = s;
  return i.sendMail({
    subject: r,
    templateName: o,
    to: n,
    templateData: {
      appName: t.appName,
      ...e
    }
  }).catch((c) => {
    throw a.error(c.stack), {
      name: "SEND_EMAIL",
      message: c.message,
      statusCode: 500
    };
  });
}, M = (s, r) => {
  const { config: e, log: o } = r;
  return async (n) => {
    if (e.user.features?.signUp === !1)
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404
      };
    const t = n.email;
    n.email = f.addTenantPrefix(
      e,
      n.email,
      n.userContext.tenant
    );
    let i = await s.emailPasswordSignUp(
      n
    );
    if (e.user.supertokens.sendUserAlreadyExistsWarning && i.status === "EMAIL_ALREADY_EXISTS_ERROR")
      try {
        await O({
          fastify: r,
          subject: "Duplicate Email Registration",
          templateData: {
            emailId: t
          },
          templateName: "duplicate-email-warning",
          to: t
        });
      } catch (a) {
        o.error(a);
      }
    return i.status === "OK" && (i = {
      ...i,
      user: { ...i.user, email: t }
    }), i;
  };
}, H = (s, r) => {
  const { log: e, config: o } = r;
  return async (n) => {
    if (n.userContext.tenant = n.options.req.original.tenant, s.emailPasswordSignUpPOST === void 0)
      throw new Error("Should never come here");
    const t = await s.emailPasswordSignUpPOST(n);
    if (t.status === "OK") {
      const i = await l.addRoleToUser(
        t.user.id,
        o.user.role || "USER"
      );
      i.status !== "OK" && e.error(i.status);
      const { roles: a } = await l.getRolesForUser(
        t.user.id
      );
      return {
        status: "OK",
        user: {
          ...t.user,
          /* eslint-disable-next-line unicorn/no-null */
          profile: null,
          roles: a
        },
        session: t.session
      };
    }
    return t;
  };
}, J = (s, r, e) => (e && r.find((o) => {
  o.id === "email" && (o.value = e[R(s)] + "_" + o.value);
}), r), V = (s, r) => async (e) => {
  if (e.userContext.tenant = e.options.req.original.tenant, s.generatePasswordResetTokenPOST === void 0)
    throw new Error("Should never come here");
  return e.formFields = J(
    r.config,
    e.formFields,
    e.userContext.tenant
  ), await s.generatePasswordResetTokenPOST(e);
}, W = (s) => async (r) => {
  let e = await s.getUserById(r);
  return e && r.userContext.tenant && (e = {
    ...e,
    email: f.removeTenantPrefix(e.email, r.userContext.tenant)
  }), e;
}, G = (s) => {
  let r;
  try {
    if (r = new URL(s).origin, !r || r === "null")
      throw console.log("Error"), new Error("Origin is empty");
  } catch {
    r = "";
  }
  return r;
}, Q = (s) => {
  const r = s.config.appOrigin[0], e = "/reset-password";
  return async (o) => {
    const n = o.userContext._default.request.request, t = n.headers.referer || n.headers.origin || n.hostname, i = G(t) || r, a = o.passwordResetLink.replace(
      r + "/auth/reset-password",
      i + (s.config.user.supertokens.resetPasswordPath ? s.config.user.supertokens.resetPasswordPath : e)
    );
    await O({
      fastify: s,
      subject: "Reset Password",
      templateName: "reset-password",
      to: f.removeTenantPrefix(o.user.email, o.userContext.tenant),
      templateData: {
        passwordResetLink: a
      }
    });
  };
}, j = (s, r) => async (e) => {
  const o = e.userContext.tenant;
  if (o) {
    const i = o[R(r.config)];
    e.thirdPartyUserId = i + "_" + e.thirdPartyUserId;
  }
  if (!await N(
    e.thirdPartyId,
    e.thirdPartyUserId,
    e.userContext
  ) && r.config.user.features?.signUp === !1)
    throw {
      name: "SIGN_UP_DISABLED",
      message: "SignUp feature is currently disabled",
      statusCode: 404
    };
  return await s.thirdPartySignInUp(e);
}, q = (s, r) => {
  const { log: e, config: o } = r;
  return async (n) => {
    if (n.userContext.tenant = n.options.req.original.tenant, s.thirdPartySignInUpPOST === void 0)
      throw new Error("Should never come here");
    const t = await s.thirdPartySignInUpPOST(n);
    if (t.status === "OK" && t.createdNewUser) {
      const i = await l.addRoleToUser(
        t.user.id,
        o.user.role || "USER"
      );
      i.status !== "OK" && e.error(i.status);
      const { roles: a } = await l.getRolesForUser(
        t.user.id
      ), c = {
        ...t.user,
        /* eslint-disable-next-line unicorn/no-null */
        profile: null,
        roles: a
      };
      return {
        status: "OK",
        createdNewUser: t.createdNewUser,
        user: c,
        session: t.session,
        authCodeResponse: t.authCodeResponse
      };
    }
    return t;
  };
}, z = (s) => {
  const { Apple: r, Facebook: e, Github: o, Google: n } = d, t = s.user.supertokens.providers, i = [], a = [
    { name: "google", initProvider: n },
    { name: "github", initProvider: o },
    { name: "facebook", initProvider: e },
    { name: "apple", initProvider: r }
  ];
  for (const c of a)
    t?.[c.name] && i.push(
      c.initProvider(t[c.name])
    );
  return i;
}, X = (s, r) => {
  const e = s.split("@")?.[1];
  return e ? !!r.includes(e) : !1;
}, Y = (s) => {
  const { config: r } = s;
  return {
    override: {
      apis: (e) => ({
        ...e,
        emailPasswordSignInPOST: K(
          e,
          s
        ),
        emailPasswordSignUpPOST: H(
          e,
          s
        ),
        generatePasswordResetTokenPOST: V(
          e,
          s
        ),
        thirdPartySignInUpPOST: q(
          e,
          s
        )
      }),
      functions: (e) => ({
        ...e,
        emailPasswordSignIn: B(
          e,
          s
        ),
        emailPasswordSignUp: M(
          e,
          s
        ),
        getUserById: W(e),
        thirdPartySignInUp: j(
          e,
          s
        )
      })
    },
    signUpFeature: {
      formFields: [
        {
          id: "email",
          validate: async (e) => {
            const o = /^([\w+.]+)(\w)(@)(\w+)(\.\w+)+$/, n = r.user.supertokens.supportedEmailDomains;
            if (!o.test(e))
              return "Email is invalid";
            if (n && n.filter((t) => !!t).length !== 0 && !X(
              e,
              r.user.supertokens.supportedEmailDomains
            ))
              return "Unsupported Email Domain";
          }
        }
      ]
    },
    emailDelivery: {
      override: (e) => ({
        ...e,
        sendEmail: Q(s)
      })
    },
    providers: z(r)
  };
}, Z = (s) => {
  const r = s.config.user.supertokens.recipes;
  return r && r.thirdPartyEmailPassword ? d.init(
    r.thirdPartyEmailPassword(s)
  ) : d.init(
    Y(s)
  );
}, ee = () => ({}), se = (s) => {
  const r = s.config.user.supertokens.recipes;
  return r && r.userRoles ? l.init(r.userRoles(s)) : l.init(ee());
}, re = (s) => [
  x(s),
  Z(s),
  se(s)
], te = (s) => {
  const { config: r } = s;
  v.init({
    appInfo: {
      apiDomain: r.baseUrl,
      appName: r.appName,
      websiteDomain: r.appOrigin[0]
    },
    recipeList: re(s),
    supertokens: {
      connectionURI: r.user.supertokens.connectionUri
    }
  });
}, ne = async (s, r, e) => {
  const { config: o, log: n } = s;
  n.info("Registering supertokens plugin"), te(s), s.setErrorHandler(C()), s.register(I, {
    origin: o.appOrigin,
    allowedHeaders: [
      "Content-Type",
      "st-auth-mode",
      ...v.getAllCORSHeaders()
    ],
    credentials: !0
  }), s.register(T), s.register(D), n.info("Registering supertokens plugin complete"), s.decorate("verifySession", b), e();
}, oe = h(ne), ie = async (s, r, e) => {
  const { config: o, slonik: n, tenant: t } = r, a = (await m.getSession(r, k(e), {
    sessionRequired: !1
  }))?.getUserId();
  if (a) {
    const c = new w(o, n), u = await d.getUserById(a, { tenant: t });
    if (u) {
      let g = null;
      const { roles: p } = await l.getRolesForUser(a);
      try {
        g = await c.findById(a);
      } catch {
      }
      const U = {
        ...u,
        profile: g,
        roles: p
      };
      s.user = U;
    }
  }
}, ae = h(
  async (s, r, e) => {
    const { mercurius: o } = s.config;
    await s.register(oe), o.enabled && await s.register(L), e();
  }
);
ae.updateContext = ie;
const ce = {
  user: async (s, r, e) => await new w(e.config, e.database).findById(r.id),
  users: async (s, r, e) => await new w(e.config, e.database).list(
    r.limit,
    r.offset,
    r.filters ? JSON.parse(JSON.stringify(r.filters)) : void 0,
    r.sort ? JSON.parse(JSON.stringify(r.sort)) : void 0
  )
}, Ee = { Query: ce }, Ie = async (s, r, e) => {
  const o = "/users";
  s.get(
    o,
    {
      preHandler: s.verifySession()
    },
    async (n, t) => {
      const i = new w(n.config, n.slonik), { limit: a, offset: c, filters: u, sort: g } = n.query, p = await i.list(
        a,
        c,
        u ? JSON.parse(u) : void 0,
        g ? JSON.parse(g) : void 0
      );
      t.send(p);
    }
  ), e();
};
class P {
  config;
  database;
  constructor(r, e) {
    this.config = r, this.database = e;
  }
  changePassword = async (r, e, o, n) => {
    const t = await d.getUserById(r, {
      tenant: n
    }), i = /^(?=.*?[a-z]).{8,}$/, a = /^(?=.*?\d).{8,}$/;
    if (!/^.{8,}$/.test(o))
      return {
        status: "FIELD_ERROR",
        message: "Password must contain at least 8 characters"
      };
    if (!i.test(o))
      return {
        status: "FIELD_ERROR",
        message: "Password must contain at least one lower case alphabet"
      };
    if (!a.test(o))
      return {
        status: "FIELD_ERROR",
        message: "Password must contain at least one number"
      };
    if (e && o)
      if (t)
        if ((await d.emailPasswordSignIn(
          t.email,
          e,
          { tenant: n }
        )).status === "OK") {
          if (await d.updateEmailOrPassword({
            userId: r,
            password: o,
            userContext: { tenant: n }
          }))
            return await m.revokeAllSessionsForUser(r), {
              status: "OK"
            };
          throw {
            status: "FAILED",
            message: "Oops! Something went wrong, couldn't change password"
          };
        } else
          return {
            status: "INVALID_PASSWORD",
            message: "Invalid password"
          };
      else
        throw {
          status: "NOT_FOUND",
          message: "User not found"
        };
    else
      return {
        status: "FIELD_ERROR",
        message: "Password cannot be empty"
      };
  };
  getUserById = async (r, e) => {
    const o = await d.getUserById(r, { tenant: e }), n = new w(this.config, this.database);
    let t = null;
    try {
      t = await n.findById(r);
    } catch {
    }
    const i = await l.getRolesForUser(r);
    return {
      email: o?.email,
      id: r,
      profile: t,
      roles: i.roles,
      timeJoined: o?.timeJoined
    };
  };
}
const ue = {
  changePassword: async (s, r, e) => {
    const o = new P(e.config, e.database);
    try {
      return e.user?.id ? await o.changePassword(
        e.user?.id,
        r.oldPassword,
        r.newPassword,
        e.tenant
      ) : {
        status: "NOT_FOUND",
        message: "User not found"
      };
    } catch (n) {
      e.app.log.error(n);
      const t = new S.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return t.statusCode = 500, t;
    }
  }
}, de = {
  me: async (s, r, e) => {
    const o = new P(e.config, e.database);
    if (e.user?.id)
      return o.getUserById(e.user.id, e.tenant);
    {
      e.app.log.error("Cound not get user id from mercurius context");
      const n = new S.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return n.statusCode = 500, n;
    }
  }
}, Te = { Mutation: ue, Query: de }, Ce = async (s, r, e) => {
  const o = "/change_password", n = "/me";
  s.post(
    o,
    {
      preHandler: s.verifySession()
    },
    async (t, i) => {
      try {
        const a = t.session, c = t.body, u = a && a.getUserId();
        if (!u)
          throw new Error("User not found in session");
        const g = c.oldPassword ?? "", p = c.newPassword ?? "", y = await new P(t.config, t.slonik).changePassword(
          u,
          g,
          p,
          t.tenant
        );
        i.send(y);
      } catch (a) {
        s.log.error(a), i.status(500), i.send({
          status: "ERROR",
          message: "Oops! Something went wrong",
          error: a
        });
      }
    }
  ), s.get(
    n,
    {
      preHandler: s.verifySession()
    },
    async (t, i) => {
      const a = new P(t.config, t.slonik), c = t.session?.getUserId();
      if (c)
        i.send(await a.getUserById(c, t.tenant));
      else
        throw s.log.error("Cound not get user id from session"), new Error("Oops, Something went wrong");
    }
  ), e();
};
export {
  w as UserProfileService,
  P as UserService,
  ae as default,
  Ee as userProfileResolver,
  Ie as userProfileRoutes,
  Te as userResolver,
  Ce as userRoutes
};

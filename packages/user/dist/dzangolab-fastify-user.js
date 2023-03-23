import "@dzangolab/fastify-mercurius";
import P from "fastify-plugin";
import S from "mercurius";
import b from "mercurius-auth";
import k from "@fastify/cors";
import N from "@fastify/formbody";
import R from "supertokens-node";
import { errorHandler as _, plugin as D, wrapResponse as L } from "supertokens-node/framework/fastify";
import { verifySession as F } from "supertokens-node/recipe/session/framework/fastify";
import p from "supertokens-node/recipe/session";
import d, { getUserByThirdPartyInfo as $ } from "supertokens-node/recipe/thirdpartyemailpassword";
import l from "supertokens-node/recipe/userroles";
import { DefaultSqlFactory as A, BaseService as B } from "@dzangolab/fastify-slonik";
import "@dzangolab/fastify-mailer";
import y from "validator";
import { z as O } from "zod";
const x = P(async (e) => {
  e.config.mercurius.enabled && e.register(b, {
    async applyPolicy(s, t, o, n) {
      if (!n.user) {
        const i = new S.ErrorWithProps("unauthorized");
        return i.statusCode = 200, i;
      }
      return !0;
    },
    authDirective: "auth"
  });
}), K = () => ({
  override: {
    functions: function(e) {
      return {
        ...e,
        createNewSession: async function(r) {
          return r.accessTokenPayload = {
            ...r.accessTokenPayload,
            user: await d.getUserById(r.userId, {
              tenant: r.userContext.tenant
            })
          }, e.createNewSession(r);
        }
      };
    }
  }
}), q = (e) => {
  const r = e.config.user.supertokens.recipes;
  return r && r.session ? p.init(r.session(e)) : p.init(K());
}, U = (e) => e.multiTenant?.table?.columns?.id || "id", f = {
  addTenantPrefix: (e, r, s) => (s && (r = s[U(e)] + "_" + r), r),
  removeTenantPrefix: (e, r) => (r && (e = e.slice(Math.max(0, e.indexOf("_") + 1))), e)
}, M = (e, r) => async (s) => {
  const t = s.email;
  s.email = f.addTenantPrefix(
    r.config,
    s.email,
    s.userContext.tenant
  );
  let o = await e.emailPasswordSignIn(
    s
  );
  return o.status === "OK" && (o = {
    ...o,
    user: { ...o.user, email: t }
  }), o;
};
class H extends A {
  /* eslint-enabled */
}
class m extends B {
  /* eslint-enabled */
  static LIMIT_DEFAULT = 20;
  static LIMIT_MAX = 50;
  get table() {
    return this.config.user?.table?.name || "users";
  }
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new H(this)), this._factory;
  }
}
const J = (e, r) => async (s) => {
  s.userContext.tenant = s.options.req.original.tenant;
  const { config: t, slonik: o } = r;
  if (e.emailPasswordSignInPOST === void 0)
    throw new Error("Should never come here");
  const n = await e.emailPasswordSignInPOST(s);
  if (n.status !== "OK")
    return n;
  const i = new m(t, o);
  let a = null;
  try {
    a = await i.findById(n.user.id);
  } catch {
  }
  const { roles: c } = await l.getRolesForUser(n.user.id);
  return {
    status: "OK",
    user: {
      ...n.user,
      profile: a,
      roles: c
    },
    session: n.session
  };
}, E = async ({
  fastify: e,
  subject: r,
  templateData: s = {},
  templateName: t,
  to: o
}) => {
  const { config: n, mailer: i, log: a } = e;
  return i.sendMail({
    subject: r,
    templateName: t,
    to: o,
    templateData: {
      appName: n.appName,
      ...s
    }
  }).catch((c) => {
    throw a.error(c.stack), {
      name: "SEND_EMAIL",
      message: c.message,
      statusCode: 500
    };
  });
}, W = (e, r) => {
  const { config: s, log: t } = r;
  return async (o) => {
    if (s.user.features?.signUp === !1)
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404
      };
    const n = o.email;
    o.email = f.addTenantPrefix(
      s,
      o.email,
      o.userContext.tenant
    );
    let i = await e.emailPasswordSignUp(
      o
    );
    if (s.user.supertokens.sendUserAlreadyExistsWarning && i.status === "EMAIL_ALREADY_EXISTS_ERROR")
      try {
        await E({
          fastify: r,
          subject: "Duplicate Email Registration",
          templateData: {
            emailId: n
          },
          templateName: "duplicate-email-warning",
          to: n
        });
      } catch (a) {
        t.error(a);
      }
    return i.status === "OK" && (i = {
      ...i,
      user: { ...i.user, email: n }
    }), i;
  };
}, G = (e, r) => {
  const { log: s, config: t } = r;
  return async (o) => {
    if (o.userContext.tenant = o.options.req.original.tenant, e.emailPasswordSignUpPOST === void 0)
      throw new Error("Should never come here");
    const n = await e.emailPasswordSignUpPOST(o);
    if (n.status === "OK") {
      const i = await l.addRoleToUser(
        n.user.id,
        t.user.role || "USER"
      );
      i.status !== "OK" && s.error(i.status);
      const { roles: a } = await l.getRolesForUser(
        n.user.id
      );
      return {
        status: "OK",
        user: {
          ...n.user,
          /* eslint-disable-next-line unicorn/no-null */
          profile: null,
          roles: a
        },
        session: n.session
      };
    }
    return n;
  };
}, V = (e, r, s) => (s && r.find((t) => {
  t.id === "email" && (t.value = s[U(e)] + "_" + t.value);
}), r), j = (e, r) => async (s) => {
  if (s.userContext.tenant = s.options.req.original.tenant, e.generatePasswordResetTokenPOST === void 0)
    throw new Error("Should never come here");
  return s.formFields = V(
    r.config,
    s.formFields,
    s.userContext.tenant
  ), await e.generatePasswordResetTokenPOST(s);
}, Q = (e) => async (r) => {
  let s = await e.getUserById(r);
  return s && r.userContext.tenant && (s = {
    ...s,
    email: f.removeTenantPrefix(s.email, r.userContext.tenant)
  }), s;
}, z = (e) => {
  let r;
  try {
    if (r = new URL(e).origin, !r || r === "null")
      throw console.log("Error"), new Error("Origin is empty");
  } catch {
    r = "";
  }
  return r;
}, X = (e) => {
  const r = e.config.appOrigin[0], s = "/reset-password";
  return async (t) => {
    const o = t.userContext._default.request.request, n = o.headers.referer || o.headers.origin || o.hostname, i = z(n) || r, a = t.passwordResetLink.replace(
      r + "/auth/reset-password",
      i + (e.config.user.supertokens.resetPasswordPath ? e.config.user.supertokens.resetPasswordPath : s)
    );
    await E({
      fastify: e,
      subject: "Reset Password",
      templateName: "reset-password",
      to: f.removeTenantPrefix(t.user.email, t.userContext.tenant),
      templateData: {
        passwordResetLink: a
      }
    });
  };
}, Y = (e, r) => async (s) => {
  const t = s.userContext.tenant;
  if (t) {
    const i = t[U(r.config)];
    s.thirdPartyUserId = i + "_" + s.thirdPartyUserId;
  }
  if (!await $(
    s.thirdPartyId,
    s.thirdPartyUserId,
    s.userContext
  ) && r.config.user.features?.signUp === !1)
    throw {
      name: "SIGN_UP_DISABLED",
      message: "SignUp feature is currently disabled",
      statusCode: 404
    };
  return await e.thirdPartySignInUp(s);
}, Z = (e, r) => {
  const { log: s, config: t } = r;
  return async (o) => {
    if (o.userContext.tenant = o.options.req.original.tenant, e.thirdPartySignInUpPOST === void 0)
      throw new Error("Should never come here");
    const n = await e.thirdPartySignInUpPOST(o);
    if (n.status === "OK" && n.createdNewUser) {
      const i = await l.addRoleToUser(
        n.user.id,
        t.user.role || "USER"
      );
      i.status !== "OK" && s.error(i.status);
      const { roles: a } = await l.getRolesForUser(
        n.user.id
      ), c = {
        ...n.user,
        /* eslint-disable-next-line unicorn/no-null */
        profile: null,
        roles: a
      };
      return {
        status: "OK",
        createdNewUser: n.createdNewUser,
        user: c,
        session: n.session,
        authCodeResponse: n.authCodeResponse
      };
    }
    return n;
  };
}, ee = (e) => {
  const { Apple: r, Facebook: s, Github: t, Google: o } = d, n = e.user.supertokens.providers, i = [], a = [
    { name: "google", initProvider: o },
    { name: "github", initProvider: t },
    { name: "facebook", initProvider: s },
    { name: "apple", initProvider: r }
  ];
  for (const c of a)
    n?.[c.name] && i.push(
      c.initProvider(n[c.name])
    );
  return i;
}, se = (e, r) => O.string({
  required_error: e.required
}).refine((s) => y.isEmail(s, r || {}), {
  message: e.invalid
}), T = {
  minLength: 8,
  minLowercase: 0,
  minUppercase: 0,
  minNumbers: 0,
  minSymbols: 0,
  returnScore: !1,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10
}, re = (e, r) => {
  const s = {
    ...T,
    ...r
  };
  return O.string({
    required_error: e.required
  }).refine(
    (t) => y.isStrongPassword(
      t,
      s
    ),
    {
      message: e.weak
    }
  );
}, te = (e, r) => {
  const { supportedEmailDomains: s, validatorOptions: t } = r.user.supertokens;
  let o = [];
  s && s.some((a) => !!a) && (o = s);
  const n = t?.email?.host_whitelist;
  n && (o = [...o, ...n]), (!o || o.filter((a) => !!a).length === 0) && (o = void 0);
  const i = se(
    {
      invalid: "Email is invalid",
      required: "Email is required"
    },
    {
      ...t?.email,
      host_whitelist: o
    }
  ).safeParse(e);
  return i.success ? { success: !0 } : {
    message: i.error.issues[0].message,
    success: !1
  };
}, ne = (e) => {
  let r = "Password is too weak";
  if (!e)
    return r;
  const s = [];
  if (e.minLength) {
    const t = e.minLength;
    s.push(
      `minimum ${t} ${t > 1 ? "characters" : "character"}`
    );
  }
  if (e.minLowercase) {
    const t = e.minLowercase;
    s.push(
      `minimum ${t} ${t > 1 ? "lowercases" : "lowercase"}`
    );
  }
  if (e.minUppercase) {
    const t = e.minUppercase;
    s.push(
      `minimum ${t} ${t > 1 ? "uppercases" : "uppercase"}`
    );
  }
  if (e.minNumbers) {
    const t = e.minNumbers;
    s.push(`minimum ${t} ${t > 1 ? "numbers" : "number"}`);
  }
  if (e.minSymbols) {
    const t = e.minSymbols;
    s.push(`minimum ${t} ${t > 1 ? "symbols" : "symbol"}`);
  }
  if (s.length > 0) {
    r = "Passsword should contain ";
    const t = s.pop();
    s.length > 0 && (r += s.join(", ") + " and "), r += t;
  }
  return r;
}, I = (e, r) => {
  const s = r.user.supertokens.validatorOptions?.password, t = re(
    {
      required: "Password is required",
      weak: ne({ ...T, ...s })
    },
    s
  ).safeParse(e);
  return t.success ? { success: !0 } : {
    message: t.error.issues[0].message,
    success: !1
  };
}, oe = (e) => {
  const { config: r } = e;
  return {
    override: {
      apis: (s) => ({
        ...s,
        emailPasswordSignInPOST: J(
          s,
          e
        ),
        emailPasswordSignUpPOST: G(
          s,
          e
        ),
        generatePasswordResetTokenPOST: j(
          s,
          e
        ),
        thirdPartySignInUpPOST: Z(
          s,
          e
        )
      }),
      functions: (s) => ({
        ...s,
        emailPasswordSignIn: M(
          s,
          e
        ),
        emailPasswordSignUp: W(
          s,
          e
        ),
        getUserById: Q(s),
        thirdPartySignInUp: Y(
          s,
          e
        )
      })
    },
    signUpFeature: {
      formFields: [
        {
          id: "email",
          validate: async (s) => {
            const t = te(s, r);
            if (!t.success)
              return t.message;
          }
        },
        {
          id: "password",
          validate: async (s) => {
            const t = I(s, r);
            if (!t.success)
              return t.message;
          }
        }
      ]
    },
    emailDelivery: {
      override: (s) => ({
        ...s,
        sendEmail: X(e)
      })
    },
    providers: ee(r)
  };
}, ie = (e) => {
  const r = e.config.user.supertokens.recipes;
  return r && r.thirdPartyEmailPassword ? d.init(
    r.thirdPartyEmailPassword(e)
  ) : d.init(
    oe(e)
  );
}, ae = () => ({}), ce = (e) => {
  const r = e.config.user.supertokens.recipes;
  return r && r.userRoles ? l.init(r.userRoles(e)) : l.init(ae());
}, ue = (e) => [
  q(e),
  ie(e),
  ce(e)
], de = (e) => {
  const { config: r } = e;
  R.init({
    appInfo: {
      apiDomain: r.baseUrl,
      appName: r.appName,
      websiteDomain: r.appOrigin[0]
    },
    recipeList: ue(e),
    supertokens: {
      connectionURI: r.user.supertokens.connectionUri
    }
  });
}, le = async (e, r, s) => {
  const { config: t, log: o } = e;
  o.info("Registering supertokens plugin"), de(e), e.setErrorHandler(_()), e.register(k, {
    origin: t.appOrigin,
    allowedHeaders: [
      "Content-Type",
      "st-auth-mode",
      ...R.getAllCORSHeaders()
    ],
    credentials: !0
  }), e.register(N), e.register(D), o.info("Registering supertokens plugin complete"), e.decorate("verifySession", F), s();
}, ge = P(le), me = async (e, r, s) => {
  const { config: t, slonik: o, tenant: n } = r, a = (await p.getSession(r, L(s), {
    sessionRequired: !1
  }))?.getUserId();
  if (a) {
    const c = new m(t, o), u = await d.getUserById(a, { tenant: n });
    if (u) {
      let g = null;
      const { roles: w } = await l.getRolesForUser(a);
      try {
        g = await c.findById(a);
      } catch {
      }
      const v = {
        ...u,
        profile: g,
        roles: w
      };
      e.user = v;
    }
  }
}, we = P(
  async (e, r, s) => {
    const { mercurius: t } = e.config;
    await e.register(ge), t.enabled && await e.register(x), s();
  }
);
we.updateContext = me;
const pe = {
  user: async (e, r, s) => await new m(s.config, s.database).findById(r.id),
  users: async (e, r, s) => await new m(s.config, s.database).list(
    r.limit,
    r.offset,
    r.filters ? JSON.parse(JSON.stringify(r.filters)) : void 0,
    r.sort ? JSON.parse(JSON.stringify(r.sort)) : void 0
  )
}, Le = { Query: pe }, Fe = async (e, r, s) => {
  const t = "/users";
  e.get(
    t,
    {
      preHandler: e.verifySession()
    },
    async (o, n) => {
      const i = new m(o.config, o.slonik), { limit: a, offset: c, filters: u, sort: g } = o.query, w = await i.list(
        a,
        c,
        u ? JSON.parse(u) : void 0,
        g ? JSON.parse(g) : void 0
      );
      n.send(w);
    }
  ), s();
};
class h {
  config;
  database;
  constructor(r, s) {
    this.config = r, this.database = s;
  }
  changePassword = async (r, s, t, o) => {
    const n = I(t, this.config);
    if (!n.success)
      return {
        status: "FIELD_ERROR",
        message: n.message
      };
    const i = await d.getUserById(r, {
      tenant: o
    });
    if (s && t)
      if (i)
        if ((await d.emailPasswordSignIn(
          i.email,
          s,
          { tenant: o }
        )).status === "OK") {
          if (await d.updateEmailOrPassword({
            userId: r,
            password: t,
            userContext: { tenant: o }
          }))
            return await p.revokeAllSessionsForUser(r), {
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
  getUserById = async (r, s) => {
    const t = await d.getUserById(r, { tenant: s }), o = new m(this.config, this.database);
    let n = null;
    try {
      n = await o.findById(r);
    } catch {
    }
    const i = await l.getRolesForUser(r);
    return {
      email: t?.email,
      id: r,
      profile: n,
      roles: i.roles,
      timeJoined: t?.timeJoined
    };
  };
}
const he = {
  changePassword: async (e, r, s) => {
    const t = new h(s.config, s.database);
    try {
      return s.user?.id ? await t.changePassword(
        s.user?.id,
        r.oldPassword,
        r.newPassword,
        s.tenant
      ) : {
        status: "NOT_FOUND",
        message: "User not found"
      };
    } catch (o) {
      s.app.log.error(o);
      const n = new S.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return n.statusCode = 500, n;
    }
  }
}, fe = {
  me: async (e, r, s) => {
    const t = new h(s.config, s.database);
    if (s.user?.id)
      return t.getUserById(s.user.id, s.tenant);
    {
      s.app.log.error("Cound not get user id from mercurius context");
      const o = new S.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return o.statusCode = 500, o;
    }
  }
}, $e = { Mutation: he, Query: fe }, Ae = async (e, r, s) => {
  const t = "/change_password", o = "/me";
  e.post(
    t,
    {
      preHandler: e.verifySession()
    },
    async (n, i) => {
      try {
        const a = n.session, c = n.body, u = a && a.getUserId();
        if (!u)
          throw new Error("User not found in session");
        const g = c.oldPassword ?? "", w = c.newPassword ?? "", C = await new h(n.config, n.slonik).changePassword(
          u,
          g,
          w,
          n.tenant
        );
        i.send(C);
      } catch (a) {
        e.log.error(a), i.status(500), i.send({
          status: "ERROR",
          message: "Oops! Something went wrong",
          error: a
        });
      }
    }
  ), e.get(
    o,
    {
      preHandler: e.verifySession()
    },
    async (n, i) => {
      const a = new h(n.config, n.slonik), c = n.session?.getUserId();
      if (c)
        i.send(await a.getUserById(c, n.tenant));
      else
        throw e.log.error("Cound not get user id from session"), new Error("Oops, Something went wrong");
    }
  ), s();
};
export {
  m as UserProfileService,
  h as UserService,
  we as default,
  Le as userProfileResolver,
  Fe as userProfileRoutes,
  $e as userResolver,
  Ae as userRoutes
};

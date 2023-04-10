import "@dzangolab/fastify-mercurius";
import h from "fastify-plugin";
import S from "mercurius";
import b from "mercurius-auth";
import k from "@fastify/cors";
import N from "@fastify/formbody";
import v from "supertokens-node";
import { errorHandler as D, plugin as _, wrapResponse as L } from "supertokens-node/framework/fastify";
import { verifySession as F } from "supertokens-node/recipe/session/framework/fastify";
import p from "supertokens-node/recipe/session";
import d, { getUserByThirdPartyInfo as $ } from "supertokens-node/recipe/thirdpartyemailpassword";
import l from "supertokens-node/recipe/userroles";
import { DefaultSqlFactory as A, BaseService as B } from "@dzangolab/fastify-slonik";
import "@dzangolab/fastify-mailer";
import R from "validator";
import { z as O } from "zod";
const x = h(async (s) => {
  s.config.mercurius.enabled && s.register(b, {
    async applyPolicy(e, t, n, o) {
      if (!o.user) {
        const i = new S.ErrorWithProps("unauthorized");
        return i.statusCode = 200, i;
      }
      return !0;
    },
    authDirective: "auth"
  });
}), K = () => ({
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
}), q = (s) => {
  const r = s.config.user.supertokens.recipes;
  return r && r.session ? p.init(r.session(s)) : p.init(K());
};
class M extends A {
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
    return this._factory || (this._factory = new M(this)), this._factory;
  }
}
const U = (s) => s.multiTenant?.table?.columns?.id || "id", P = {
  addTenantPrefix: (s, r, e) => (e && (r = e[U(s)] + "_" + r), r),
  removeTenantPrefix: (s, r) => (r && (s = s.slice(Math.max(0, s.indexOf("_") + 1))), s)
}, H = (s, r) => {
  const { config: e, slonik: t } = r;
  return async (n) => {
    const o = n.email;
    n.email = P.addTenantPrefix(
      e,
      n.email,
      n.userContext.tenant
    );
    const i = await s.emailPasswordSignIn(
      n
    );
    if (i.status !== "OK")
      return i;
    const a = new m(e, t);
    let c = null;
    try {
      c = await a.findById(i.user.id);
    } catch {
    }
    const { roles: u } = await l.getRolesForUser(i.user.id);
    return {
      status: "OK",
      user: {
        ...i.user,
        email: o,
        profile: c,
        roles: u
      }
    };
  };
}, J = (s, r) => async (e) => {
  if (e.userContext.tenant = e.options.req.original.tenant, s.emailPasswordSignInPOST === void 0)
    throw new Error("Should never come here");
  return await s.emailPasswordSignInPOST(e);
}, E = async ({
  fastify: s,
  subject: r,
  templateData: e = {},
  templateName: t,
  to: n
}) => {
  const { config: o, mailer: i, log: a } = s;
  return i.sendMail({
    subject: r,
    templateName: t,
    to: n,
    templateData: {
      appName: o.appName,
      ...e
    }
  }).catch((c) => {
    throw a.error(c.stack), {
      name: "SEND_EMAIL",
      message: c.message,
      statusCode: 500
    };
  });
}, W = (s, r) => {
  const { config: e, log: t } = r;
  return async (n) => {
    if (e.user.features?.signUp === !1)
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404
      };
    const o = n.email;
    n.email = P.addTenantPrefix(
      e,
      o,
      n.userContext.tenant
    );
    let i = await s.emailPasswordSignUp(
      n
    );
    if (i.status === "OK") {
      const a = await l.addRoleToUser(
        i.user.id,
        e.user.role || "USER"
      );
      a.status !== "OK" && t.error(a.status);
    }
    if (e.user.supertokens.sendUserAlreadyExistsWarning && i.status === "EMAIL_ALREADY_EXISTS_ERROR")
      try {
        await E({
          fastify: r,
          subject: "Duplicate Email Registration",
          templateData: {
            emailId: o
          },
          templateName: "duplicate-email-warning",
          to: o
        });
      } catch (a) {
        t.error(a);
      }
    return i.status === "OK" && (i = {
      ...i,
      user: { ...i.user, email: o }
    }), i;
  };
}, G = (s, r) => async (e) => {
  if (e.userContext.tenant = e.options.req.original.tenant, s.emailPasswordSignUpPOST === void 0)
    throw new Error("Should never come here");
  const t = await s.emailPasswordSignUpPOST(e);
  if (t.status === "OK") {
    const { roles: n } = await l.getRolesForUser(
      t.user.id
    );
    return {
      status: "OK",
      user: {
        ...t.user,
        /* eslint-disable-next-line unicorn/no-null */
        profile: null,
        roles: n
      },
      session: t.session
    };
  }
  return t;
}, V = (s, r, e) => (e && r.find((t) => {
  t.id === "email" && (t.value = e[U(s)] + "_" + t.value);
}), r), j = (s, r) => async (e) => {
  if (e.userContext.tenant = e.options.req.original.tenant, s.generatePasswordResetTokenPOST === void 0)
    throw new Error("Should never come here");
  return e.formFields = V(
    r.config,
    e.formFields,
    e.userContext.tenant
  ), await s.generatePasswordResetTokenPOST(e);
}, Q = (s) => async (r) => {
  let e = await s.getUserById(r);
  return e && r.userContext.tenant && (e = {
    ...e,
    email: P.removeTenantPrefix(e.email, r.userContext.tenant)
  }), e;
}, z = (s) => {
  let r;
  try {
    if (r = new URL(s).origin, !r || r === "null")
      throw new Error("Origin is empty");
  } catch {
    r = "";
  }
  return r;
}, X = (s) => {
  const r = s.config.appOrigin[0], e = "/reset-password";
  return async (t) => {
    const n = t.userContext._default.request.request, o = n.headers.referer || n.headers.origin || n.hostname, i = z(o) || r, a = t.passwordResetLink.replace(
      r + "/auth/reset-password",
      i + (s.config.user.supertokens.resetPasswordPath || e)
    );
    await E({
      fastify: s,
      subject: "Reset Password",
      templateName: "reset-password",
      to: P.removeTenantPrefix(t.user.email, t.userContext.tenant),
      templateData: {
        passwordResetLink: a
      }
    });
  };
}, Y = (s, r) => {
  const { config: e, log: t } = r;
  return async (n) => {
    const o = n.userContext.tenant;
    if (o) {
      const c = o[U(e)];
      n.thirdPartyUserId = c + "_" + n.thirdPartyUserId;
    }
    if (!await $(
      n.thirdPartyId,
      n.thirdPartyUserId,
      n.userContext
    ) && e.user.features?.signUp === !1)
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404
      };
    const a = await s.thirdPartySignInUp(
      n
    );
    if (a.status === "OK") {
      const c = await l.addRoleToUser(
        a.user.id,
        e.user.role || "USER"
      );
      c.status !== "OK" && t.error(c.status);
    }
    return a;
  };
}, Z = (s, r) => async (e) => {
  if (e.userContext.tenant = e.options.req.original.tenant, s.thirdPartySignInUpPOST === void 0)
    throw new Error("Should never come here");
  const t = await s.thirdPartySignInUpPOST(e);
  if (t.status === "OK" && t.createdNewUser) {
    const { roles: n } = await l.getRolesForUser(
      t.user.id
    ), o = {
      ...t.user,
      /* eslint-disable-next-line unicorn/no-null */
      profile: null,
      roles: n
    };
    return {
      status: "OK",
      createdNewUser: t.createdNewUser,
      user: o,
      session: t.session,
      authCodeResponse: t.authCodeResponse
    };
  }
  return t;
}, ee = (s) => {
  const { Apple: r, Facebook: e, Github: t, Google: n } = d, o = s.user.supertokens.providers, i = [], a = [
    { name: "google", initProvider: n },
    { name: "github", initProvider: t },
    { name: "facebook", initProvider: e },
    { name: "apple", initProvider: r }
  ];
  for (const c of a)
    o?.[c.name] && i.push(
      c.initProvider(o[c.name])
    );
  return i;
}, se = (s, r) => O.string({
  required_error: s.required
}).refine((e) => R.isEmail(e, r || {}), {
  message: s.invalid
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
}, re = (s, r) => {
  const e = {
    ...T,
    ...r
  };
  return O.string({
    required_error: s.required
  }).refine(
    (t) => R.isStrongPassword(
      t,
      e
    ),
    {
      message: s.weak
    }
  );
}, te = (s, r) => {
  const e = se(
    {
      invalid: "Email is invalid",
      required: "Email is required"
    },
    r.user.email
  ).safeParse(s);
  return e.success ? { success: !0 } : {
    message: e.error.issues[0].message,
    success: !1
  };
}, ne = (s) => {
  let r = "Password is too weak";
  if (!s)
    return r;
  const e = [];
  if (s.minLength) {
    const t = s.minLength;
    e.push(
      `minimum ${t} ${t > 1 ? "characters" : "character"}`
    );
  }
  if (s.minLowercase) {
    const t = s.minLowercase;
    e.push(
      `minimum ${t} ${t > 1 ? "lowercases" : "lowercase"}`
    );
  }
  if (s.minUppercase) {
    const t = s.minUppercase;
    e.push(
      `minimum ${t} ${t > 1 ? "uppercases" : "uppercase"}`
    );
  }
  if (s.minNumbers) {
    const t = s.minNumbers;
    e.push(`minimum ${t} ${t > 1 ? "numbers" : "number"}`);
  }
  if (s.minSymbols) {
    const t = s.minSymbols;
    e.push(`minimum ${t} ${t > 1 ? "symbols" : "symbol"}`);
  }
  if (e.length > 0) {
    r = "Password should contain ";
    const t = e.pop();
    e.length > 0 && (r += e.join(", ") + " and "), r += t;
  }
  return r;
}, I = (s, r) => {
  const e = r.user.password, t = re(
    {
      required: "Password is required",
      weak: ne({ ...T, ...e })
    },
    e
  ).safeParse(s);
  return t.success ? { success: !0 } : {
    message: t.error.issues[0].message,
    success: !1
  };
}, oe = (s) => {
  const { config: r } = s;
  return {
    override: {
      apis: (e) => ({
        ...e,
        emailPasswordSignInPOST: J(
          e
        ),
        emailPasswordSignUpPOST: G(
          e
        ),
        generatePasswordResetTokenPOST: j(
          e,
          s
        ),
        thirdPartySignInUpPOST: Z(
          e
        )
      }),
      functions: (e) => ({
        ...e,
        emailPasswordSignIn: H(
          e,
          s
        ),
        emailPasswordSignUp: W(
          e,
          s
        ),
        getUserById: Q(e),
        thirdPartySignInUp: Y(
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
            const t = te(e, r);
            if (!t.success)
              return t.message;
          }
        },
        {
          id: "password",
          validate: async (e) => {
            const t = I(e, r);
            if (!t.success)
              return t.message;
          }
        }
      ]
    },
    emailDelivery: {
      override: (e) => ({
        ...e,
        sendEmail: X(s)
      })
    },
    providers: ee(r)
  };
}, ie = (s) => {
  const r = s.config.user.supertokens.recipes;
  return r && r.thirdPartyEmailPassword ? d.init(
    r.thirdPartyEmailPassword(s)
  ) : d.init(
    oe(s)
  );
}, ae = () => ({}), ce = (s) => {
  const r = s.config.user.supertokens.recipes;
  return r && r.userRoles ? l.init(r.userRoles(s)) : l.init(ae());
}, ue = (s) => [
  q(s),
  ie(s),
  ce(s)
], de = (s) => {
  const { config: r } = s;
  v.init({
    appInfo: {
      apiDomain: r.baseUrl,
      appName: r.appName,
      websiteDomain: r.appOrigin[0]
    },
    recipeList: ue(s),
    supertokens: {
      connectionURI: r.user.supertokens.connectionUri
    }
  });
}, le = async (s, r, e) => {
  const { config: t, log: n } = s;
  n.info("Registering supertokens plugin"), de(s), s.setErrorHandler(D()), s.register(k, {
    origin: t.appOrigin,
    allowedHeaders: [
      "Content-Type",
      "st-auth-mode",
      ...v.getAllCORSHeaders()
    ],
    credentials: !0
  }), s.register(N), s.register(_), n.info("Registering supertokens plugin complete"), s.decorate("verifySession", F), e();
}, ge = h(le), me = async (s, r, e) => {
  const { config: t, slonik: n, tenant: o } = r, a = (await p.getSession(r, L(e), {
    sessionRequired: !1
  }))?.getUserId();
  if (a) {
    const c = new m(t, n), u = await d.getUserById(a, { tenant: o });
    if (u) {
      let g = null;
      const { roles: w } = await l.getRolesForUser(a);
      try {
        g = await c.findById(a);
      } catch {
      }
      const y = {
        ...u,
        profile: g,
        roles: w
      };
      s.user = y;
    }
  }
}, we = h(
  async (s, r, e) => {
    const { mercurius: t } = s.config;
    await s.register(ge), t.enabled && await s.register(x), e();
  }
);
we.updateContext = me;
const pe = {
  user: async (s, r, e) => await new m(e.config, e.database).findById(r.id),
  users: async (s, r, e) => await new m(e.config, e.database).list(
    r.limit,
    r.offset,
    r.filters ? JSON.parse(JSON.stringify(r.filters)) : void 0,
    r.sort ? JSON.parse(JSON.stringify(r.sort)) : void 0
  )
}, Le = { Query: pe }, Fe = async (s, r, e) => {
  const t = "/users";
  s.get(
    t,
    {
      preHandler: s.verifySession()
    },
    async (n, o) => {
      const i = new m(n.config, n.slonik), { limit: a, offset: c, filters: u, sort: g } = n.query, w = await i.list(
        a,
        c,
        u ? JSON.parse(u) : void 0,
        g ? JSON.parse(g) : void 0
      );
      o.send(w);
    }
  ), e();
};
class f {
  config;
  database;
  constructor(r, e) {
    this.config = r, this.database = e;
  }
  changePassword = async (r, e, t, n) => {
    const o = I(t, this.config);
    if (!o.success)
      return {
        status: "FIELD_ERROR",
        message: o.message
      };
    const i = await d.getUserById(r, {
      tenant: n
    });
    if (e && t)
      if (i)
        if ((await d.emailPasswordSignIn(
          i.email,
          e,
          { tenant: n }
        )).status === "OK") {
          if (await d.updateEmailOrPassword({
            userId: r,
            password: t,
            userContext: { tenant: n }
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
  getUserById = async (r, e) => {
    const t = await d.getUserById(r, { tenant: e }), n = new m(this.config, this.database);
    let o = null;
    try {
      o = await n.findById(r);
    } catch {
    }
    const i = await l.getRolesForUser(r);
    return {
      email: t?.email,
      id: r,
      profile: o,
      roles: i.roles,
      timeJoined: t?.timeJoined
    };
  };
}
const fe = {
  changePassword: async (s, r, e) => {
    const t = new f(e.config, e.database);
    try {
      return e.user?.id ? await t.changePassword(
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
      const o = new S.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return o.statusCode = 500, o;
    }
  }
}, Pe = {
  me: async (s, r, e) => {
    const t = new f(e.config, e.database);
    if (e.user?.id)
      return t.getUserById(e.user.id, e.tenant);
    {
      e.app.log.error("Cound not get user id from mercurius context");
      const n = new S.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return n.statusCode = 500, n;
    }
  }
}, $e = { Mutation: fe, Query: Pe }, Ae = async (s, r, e) => {
  const t = "/change_password", n = "/me";
  s.post(
    t,
    {
      preHandler: s.verifySession()
    },
    async (o, i) => {
      try {
        const a = o.session, c = o.body, u = a && a.getUserId();
        if (!u)
          throw new Error("User not found in session");
        const g = c.oldPassword ?? "", w = c.newPassword ?? "", C = await new f(o.config, o.slonik).changePassword(
          u,
          g,
          w,
          o.tenant
        );
        i.send(C);
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
    async (o, i) => {
      const a = new f(o.config, o.slonik), c = o.session?.getUserId();
      if (c)
        i.send(await a.getUserById(c, o.tenant));
      else
        throw s.log.error("Cound not get user id from session"), new Error("Oops, Something went wrong");
    }
  ), e();
};
export {
  m as UserProfileService,
  f as UserService,
  we as default,
  Le as userProfileResolver,
  Fe as userProfileRoutes,
  $e as userResolver,
  Ae as userRoutes
};

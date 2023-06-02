import "@dzangolab/fastify-mercurius";
import h from "fastify-plugin";
import S from "mercurius";
import F from "mercurius-auth";
import C from "@fastify/cors";
import _ from "@fastify/formbody";
import R, { deleteUser as E } from "supertokens-node";
import { errorHandler as D, plugin as $, wrapResponse as N } from "supertokens-node/framework/fastify";
import { verifySession as k } from "supertokens-node/recipe/session/framework/fastify";
import w from "supertokens-node/recipe/session";
import m, { getUserByThirdPartyInfo as T } from "supertokens-node/recipe/thirdpartyemailpassword";
import { DefaultSqlFactory as B, createTableIdentifier as W, createFilterFragment as G, createLimitFragment as H, BaseService as K } from "@dzangolab/fastify-slonik";
import { sql as u } from "slonik";
import M from "humps";
import U from "validator";
import { z as y } from "zod";
import p from "supertokens-node/recipe/userroles";
import "@dzangolab/fastify-mailer";
const j = h(async (e) => {
  e.config.mercurius.enabled && await e.register(F, {
    async applyPolicy(s, t, o, i) {
      if (!i.user) {
        const n = new S.ErrorWithProps("unauthorized");
        return n.statusCode = 200, n;
      }
      return !0;
    },
    authDirective: "auth"
  });
}), J = () => ({}), q = (e) => {
  const r = e.config.user.supertokens.recipes;
  return r && r.session ? w.init(r.session(e)) : w.init(J());
}, V = (e, r) => {
  if (r && r.length > 0) {
    const s = [];
    for (const t of r) {
      const o = t.direction === "ASC" ? u.fragment`ASC` : u.fragment`DESC`;
      let i;
      t.key === "roles" && (i = u.fragment`user_role.role ->> 0`);
      const n = u.identifier([
        ...e.names,
        M.decamelize(t.key)
      ]);
      s.push(
        u.fragment`${i ?? n} ${o}`
      );
    }
    return u.fragment`ORDER BY ${u.join(s, u.fragment`,`)}`;
  }
  return u.fragment``;
}, P = (e, r) => {
  let s = u.fragment`ASC`;
  return Array.isArray(r) || (r = []), r.some((t) => t.key === "roles" && t.direction != "ASC" ? (s = u.fragment`DESC`, !0) : !1), u.fragment`ORDER BY ${e} ${s}`;
};
class z extends B {
  /* eslint-enabled */
  getFindByIdSql = (r) => u.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT json_agg(ur.role ${P(
    u.identifier(["ur", "role"])
  )}) AS role
        FROM "public"."st__user_roles" as ur
        WHERE ur.user_id = users.id
      ) AS user_role ON TRUE
      WHERE id = ${r};
    `;
  getListSql = (r, s, t, o) => {
    const i = W(this.table, this.schema);
    return u.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT json_agg(ur.role ${P(
      u.identifier(["ur", "role"]),
      o
    )}) AS role
        FROM "public"."st__user_roles" as ur
        WHERE ur.user_id = users.id
      ) AS user_role ON TRUE
      ${G(t, i)}
      ${V(i, this.getSortInput(o))}
      ${H(r, s)};
    `;
  };
}
const Y = (e, r) => y.string({
  required_error: e.required
}).refine((s) => U.isEmail(s, r || {}), {
  message: e.invalid
}), v = {
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
}, Q = (e, r) => {
  const s = {
    ...v,
    ...r
  };
  return y.string({
    required_error: e.required
  }).refine(
    (t) => U.isStrongPassword(
      t,
      s
    ),
    {
      message: e.weak
    }
  );
}, X = (e) => {
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
    r = "Password should contain ";
    const t = s.pop();
    s.length > 0 && (r += s.join(", ") + " and "), r += t;
  }
  return r;
}, O = (e, r) => {
  const s = r.user.password, t = Q(
    {
      required: "Password is required",
      weak: X({ ...v, ...s })
    },
    s
  ).safeParse(e);
  return t.success ? { success: !0 } : {
    message: t.error.issues[0].message,
    success: !1
  };
};
class l extends K {
  get table() {
    return this.config.user?.table?.name || "users";
  }
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new z(this)), this._factory;
  }
  changePassword = async (r, s, t) => {
    const o = O(t, this.config);
    if (!o.success)
      return {
        status: "FIELD_ERROR",
        message: o.message
      };
    const i = await m.getUserById(r);
    if (s && t)
      if (i)
        if ((await m.emailPasswordSignIn(
          i.email,
          s,
          { dbSchema: this.schema }
        )).status === "OK") {
          if (await m.updateEmailOrPassword({
            userId: r,
            password: t
          }))
            return await w.revokeAllSessionsForUser(r), {
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
}
const b = (e) => e.toISOString().slice(0, 23).replace("T", " "), Z = (e, r) => {
  const { config: s, log: t, slonik: o } = r;
  return async (i) => {
    const n = await e.emailPasswordSignIn(
      i
    );
    if (n.status !== "OK")
      return n;
    const a = new l(s, o), c = await a.findById(n.user.id);
    return c ? (c.lastLoginAt = Date.now(), await a.update(c.id, {
      lastLoginAt: b(new Date(c.lastLoginAt))
    }).catch((g) => {
      t.error(
        `Unable to update lastLoginAt for userId ${n.user.id}`
      ), t.error(g);
    }), {
      status: "OK",
      user: {
        ...n.user,
        ...c
      }
    }) : (t.error(`User record not found for userId ${n.user.id}`), { status: "WRONG_CREDENTIALS_ERROR" });
  };
}, I = async (e) => {
  const { roles: r } = await p.getAllRoles();
  return r.includes(e);
}, L = async ({
  fastify: e,
  subject: r,
  templateData: s = {},
  templateName: t,
  to: o
}) => {
  const { config: i, mailer: n, log: a } = e;
  return n.sendMail({
    subject: r,
    templateName: t,
    to: o,
    templateData: {
      appName: i.appName,
      ...s
    }
  }).catch((c) => {
    a.error(c.stack);
  });
}, x = (e, r) => {
  const { config: s, log: t, slonik: o } = r;
  return async (i) => {
    if (s.user.features?.signUp === !1)
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404
      };
    const n = s.user.role || "USER";
    if (!await I(n))
      throw t.error(`Role "${n}" does not exist`), {
        name: "SIGN_UP_FAILED",
        message: "Something went wrong",
        statusCode: 500
      };
    const a = await e.emailPasswordSignUp(
      i
    );
    if (a.status === "OK") {
      const c = new l(s, o);
      let d;
      try {
        if (d = await c.create({
          id: a.user.id,
          email: a.user.email
        }), !d)
          throw new Error("User not found");
      } catch (A) {
        throw t.error("Error while creating user"), t.error(A), await E(a.user.id), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      }
      d.roles = [s.user.role || "USER"], a.user = {
        ...a.user,
        ...d
      };
      const g = await p.addRoleToUser(
        a.user.id,
        n
      );
      g.status !== "OK" && t.error(g.status);
    }
    if (s.user.supertokens.sendUserAlreadyExistsWarning && a.status === "EMAIL_ALREADY_EXISTS_ERROR")
      try {
        L({
          fastify: r,
          subject: "Duplicate Email Registration",
          templateData: {
            emailId: i.email
          },
          templateName: "duplicate-email-warning",
          to: i.email
        });
      } catch (c) {
        t.error(c);
      }
    return a;
  };
}, ee = (e, r) => {
  const s = Y(
    {
      invalid: "Email is invalid",
      required: "Email is required"
    },
    r.user.email
  ).safeParse(e);
  return s.success ? { success: !0 } : {
    message: s.error.issues[0].message,
    success: !1
  };
}, re = (e) => [
  {
    id: "email",
    validate: async (r) => {
      const s = ee(r, e);
      if (!s.success)
        return s.message;
    }
  },
  {
    id: "password",
    validate: async (r) => {
      const s = O(r, e);
      if (!s.success)
        return s.message;
    }
  }
], se = (e) => {
  let r = [];
  if (typeof e.user.supertokens?.recipes?.thirdPartyEmailPassword == "object") {
    const t = e.user.supertokens?.recipes?.thirdPartyEmailPassword.signUpFeature?.formFields;
    t && (r = [...t]);
  }
  const s = new Set(r.map((t) => t.id));
  for (const t of re(e))
    s.has(t.id) || r.push(t);
  return r;
}, te = (e) => {
  let r;
  try {
    if (r = new URL(e).origin, !r || r === "null")
      throw new Error("Origin is empty");
  } catch {
    r = "";
  }
  return r;
}, ne = (e, r) => {
  const s = r.config.appOrigin[0], t = "/reset-password";
  return async (o) => {
    const i = o.userContext._default.request.request, n = i.headers.referer || i.headers.origin || i.hostname, a = te(n) || s, c = o.passwordResetLink.replace(
      s + "/auth/reset-password",
      a + (r.config.user.supertokens.resetPasswordPath || t)
    );
    L({
      fastify: r,
      subject: "Reset Password",
      templateName: "reset-password",
      to: o.user.email,
      templateData: {
        passwordResetLink: c
      }
    });
  };
}, oe = (e, r) => {
  const { config: s, log: t } = r;
  return async (o) => {
    if (!await T(
      o.thirdPartyId,
      o.thirdPartyUserId,
      o.userContext
    ) && s.user.features?.signUp === !1)
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404
      };
    const n = await e.thirdPartySignInUp(
      o
    );
    if (n.status === "OK" && n.createdNewUser) {
      const a = s.user.role || "USER";
      if (!await I(a))
        throw await E(n.user.id), t.error(`Role "${a}" does not exist`), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      const c = await p.addRoleToUser(
        n.user.id,
        a
      );
      c.status !== "OK" && t.error(c.status);
    }
    return n;
  };
}, ie = (e, r) => {
  const { config: s, log: t, slonik: o } = r;
  return async (i) => {
    if (e.thirdPartySignInUpPOST === void 0)
      throw new Error("Should never come here");
    const n = await e.thirdPartySignInUpPOST(i);
    if (n.status === "OK") {
      const a = new l(s, o);
      let c;
      if (n.createdNewUser)
        try {
          if (c = await a.create({
            id: n.user.id,
            email: n.user.email
          }), !c)
            throw new Error("User not found");
          c.roles = [s.user.role || "USER"];
        } catch (d) {
          throw t.error("Error while creating user"), t.error(d), await E(n.user.id), {
            name: "SIGN_UP_FAILED",
            message: "Something went wrong",
            statusCode: 500
          };
        }
      else {
        if (c = await a.findById(n.user.id), !c)
          return t.error(
            `User record not found for userId ${n.user.id}`
          ), {
            status: "GENERAL_ERROR",
            message: "Something went wrong"
          };
        c.lastLoginAt = Date.now(), await a.update(c.id, {
          lastLoginAt: b(new Date(c.lastLoginAt))
        }).catch((d) => {
          t.error(
            `Unable to update lastLoginAt for userId ${n.user.id}`
          ), t.error(d);
        });
      }
      return {
        status: "OK",
        createdNewUser: n.createdNewUser,
        user: {
          ...n.user,
          ...c
        },
        session: n.session,
        authCodeResponse: n.authCodeResponse
      };
    }
    return n;
  };
}, ae = (e) => {
  const { Apple: r, Facebook: s, Github: t, Google: o } = m, i = e.user.supertokens.providers, n = [], a = [
    { name: "google", initProvider: o },
    { name: "github", initProvider: t },
    { name: "facebook", initProvider: s },
    { name: "apple", initProvider: r }
  ];
  for (const c of a)
    i?.[c.name] && n.push(
      c.initProvider(i[c.name])
    );
  return n;
}, ce = (e) => {
  const { config: r } = e;
  let s = {};
  return typeof r.user.supertokens.recipes?.thirdPartyEmailPassword == "object" && (s = r.user.supertokens.recipes.thirdPartyEmailPassword), {
    override: {
      apis: (t) => {
        const o = {};
        if (s.override?.apis) {
          const i = s.override.apis;
          let n;
          for (n in i) {
            const a = i[n];
            a && (o[n] = a(
              t,
              e
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...t,
          // [DU 2023-APR-19] We do not need this
          // emailPasswordSignUpPOST: emailPasswordSignUpPOST(
          //   originalImplementation,
          //   fastify
          // ),
          thirdPartySignInUpPOST: ie(
            t,
            e
          ),
          ...o
        };
      },
      functions: (t) => {
        const o = {};
        if (s.override?.functions) {
          const i = s.override.functions;
          let n;
          for (n in i) {
            const a = i[n];
            a && (o[n] = a(
              t,
              e
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...t,
          emailPasswordSignIn: Z(
            t,
            e
          ),
          emailPasswordSignUp: x(
            t,
            e
          ),
          thirdPartySignInUp: oe(
            t,
            e
          ),
          ...o
        };
      }
    },
    signUpFeature: {
      formFields: se(r)
    },
    emailDelivery: {
      override: (t) => {
        let o;
        return s?.sendEmail && (o = s.sendEmail), {
          ...t,
          sendEmail: o ? o(t, e) : ne(t, e)
        };
      }
    },
    providers: ae(r)
  };
}, ue = (e) => {
  const r = e.config.user.supertokens.recipes?.thirdPartyEmailPassword;
  return typeof r == "function" ? m.init(r(e)) : m.init(
    ce(e)
  );
}, de = () => ({}), le = (e) => {
  const r = e.config.user.supertokens.recipes;
  return r && r.userRoles ? p.init(r.userRoles(e)) : p.init(de());
}, ge = (e) => [
  q(e),
  ue(e),
  le(e)
], me = (e) => {
  const { config: r } = e;
  R.init({
    appInfo: {
      apiDomain: r.baseUrl,
      appName: r.appName,
      websiteDomain: r.appOrigin[0]
    },
    recipeList: ge(e),
    supertokens: {
      connectionURI: r.user.supertokens.connectionUri
    }
  });
}, pe = async (e, r, s) => {
  const { config: t, log: o } = e;
  o.info("Registering supertokens plugin"), me(e), e.setErrorHandler(D()), await e.register(C, {
    origin: t.appOrigin,
    allowedHeaders: [
      "Content-Type",
      "st-auth-mode",
      ...R.getAllCORSHeaders()
    ],
    credentials: !0
  }), await e.register(_), await e.register($), o.info("Registering supertokens plugin complete"), e.decorate("verifySession", k), s();
}, we = h(pe), fe = async (e, r, s) => {
  const { config: t, slonik: o, dbSchema: i } = r, a = (await w.getSession(r, N(s), {
    sessionRequired: !1
  }))?.getUserId();
  if (a && !e.user) {
    const c = new l(t, o, i);
    let d = null;
    try {
      d = await c.findById(a);
    } catch {
    }
    if (!d)
      throw new Error("Unable to find user");
    const { roles: g } = await p.getRolesForUser(a);
    e.user = d, e.roles = g;
  }
}, he = h(
  async (e, r, s) => {
    const { mercurius: t } = e.config;
    await e.register(we), t.enabled && await e.register(j), s();
  }
);
he.updateContext = fe;
const Se = {
  changePassword: async (e, r, s) => {
    const t = new l(
      s.config,
      s.database,
      s.dbSchema
    );
    try {
      return s.user?.id ? await t.changePassword(
        s.user?.id,
        r.oldPassword,
        r.newPassword
      ) : {
        status: "NOT_FOUND",
        message: "User not found"
      };
    } catch (o) {
      s.app.log.error(o);
      const i = new S.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return i.statusCode = 500, i;
    }
  }
}, Ee = {
  me: async (e, r, s) => {
    const t = new l(
      s.config,
      s.database,
      s.dbSchema
    );
    if (s.user?.id)
      return await t.findById(s.user.id);
    {
      s.app.log.error(
        "Could not able to get user id from mercurius context"
      );
      const o = new S.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return o.statusCode = 500, o;
    }
  },
  user: async (e, r, s) => await new l(
    s.config,
    s.database,
    s.dbSchema
  ).findById(r.id),
  users: async (e, r, s) => await new l(
    s.config,
    s.database,
    s.dbSchema
  ).list(
    r.limit,
    r.offset,
    r.filters ? JSON.parse(JSON.stringify(r.filters)) : void 0,
    r.sort ? JSON.parse(JSON.stringify(r.sort)) : void 0
  )
}, He = { Mutation: Se, Query: Ee }, Pe = async (e, r) => {
  try {
    const s = e.session, t = e.body, o = s && s.getUserId();
    if (!o)
      throw new Error("User not found in session");
    const i = t.oldPassword ?? "", n = t.newPassword ?? "", c = await new l(
      e.config,
      e.slonik,
      e.dbSchema
    ).changePassword(o, i, n);
    r.send(c);
  } catch (s) {
    e.log.error(s), r.status(500), r.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
      error: s
    });
  }
}, Re = async (e, r) => {
  const s = new l(e.config, e.slonik, e.dbSchema), t = e.session?.getUserId();
  if (t)
    r.send(await s.findById(t));
  else
    throw e.log.error("Could not able to get user id from session"), new Error("Oops, Something went wrong");
}, Ue = async (e, r) => {
  const s = new l(e.config, e.slonik, e.dbSchema), { limit: t, offset: o, filters: i, sort: n } = e.query, a = await s.list(
    t,
    o,
    i ? JSON.parse(i) : void 0,
    n ? JSON.parse(n) : void 0
  );
  r.send(a);
}, f = { changePassword: Pe, me: Re, users: Ue }, Ke = async (e, r, s) => {
  const t = "/change_password", o = "/me", i = "/users";
  e.get(
    i,
    {
      preHandler: e.verifySession()
    },
    f.users
  ), e.post(
    t,
    {
      preHandler: e.verifySession()
    },
    f.changePassword
  ), e.get(
    o,
    {
      preHandler: e.verifySession()
    },
    f.me
  ), s();
};
export {
  l as UserService,
  he as default,
  b as formatDate,
  I as isRoleExists,
  He as userResolver,
  Ke as userRoutes,
  ee as validateEmail,
  O as validatePassword
};

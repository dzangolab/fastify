import "@dzangolab/fastify-mercurius";
import M from "fastify-plugin";
import l from "mercurius";
import ne from "mercurius-auth";
import N, { EmailVerificationClaim as ve } from "supertokens-node/recipe/emailverification";
import f from "supertokens-node/recipe/userroles";
import A, { Error as Z, createNewSession as j } from "supertokens-node/recipe/session";
import Re from "@fastify/cors";
import Oe from "@fastify/formbody";
import oe, { deleteUser as G } from "supertokens-node";
import { errorHandler as Ie, plugin as Pe, wrapResponse as ye } from "supertokens-node/framework/fastify";
import { verifySession as Ue } from "supertokens-node/recipe/session/framework/fastify";
import "@dzangolab/fastify-mailer";
import { DefaultSqlFactory as ie, createTableIdentifier as ae, createFilterFragment as ce, createLimitFragment as ue, BaseService as de, formatDate as b, createTableFragment as be, createSortFragment as Te } from "@dzangolab/fastify-slonik";
import { formatDate as Qs } from "@dzangolab/fastify-slonik";
import $, { getUserById as Ae, getUserByThirdPartyInfo as Ne, emailPasswordSignUp as J } from "supertokens-node/recipe/thirdpartyemailpassword";
import Q from "humps";
import { sql as w } from "slonik";
import le from "validator";
import { z as me } from "zod";
const _e = M(async (r) => {
  await r.register(ne, {
    async applyPolicy(e, t, s, n) {
      return n.user ? n.user.disabled ? new l.ErrorWithProps("user is disabled", {}, 401) : r.config.user.features?.signUp?.emailVerification && !await N.isEmailVerified(n.user.id) ? new l.ErrorWithProps(
        "invalid claim",
        {
          claimValidationErrors: [
            {
              id: "st-ev",
              reason: {
                message: "wrong value",
                expectedValue: !0,
                actualValue: !1
              }
            }
          ]
        },
        403
      ) : !0 : new l.ErrorWithProps("unauthorized", {}, 401);
    },
    authDirective: "auth"
  });
}), ke = "/signup/token/:token", Ce = 30, Le = "/invitations", $e = "/invitations/token/:token", Fe = "/invitations", De = "/invitations/token/:token", We = "/invitations/resend/:id(^\\d+)", Ve = "/invitations/revoke/:id(^\\d+)", Me = "invitations", Be = "/reset-password", P = "ADMIN", He = "SUPER_ADMIN", z = "USER", Ke = "/change_password", ee = "/signup/admin", re = "/me", qe = "/users", je = "/users/:id/disable", Je = "/users/:id/enable", pe = "users", se = "/roles", te = "/roles/permissions", xe = "/permissions", Ge = "REQUIRED", Qe = "/verify-email", ze = "invitations:create", Ye = "invitations:list", Xe = "invitations:resend", Ze = "invitations:revoke", er = "users:disable", rr = "users:enable", sr = "users:enable", tr = async (r) => {
  let e = [];
  for (const t of r) {
    const s = await f.getPermissionsForRole(t);
    s.status === "OK" && (e = [.../* @__PURE__ */ new Set([...e, ...s.permissions])]);
  }
  return e;
}, ge = async (r, e, t) => {
  const s = r.config.user.permissions;
  if (!s || !s.includes(t))
    return !0;
  const { roles: n } = await f.getRolesForUser(e);
  if (n && n.includes(He))
    return !0;
  const o = await tr(n);
  return !(!o || !o.includes(t));
}, nr = M(async (r) => {
  await r.register(ne, {
    applyPolicy: async (e, t, s, n) => {
      const o = e.arguments.find(
        (a) => a.name.value === "permission"
      ).value.value;
      return n.user ? await ge(
        n.app,
        n.user?.id,
        o
      ) ? !0 : new l.ErrorWithProps(
        "invalid claim",
        {
          claimValidationErrors: [
            {
              id: "st-perm",
              reason: {
                message: "Not have enough permission",
                expectedToInclude: o
              }
            }
          ]
        },
        403
      ) : new l.ErrorWithProps("unauthorized", {}, 401);
    },
    authDirective: "hasPermission"
  });
}), or = M(async (r) => {
  r.config.mercurius.enabled && (await r.register(nr), await r.register(_e));
}), ir = (r) => async (e) => {
  const t = e.session?.getUserId();
  if (!t)
    throw new Z({
      type: "UNAUTHORISED",
      message: "unauthorised"
    });
  if (!await ge(e.server, t, r))
    throw new Z({
      type: "INVALID_CLAIMS",
      message: "Not have enough permission",
      payload: [
        {
          id: f.PermissionClaim.key,
          reason: {
            message: "Not have enough permission",
            expectedToInclude: r
          }
        }
      ]
    });
}, Y = (r) => {
  let e;
  try {
    if (e = new URL(r).origin, !e || e === "null")
      throw new Error("Origin is empty");
  } catch {
    e = "";
  }
  return e;
}, B = async ({
  fastify: r,
  subject: e,
  templateData: t = {},
  templateName: s,
  to: n
}) => {
  const { config: o, log: i, mailer: a } = r;
  return a.sendMail({
    subject: e,
    templateName: s,
    to: n,
    templateData: {
      appName: o.appName,
      ...t
    }
  }).catch((c) => {
    i.error(c.stack);
  });
}, ar = (r, e) => {
  const t = e.config.appOrigin[0];
  return async (s) => {
    let n;
    try {
      const i = s.userContext._default.request.request, a = i.headers.referer || i.headers.origin || i.hostname;
      n = Y(a) || t;
    } catch {
      n = t;
    }
    const o = s.emailVerifyLink.replace(
      t + "/auth/verify-email",
      n + (e.config.user.supertokens.emailVerificationPath || Qe)
    );
    B({
      fastify: e,
      subject: "Email Verification",
      templateName: "email-verification",
      to: s.user.email,
      templateData: {
        emailVerifyLink: o
      }
    });
  };
}, cr = (r) => {
  const { config: e } = r;
  let t = {};
  return typeof e.user.supertokens.recipes?.emailVerification == "object" && (t = e.user.supertokens.recipes.emailVerification), {
    mode: t?.mode || Ge,
    emailDelivery: {
      override: (s) => {
        let n;
        return t?.sendEmail && (n = t.sendEmail), {
          ...s,
          sendEmail: n ? n(s, r) : ar(s, r)
        };
      }
    },
    override: {
      apis: (s) => {
        const n = {};
        if (t.override?.apis) {
          const o = t.override.apis;
          let i;
          for (i in o) {
            const a = o[i];
            a && (n[i] = a(
              s,
              r
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...s,
          verifyEmailPOST: async (o) => {
            if (s.verifyEmailPOST === void 0)
              throw new Error("Should never come here");
            return o.session ? await s.verifyEmailPOST(
              o
            ) : {
              status: "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR"
            };
          },
          ...n
        };
      },
      functions: (s) => {
        const n = {};
        if (t.override?.functions) {
          const o = t.override.functions;
          let i;
          for (i in o) {
            const a = o[i];
            a && (n[i] = a(
              s,
              r
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...s,
          ...n
        };
      }
    }
  };
}, ur = (r) => {
  const e = r.config.user.supertokens.recipes?.emailVerification;
  return typeof e == "function" ? N.init(e(r)) : N.init(cr(r));
}, dr = (r, e) => {
  if (e && e.length > 0) {
    const t = [];
    for (const s of e) {
      const n = s.direction === "ASC" ? w.fragment`ASC` : w.fragment`DESC`;
      let o;
      s.key === "roles" && (o = w.fragment`user_role.role ->> 0`);
      const i = w.identifier([
        ...r.names,
        Q.decamelize(s.key)
      ]);
      t.push(
        w.fragment`${o ?? i} ${n}`
      );
    }
    return w.fragment`ORDER BY ${w.join(t, w.fragment`,`)}`;
  }
  return w.fragment``;
}, x = (r, e) => {
  let t = w.fragment`ASC`;
  return Array.isArray(e) || (e = []), e.some((s) => s.key === "roles" && s.direction != "ASC" ? (t = w.fragment`DESC`, !0) : !1), w.fragment`ORDER BY ${r} ${t}`;
};
class lr extends ie {
  /* eslint-enabled */
  getFindByIdSql = (e) => w.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(ur.role ${x(
    w.identifier(["ur", "role"])
  )}) AS role
        FROM "public"."st__user_roles" as ur
        WHERE ur.user_id = users.id
      ) AS user_role ON TRUE
      WHERE id = ${e};
    `;
  getListSql = (e, t, s, n) => {
    const o = ae(this.table, this.schema);
    return w.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(ur.role ${x(
      w.identifier(["ur", "role"]),
      n
    )}) AS role
        FROM "public"."st__user_roles" as ur
        WHERE ur.user_id = users.id
      ) AS user_role ON TRUE
      ${ce(s, o)}
      ${dr(o, this.getSortInput(n))}
      ${ue(e, t)};
    `;
  };
  getUpdateSql = (e, t) => {
    const s = [];
    for (const n in t) {
      const o = t[n];
      s.push(
        w.fragment`${w.identifier([Q.decamelize(n)])} = ${o}`
      );
    }
    return w.type(this.validationSchema)`
      UPDATE ${this.getTableFragment()}
      SET ${w.join(s, w.fragment`, `)}
      WHERE id = ${e}
      RETURNING *, (
        SELECT COALESCE(user_role.role, '[]') AS roles
        FROM ${this.getTableFragment()}
        LEFT JOIN LATERAL (
          SELECT jsonb_agg(ur.role ${x(
      w.identifier(["ur", "role"])
    )}) AS role
          FROM "public"."st__user_roles" as ur
          WHERE ur.user_id = users.id
        ) AS user_role ON TRUE
        WHERE id = ${e}
      ) as roles;
    `;
  };
}
const mr = (r, e) => me.string({
  required_error: r.required
}).refine((t) => le.isEmail(t, e || {}), {
  message: r.invalid
}), we = {
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
}, pr = (r, e) => {
  const t = {
    ...we,
    ...e
  };
  return me.string({
    required_error: r.required
  }).refine(
    (s) => le.isStrongPassword(
      s,
      t
    ),
    {
      message: r.weak
    }
  );
}, gr = (r) => {
  let e = "Password is too weak";
  if (!r)
    return e;
  const t = [];
  if (r.minLength) {
    const s = r.minLength;
    t.push(
      `minimum ${s} ${s > 1 ? "characters" : "character"}`
    );
  }
  if (r.minLowercase) {
    const s = r.minLowercase;
    t.push(
      `minimum ${s} ${s > 1 ? "lowercases" : "lowercase"}`
    );
  }
  if (r.minUppercase) {
    const s = r.minUppercase;
    t.push(
      `minimum ${s} ${s > 1 ? "uppercases" : "uppercase"}`
    );
  }
  if (r.minNumbers) {
    const s = r.minNumbers;
    t.push(`minimum ${s} ${s > 1 ? "numbers" : "number"}`);
  }
  if (r.minSymbols) {
    const s = r.minSymbols;
    t.push(`minimum ${s} ${s > 1 ? "symbols" : "symbol"}`);
  }
  if (t.length > 0) {
    e = "Password should contain ";
    const s = t.pop();
    t.length > 0 && (e += t.join(", ") + " and "), e += s;
  }
  return e;
}, F = (r, e) => {
  const t = e.user.password, s = pr(
    {
      required: "Password is required",
      weak: gr({ ...we, ...t })
    },
    t
  ).safeParse(r);
  return s.success ? { success: !0 } : {
    message: s.error.issues[0].message,
    success: !1
  };
};
class wr extends de {
  get table() {
    return this.config.user?.table?.name || pe;
  }
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new lr(this)), this._factory;
  }
  changePassword = async (e, t, s) => {
    const n = F(s, this.config);
    if (!n.success)
      return {
        status: "FIELD_ERROR",
        message: n.message
      };
    const o = await $.getUserById(e);
    if (t && s)
      if (o)
        if ((await $.emailPasswordSignIn(
          o.email,
          t,
          { dbSchema: this.schema }
        )).status === "OK") {
          if (await $.updateEmailOrPassword({
            userId: e,
            password: s
          }))
            return await A.revokeAllSessionsForUser(e), {
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
const S = (r, e, t) => {
  const s = r.user.services?.user || wr;
  return new s(
    r,
    e,
    t
  );
}, hr = (r, e) => async (t) => {
  if (r.createNewSession === void 0)
    throw new Error("Should never come here");
  const s = t.userContext._default.request.request, n = await r.createNewSession(
    t
  ), o = n.getUserId();
  if ((await S(
    s.config,
    s.slonik,
    s.dbSchema
  ).findById(o))?.disabled)
    throw await n.revokeSession(), {
      name: "SIGN_IN_FAILED",
      message: "user is disabled",
      statusCode: 401
    };
  return n;
}, fr = (r, e) => async (t) => {
  if (r.verifySession === void 0)
    throw new Error("Should never come here");
  const s = await r.verifySession(t);
  if (s) {
    const n = s.getUserId(), o = t.userContext._default.request.request;
    if ((await S(
      o.config,
      o.slonik,
      o.dbSchema
    ).findById(n))?.disabled)
      throw await s.revokeSession(), {
        name: "SESSION_VERIFICATION_FAILED",
        message: "user is disabled",
        statusCode: 401
      };
  }
  return s;
}, Er = (r) => {
  const { config: e } = r;
  let t = {};
  return typeof e.user.supertokens.recipes?.session == "object" && (t = e.user.supertokens.recipes.session), {
    ...t,
    getTokenTransferMethod: (s) => s.req.getHeaderValue("st-auth-mode") === "header" ? "header" : "cookie",
    override: {
      apis: (s) => {
        const n = {};
        if (t.override?.apis) {
          const o = t.override.apis;
          let i;
          for (i in o) {
            const a = o[i];
            a && (n[i] = a(
              s,
              r
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...s,
          verifySession: fr(s),
          ...n
        };
      },
      functions: (s) => {
        const n = {};
        if (t.override?.functions) {
          const o = t.override.functions;
          let i;
          for (i in o) {
            const a = o[i];
            a && (n[i] = a(
              s,
              r
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...s,
          createNewSession: hr(s),
          ...n
        };
      },
      openIdFeature: t.override?.openIdFeature
    }
  };
}, Sr = (r) => {
  const e = r.config.user.supertokens.recipes?.session;
  return typeof e == "function" ? A.init(e(r)) : A.init(Er(r));
}, vr = (r, e) => async (t) => {
  if (r.appleRedirectHandlerPOST === void 0)
    throw new Error("Should never come here");
  const s = t.state, n = JSON.parse(
    Buffer.from(s, "base64").toString("ascii")
  );
  if (n.isAndroid && n.appId) {
    const i = `intent://callback?${`code=${t.code}&state=${t.state}`}#Intent;package=${n.appId};scheme=signinwithapple;end`;
    t.options.res.original.redirect(i);
  } else
    r.appleRedirectHandlerPOST(t);
}, Rr = (r, e) => {
  const { config: t, log: s, slonik: n } = e;
  return async (o) => {
    const i = await r.emailPasswordSignIn(
      o
    );
    if (i.status !== "OK")
      return i;
    const a = S(t, n), c = await a.findById(i.user.id);
    return c ? (c.lastLoginAt = Date.now(), await a.update(c.id, {
      lastLoginAt: b(new Date(c.lastLoginAt))
    }).catch((d) => {
      s.error(
        `Unable to update lastLoginAt for userId ${i.user.id}`
      ), s.error(d);
    }), {
      status: "OK",
      user: {
        ...i.user,
        ...c
      }
    }) : (s.error(`User record not found for userId ${i.user.id}`), { status: "WRONG_CREDENTIALS_ERROR" });
  };
}, Or = async (r) => {
  const e = await N.createEmailVerificationToken(
    r
  );
  e.status === "OK" && await N.verifyEmailUsingToken(e.token);
}, he = async (r) => {
  const { roles: e } = await f.getAllRoles();
  return r.every((t) => e.includes(t));
}, Ir = (r, e) => {
  const { config: t, log: s, slonik: n } = e;
  return async (o) => {
    const i = o.userContext.roles || [];
    if (!await he(i))
      throw s.error(`At least one role from ${i.join(", ")} does not exist.`), {
        name: "SIGN_UP_FAILED",
        message: "Something went wrong",
        statusCode: 500
      };
    const a = await r.emailPasswordSignUp(
      o
    );
    if (a.status === "OK") {
      const c = S(t, n);
      let u;
      try {
        if (u = await c.create({
          id: a.user.id,
          email: a.user.email
        }), !u)
          throw new Error("User not found");
      } catch (d) {
        throw s.error("Error while creating user"), s.error(d), await G(a.user.id), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      }
      u.roles = i, a.user = {
        ...a.user,
        ...u
      };
      for (const d of i) {
        const p = await f.addRoleToUser(
          a.user.id,
          d
        );
        p.status !== "OK" && s.error(p.status);
      }
      if (t.user.features?.signUp?.emailVerification)
        try {
          if (o.userContext.autoVerifyEmail)
            await Or(u.id);
          else {
            const d = await N.createEmailVerificationToken(
              a.user.id
            );
            d.status === "OK" && await N.sendEmail({
              type: "EMAIL_VERIFICATION",
              user: a.user,
              emailVerifyLink: `${t.appOrigin[0]}/auth/verify-email?token=${d.token}&rid=emailverification`,
              userContext: o.userContext
            });
          }
        } catch (d) {
          s.error(d);
        }
    }
    if (t.user.supertokens.sendUserAlreadyExistsWarning && a.status === "EMAIL_ALREADY_EXISTS_ERROR")
      try {
        B({
          fastify: e,
          subject: "Duplicate Email Registration",
          templateData: {
            emailId: o.email
          },
          templateName: "duplicate-email-warning",
          to: o.email
        });
      } catch (c) {
        s.error(c);
      }
    return a;
  };
}, Pr = (r, e) => async (t) => {
  if (t.userContext.roles = [e.config.user.role || z], r.emailPasswordSignUpPOST === void 0)
    throw new Error("Should never come here");
  if (e.config.user.features?.signUp?.enabled === !1)
    throw {
      name: "SIGN_UP_DISABLED",
      message: "SignUp feature is currently disabled",
      statusCode: 404
    };
  const s = await r.emailPasswordSignUpPOST(t);
  return s.status === "OK" ? {
    status: "OK",
    user: s.user,
    session: s.session
  } : s;
}, _ = (r, e) => {
  const t = mr(
    {
      invalid: "Email is invalid",
      required: "Email is required"
    },
    e.user.email
  ).safeParse(r);
  return t.success ? { success: !0 } : {
    message: t.error.issues[0].message,
    success: !1
  };
}, yr = (r) => [
  {
    id: "email",
    validate: async (e) => {
      const t = _(e, r);
      if (!t.success)
        return t.message;
    }
  },
  {
    id: "password",
    validate: async (e) => {
      const t = F(e, r);
      if (!t.success)
        return t.message;
    }
  }
], Ur = (r) => {
  let e = [];
  if (typeof r.user.supertokens?.recipes?.thirdPartyEmailPassword == "object") {
    const s = r.user.supertokens?.recipes?.thirdPartyEmailPassword.signUpFeature?.formFields;
    s && (e = [...s]);
  }
  const t = new Set(e.map((s) => s.id));
  for (const s of yr(r))
    t.has(s.id) || e.push(s);
  return e;
}, br = (r, e) => async (t) => {
  const s = await r.resetPasswordUsingToken(t);
  if (s.status === "OK" && s.userId) {
    const n = await Ae(s.userId);
    n && B({
      fastify: e,
      subject: "Reset Password Notification",
      templateName: "reset-password-notification",
      to: n.email,
      templateData: {
        emailId: n.email
      }
    });
  }
  return s;
}, Tr = (r, e) => {
  const t = e.config.appOrigin[0];
  return async (s) => {
    const n = s.userContext._default.request.request, o = n.headers.referer || n.headers.origin || n.hostname, i = Y(o) || t, a = s.passwordResetLink.replace(
      t + "/auth/reset-password",
      i + (e.config.user.supertokens.resetPasswordPath || Be)
    );
    B({
      fastify: e,
      subject: "Reset Password",
      templateName: "reset-password",
      to: s.user.email,
      templateData: {
        passwordResetLink: a
      }
    });
  };
}, Ar = (r, e) => {
  const { config: t, log: s } = e;
  return async (n) => {
    const o = n.userContext.roles || [];
    if (!await Ne(
      n.thirdPartyId,
      n.thirdPartyUserId,
      n.userContext
    ) && t.user.features?.signUp?.enabled === !1)
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404
      };
    const a = await r.thirdPartySignInUp(
      n
    );
    if (a.status === "OK" && a.createdNewUser) {
      if (!await he(o))
        throw await G(a.user.id), s.error(`At least one role from ${o.join(", ")} does not exist.`), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      for (const c of o) {
        const u = await f.addRoleToUser(
          a.user.id,
          c
        );
        u.status !== "OK" && s.error(u.status);
      }
    }
    return a;
  };
}, Nr = (r, e) => {
  const { config: t, log: s, slonik: n } = e;
  return async (o) => {
    if (o.userContext.roles = [t.user.role || z], r.thirdPartySignInUpPOST === void 0)
      throw new Error("Should never come here");
    const i = await r.thirdPartySignInUpPOST(o);
    if (i.status === "OK") {
      const a = S(t, n);
      let c;
      if (i.createdNewUser)
        try {
          if (c = await a.create({
            id: i.user.id,
            email: i.user.email
          }), !c)
            throw new Error("User not found");
          c.roles = o.userContext.roles;
        } catch (u) {
          throw s.error("Error while creating user"), s.error(u), await G(i.user.id), {
            name: "SIGN_UP_FAILED",
            message: "Something went wrong",
            statusCode: 500
          };
        }
      else {
        if (c = await a.findById(i.user.id), !c)
          return s.error(
            `User record not found for userId ${i.user.id}`
          ), {
            status: "GENERAL_ERROR",
            message: "Something went wrong"
          };
        c.lastLoginAt = Date.now(), await a.update(c.id, {
          lastLoginAt: b(new Date(c.lastLoginAt))
        }).catch((u) => {
          s.error(
            `Unable to update lastLoginAt for userId ${i.user.id}`
          ), s.error(u);
        });
      }
      return {
        status: "OK",
        createdNewUser: i.createdNewUser,
        user: {
          ...i.user,
          ...c
        },
        session: i.session,
        authCodeResponse: i.authCodeResponse
      };
    }
    return i;
  };
}, _r = (r) => {
  const { Apple: e, Facebook: t, Github: s, Google: n } = $, o = r.user.supertokens.providers, i = [], a = [
    { name: "google", initProvider: n },
    { name: "github", initProvider: s },
    { name: "facebook", initProvider: t },
    { name: "apple", initProvider: e }
  ];
  for (const c of a)
    if (o?.[c.name])
      if (c.name === "apple") {
        const u = o[c.name];
        if (u)
          for (const d of u)
            i.push(c.initProvider(d));
      } else
        i.push(
          c.initProvider(
            o[c.name]
          )
        );
  return i;
}, kr = (r) => {
  const { config: e } = r;
  let t = {};
  return typeof e.user.supertokens.recipes?.thirdPartyEmailPassword == "object" && (t = e.user.supertokens.recipes.thirdPartyEmailPassword), {
    override: {
      apis: (s) => {
        const n = {};
        if (t.override?.apis) {
          const o = t.override.apis;
          let i;
          for (i in o) {
            const a = o[i];
            a && (n[i] = a(
              s,
              r
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...s,
          emailPasswordSignUpPOST: Pr(
            s,
            r
          ),
          thirdPartySignInUpPOST: Nr(
            s,
            r
          ),
          appleRedirectHandlerPOST: vr(
            s
          ),
          ...n
        };
      },
      functions: (s) => {
        const n = {};
        if (t.override?.functions) {
          const o = t.override.functions;
          let i;
          for (i in o) {
            const a = o[i];
            a && (n[i] = a(
              s,
              r
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...s,
          emailPasswordSignIn: Rr(
            s,
            r
          ),
          emailPasswordSignUp: Ir(
            s,
            r
          ),
          resetPasswordUsingToken: br(
            s,
            r
          ),
          thirdPartySignInUp: Ar(
            s,
            r
          ),
          ...n
        };
      }
    },
    signUpFeature: {
      formFields: Ur(e)
    },
    emailDelivery: {
      override: (s) => {
        let n;
        return t?.sendEmail && (n = t.sendEmail), {
          ...s,
          sendEmail: n ? n(s, r) : Tr(s, r)
        };
      }
    },
    providers: _r(e)
  };
}, Cr = (r) => {
  const e = r.config.user.supertokens.recipes?.thirdPartyEmailPassword;
  return typeof e == "function" ? $.init(e(r)) : $.init(
    kr(r)
  );
}, Lr = () => ({}), $r = (r) => {
  const e = r.config.user.supertokens.recipes;
  return e && e.userRoles ? f.init(e.userRoles(r)) : f.init(Lr());
}, Fr = (r) => {
  const e = [
    Sr(r),
    Cr(r),
    $r(r)
  ];
  return r.config.user.features?.signUp?.emailVerification && e.push(ur(r)), e;
}, Dr = (r) => {
  const { config: e } = r;
  oe.init({
    appInfo: {
      apiDomain: e.baseUrl,
      appName: e.appName,
      websiteDomain: e.appOrigin[0]
    },
    framework: "fastify",
    recipeList: Fr(r),
    supertokens: {
      connectionURI: e.user.supertokens.connectionUri
    }
  });
}, Wr = async (r, e, t) => {
  const { config: s, log: n } = r;
  n.info("Registering supertokens plugin"), Dr(r), r.setErrorHandler(Ie()), await r.register(Re, {
    origin: s.appOrigin,
    allowedHeaders: [
      "Content-Type",
      "st-auth-mode",
      ...oe.getAllCORSHeaders()
    ],
    credentials: !0
  }), await r.register(Oe), await r.register(Pe), n.info("Registering supertokens plugin complete"), r.decorate("verifySession", Ue), t();
}, Vr = M(Wr), Mr = async (r, e, t) => {
  const { config: s, slonik: n, dbSchema: o } = e;
  let i;
  try {
    const a = await A.getSession(e, ye(t), {
      sessionRequired: !1,
      overrideGlobalClaimValidators: async (c) => c.filter(
        (u) => u.id !== ve.key
      )
    });
    i = a === void 0 ? void 0 : a.getUserId();
  } catch (a) {
    throw A.Error.isErrorFromSuperTokens(a) ? new l.ErrorWithProps(
      "Session related error",
      {
        code: "UNAUTHENTICATED",
        http: {
          status: a.type === A.Error.INVALID_CLAIMS ? 403 : 401
        }
      },
      a.type === A.Error.INVALID_CLAIMS ? 403 : 401
    ) : a;
  }
  if (i && !r.user) {
    const a = S(s, n, o);
    let c = null;
    try {
      c = await a.findById(i);
    } catch {
    }
    if (!c)
      throw new Error("Unable to find user");
    const { roles: u } = await f.getRolesForUser(i);
    r.user = c, r.roles = u;
  }
}, Br = M(
  async (r, e, t) => {
    const { mercurius: s } = r.config;
    await r.register(Vr), r.decorate("hasPermission", ir), s.enabled && await r.register(or), t();
  }
);
Br.updateContext = Mr;
const Hr = /* @__PURE__ */ new Set([
  "id",
  "disable",
  "enable",
  "email",
  "lastLoginAt",
  "roles",
  "signedUpAt"
]), fe = (r) => {
  for (const e of Object.keys(r))
    Hr.has(Q.camelize(e)) && delete r[e];
}, Kr = {
  adminSignUp: async (r, e, t) => {
    const { app: s, config: n, reply: o } = t;
    try {
      const { email: i, password: a } = e.data, c = await f.getUsersThatHaveRole(P);
      let u;
      if (c.status === "UNKNOWN_ROLE_ERROR" ? u = c.status : c.users.length > 0 && (u = "First admin user already exists"), u)
        return new l.ErrorWithProps(u);
      const d = _(i, n);
      if (!d.success && d.message)
        return new l.ErrorWithProps(
          d.message
        );
      const p = F(a, n);
      if (!p.success && p.message)
        return new l.ErrorWithProps(
          p.message
        );
      const m = await J(i, a, {
        autoVerifyEmail: !0,
        roles: [P],
        _default: {
          request: {
            request: o.request
          }
        }
      });
      return m.status !== "OK" ? new l.ErrorWithProps(
        m.status
      ) : (await j(o.request, o, m.user.id), {
        ...m,
        user: {
          ...m.user,
          roles: [P]
        }
      });
    } catch (i) {
      s.log.error(i);
      const a = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return a.statusCode = 500, a;
    }
  },
  disableUser: async (r, e, t) => {
    const { id: s } = e;
    if (t.user?.id === s) {
      const i = new l.ErrorWithProps(
        "you cannot disable yourself"
      );
      return i.statusCode = 409, i;
    }
    return await S(
      t.config,
      t.database,
      t.dbSchema
    ).update(s, { disabled: !0 }) ? { status: "OK" } : new l.ErrorWithProps(`user id ${s} not found`, {}, 404);
  },
  enableUser: async (r, e, t) => {
    const { id: s } = e;
    return await S(
      t.config,
      t.database,
      t.dbSchema
    ).update(s, { disabled: !1 }) ? { status: "OK" } : new l.ErrorWithProps(`user id ${s} not found`, {}, 404);
  },
  changePassword: async (r, e, t) => {
    const s = S(
      t.config,
      t.database,
      t.dbSchema
    );
    try {
      return t.user?.id ? await s.changePassword(
        t.user.id,
        e.oldPassword,
        e.newPassword
      ) : {
        status: "NOT_FOUND",
        message: "User not found"
      };
    } catch (n) {
      t.app.log.error(n);
      const o = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return o.statusCode = 500, o;
    }
  },
  updateMe: async (r, e, t) => {
    const { data: s } = e, n = S(
      t.config,
      t.database,
      t.dbSchema
    );
    try {
      return t.user?.id ? (fe(s), await n.update(t.user.id, s)) : {
        status: "NOT_FOUND",
        message: "User not found"
      };
    } catch (o) {
      t.app.log.error(o);
      const i = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return i.statusCode = 500, i;
    }
  }
}, qr = {
  canAdminSignUp: async (r, e, t) => {
    const { app: s } = t;
    try {
      const n = await f.getUsersThatHaveRole(P);
      return n.status === "UNKNOWN_ROLE_ERROR" ? new l.ErrorWithProps(n.status) : n.users.length > 0 ? { signUp: !1 } : { signUp: !0 };
    } catch (n) {
      s.log.error(n);
      const o = new l.ErrorWithProps(
        "Oops! Something went wrong"
      );
      return o.statusCode = 500, o;
    }
  },
  me: async (r, e, t) => {
    const s = S(
      t.config,
      t.database,
      t.dbSchema
    );
    if (t.user?.id)
      return await s.findById(t.user.id);
    {
      t.app.log.error(
        "Could not able to get user id from mercurius context"
      );
      const n = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return n.statusCode = 500, n;
    }
  },
  user: async (r, e, t) => await S(
    t.config,
    t.database,
    t.dbSchema
  ).findById(e.id),
  users: async (r, e, t) => await S(
    t.config,
    t.database,
    t.dbSchema
  ).list(
    e.limit,
    e.offset,
    e.filters ? JSON.parse(JSON.stringify(e.filters)) : void 0,
    e.sort ? JSON.parse(JSON.stringify(e.sort)) : void 0
  )
}, Ws = { Mutation: Kr, Query: qr }, jr = async (r, e) => {
  const { body: t, config: s, log: n } = r;
  try {
    const { email: o, password: i } = t, a = await f.getUsersThatHaveRole(P);
    if (a.status === "UNKNOWN_ROLE_ERROR")
      return e.send({
        status: "ERROR",
        message: a.status
      });
    if (a.users.length > 0)
      return e.send({
        status: "ERROR",
        message: "First admin user already exists"
      });
    const c = _(o, s);
    if (!c.success)
      return e.send({
        status: "ERROR",
        message: c.message
      });
    const u = F(i, s);
    if (!u.success)
      return e.send({
        status: "ERROR",
        message: u.message
      });
    const d = await J(o, i, {
      autoVerifyEmail: !0,
      roles: [P],
      _default: {
        request: {
          request: r
        }
      }
    });
    if (d.status !== "OK")
      return e.send(d);
    await j(r, e, d.user.id), e.send({
      ...d,
      user: {
        ...d.user,
        roles: [P]
      }
    });
  } catch (o) {
    n.error(o), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, Jr = async (r, e) => {
  const { log: t } = r;
  try {
    const s = await f.getUsersThatHaveRole(P);
    if (s.status === "UNKNOWN_ROLE_ERROR")
      return e.send({
        status: "ERROR",
        message: s.status
      });
    if (s.users.length > 0)
      return e.send({ signUp: !1 });
    e.send({ signUp: !0 });
  } catch (s) {
    t.error(s), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, xr = async (r, e) => {
  try {
    const t = r.session, s = r.body, n = t && t.getUserId();
    if (!n)
      throw new Error("User not found in session");
    const o = s.oldPassword ?? "", i = s.newPassword ?? "", c = await S(
      r.config,
      r.slonik,
      r.dbSchema
    ).changePassword(n, o, i);
    e.send(c);
  } catch (t) {
    r.log.error(t), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
      error: t
    });
  }
}, Gr = async (r, e) => {
  if (r.session) {
    const { id: t } = r.params;
    return r.session.getUserId() === t ? (e.status(409), await e.send({
      message: "you cannot disable yourself"
    })) : await S(
      r.config,
      r.slonik,
      r.dbSchema
    ).update(t, { disabled: !0 }) ? await e.send({ status: "OK" }) : (e.status(404), await e.send({ message: `user id ${t} not found` }));
  } else
    throw r.log.error("could not get session"), new Error("Oops, Something went wrong");
}, Qr = async (r, e) => {
  if (r.session) {
    const { id: t } = r.params;
    return await S(
      r.config,
      r.slonik,
      r.dbSchema
    ).update(t, { disabled: !1 }) ? await e.send({ status: "OK" }) : (e.status(404), await e.send({ message: `user id ${t} not found` }));
  } else
    throw r.log.error("could not get session"), new Error("Oops, Something went wrong");
}, zr = async (r, e) => {
  const t = S(
    r.config,
    r.slonik,
    r.dbSchema
  ), s = r.session?.getUserId();
  if (s)
    e.send(await t.findById(s));
  else
    throw r.log.error("Could not able to get user id from session"), new Error("Oops, Something went wrong");
}, Yr = async (r, e) => {
  const t = r.session?.getUserId(), s = r.body;
  if (t) {
    const n = S(
      r.config,
      r.slonik,
      r.dbSchema
    );
    fe(s), e.send(await n.update(t, s));
  } else
    throw r.log.error("could not get user id from session"), new Error("Oops, Something went wrong");
}, Xr = async (r, e) => {
  const t = S(
    r.config,
    r.slonik,
    r.dbSchema
  ), { limit: s, offset: n, filters: o, sort: i } = r.query, a = await t.list(
    s,
    n,
    o ? JSON.parse(o) : void 0,
    i ? JSON.parse(i) : void 0
  );
  e.send(a);
}, U = {
  adminSignUp: jr,
  canAdminSignUp: Jr,
  changePassword: xr,
  disable: Gr,
  enable: Qr,
  me: zr,
  updateMe: Yr,
  users: Xr
}, Vs = async (r, e, t) => {
  const s = r.config.user.handlers?.user;
  r.get(
    qe,
    {
      preHandler: [
        r.verifySession(),
        r.hasPermission(sr)
      ]
    },
    s?.users || U.users
  ), r.post(
    Ke,
    {
      preHandler: r.verifySession()
    },
    s?.changePassword || U.changePassword
  ), r.get(
    re,
    {
      preHandler: r.verifySession()
    },
    s?.me || U.me
  ), r.put(
    re,
    {
      preHandler: r.verifySession()
    },
    s?.updateMe || U.updateMe
  ), r.put(
    je,
    {
      preHandler: [
        r.verifySession(),
        r.hasPermission(er)
      ]
    },
    s?.disable || U.disable
  ), r.put(
    Je,
    {
      preHandler: [
        r.verifySession(),
        r.hasPermission(rr)
      ]
    },
    s?.enable || U.enable
  ), r.post(
    ee,
    s?.adminSignUp || U.adminSignUp
  ), r.get(
    ee,
    s?.canAdminSignUp || U.canAdminSignUp
  ), t();
}, Ee = (r, e) => e || b(
  new Date(
    Date.now() + (r.user.invitation?.expireAfterInDays ?? Ce) * (24 * 60 * 60 * 1e3)
  )
);
class Zr extends ie {
  /* eslint-enabled */
  getFindByTokenSql = (e) => w.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE token = ${e};
    `;
  getListSql = (e, t, s, n) => {
    const o = ae(this.table, this.schema), i = be(
      this.config.user.table?.name || pe,
      this.schema
    );
    return w.type(this.validationSchema)`
      SELECT ${this.getTableFragment()}.*, ROW_TO_JSON("user") as "invited_by"
      FROM ${this.getTableFragment()}
      join ${i} "user" on ${this.getTableFragment()}."invited_by_id" = "user"."id"
      ${ce(s, o)}
      ${Te(o, this.getSortInput(n))}
      ${ue(e, t)};
    `;
  };
}
class es extends de {
  static TABLE = Me;
  create = async (e) => {
    const t = {
      AND: [
        { key: "email", operator: "eq", value: e.email },
        { key: "acceptedAt", operator: "eq", value: "null" },
        { key: "expiresAt", operator: "gt", value: b(/* @__PURE__ */ new Date()) },
        { key: "revokedAt", operator: "eq", value: "null" }
      ]
    };
    if (await this.count(t) > 0)
      throw new Error("Invitation already exist");
    const n = this.factory.getCreateSql(e), o = await this.database.connect(async (i) => i.query(n).then((a) => a.rows[0]));
    return o ? this.postCreate(o) : void 0;
  };
  findByToken = async (e) => {
    if (!this.validateUUID(e))
      return null;
    const t = this.factory.getFindByTokenSql(e);
    return await this.database.connect((n) => n.maybeOne(t));
  };
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new Zr(this)), this._factory;
  }
  validateUUID = (e) => /^[\da-f]{8}(?:\b-[\da-f]{4}){3}\b-[\da-f]{12}$/gi.test(e);
}
const O = (r, e, t) => {
  const s = r.user.services?.invitation || es;
  return new s(r, e, t);
}, K = (r) => !(r.acceptedAt || r.revokedAt || Date.now() > r.expiresAt), rs = (r, e, t) => {
  const { token: s } = e;
  let n = r.user.invitation?.acceptLinkPath || ke;
  return n = n.replace(/:token(?!\w)/g, s), new URL(n, t).href;
}, q = async (r, e, t) => {
  const { config: s, log: n } = r, o = s.apps?.find((i) => i.id === e.appId)?.origin || Y(t || "") || s.appOrigin[0];
  o ? B({
    fastify: r,
    subject: "Invitation for Sign Up",
    templateData: {
      invitationLink: rs(s, e, o)
    },
    templateName: "user-invitation",
    to: e.email
  }) : n.error(`Could not send email for invitation ID ${e.id}`);
}, ss = {
  acceptInvitation: async (r, e, t) => {
    const { app: s, config: n, database: o, dbSchema: i, reply: a } = t, { token: c, data: u } = e;
    try {
      const { email: d, password: p } = u, m = _(d, n);
      if (!m.success && m.message)
        return new l.ErrorWithProps(
          m.message
        );
      const g = F(p, n);
      if (!g.success && g.message)
        return new l.ErrorWithProps(
          g.message
        );
      const E = O(n, o, i), h = await E.findByToken(c);
      if (!h || !K(h))
        return new l.ErrorWithProps(
          "Invitation is invalid or has expired"
        );
      if (h.email != d)
        return new l.ErrorWithProps(
          "Email do not match with the invitation"
        );
      const R = await J(d, p, {
        roles: [h.role],
        autoVerifyEmail: !0
      });
      if (R.status !== "OK")
        return R;
      await E.update(h.id, {
        acceptedAt: b(new Date(Date.now()))
      });
      try {
        await n.user.invitation?.postAccept?.(
          a.request,
          h,
          R.user
        );
      } catch (I) {
        s.log.error(I);
      }
      return await j(a.request, a, R.user.id), {
        ...R,
        user: {
          ...R.user,
          roles: [h.role]
        }
      };
    } catch (d) {
      s.log.error(d);
      const p = new l.ErrorWithProps(
        "Oops! Something went wrong"
      );
      return p.statusCode = 500, p;
    }
  },
  createInvitation: async (r, e, t) => {
    const { app: s, config: n, database: o, dbSchema: i, reply: a, user: c } = t;
    try {
      if (!c)
        throw new Error("User not found in session");
      const { appId: u, email: d, expiresAt: p, payload: m, role: g } = e.data, E = _(d, n);
      if (!E.success && E.message)
        return new l.ErrorWithProps(E.message);
      const h = O(n, o, i), R = {
        key: "email",
        operator: "eq",
        value: d
      };
      if (await h.count(R) > 0)
        return new l.ErrorWithProps(
          `User with email ${d} already exists`
        );
      const y = {
        email: d,
        expiresAt: Ee(n, p),
        invitedById: c.id,
        role: g || n.user.role || P
      }, D = n.apps?.find((v) => v.id == u);
      if (D)
        if (D.supportedRoles.includes(y.role))
          y.appId = u;
        else
          return new l.ErrorWithProps(
            `App ${D.name} does not support role ${y.role}`
          );
      Object.keys(m || {}).length > 0 && (y.payload = JSON.stringify(m));
      let W;
      try {
        W = await h.create(y);
      } catch (v) {
        return new l.ErrorWithProps(v.message);
      }
      if (W) {
        try {
          const { headers: v, hostname: k } = a.request, C = v.referer || v.origin || k;
          q(s, W, C);
        } catch (v) {
          s.log.error(v);
        }
        return W;
      }
    } catch (u) {
      s.log.error(u);
      const d = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return d.statusCode = 500, d;
    }
  },
  resendInvitation: async (r, e, t) => {
    const { app: s, config: n, database: o, dbSchema: i, reply: a } = t, u = await O(n, o, i).findById(e.id);
    if (!u || !K(u))
      return new l.ErrorWithProps(
        "Invitation is invalid or has expired"
      );
    const { headers: d, hostname: p } = a.request, m = d.referer || d.origin || p;
    try {
      q(s, u, m);
    } catch (g) {
      s.log.error(g);
    }
    return u;
  },
  revokeInvitation: async (r, e, t) => {
    const s = O(
      t.config,
      t.database,
      t.dbSchema
    );
    let n = await s.findById(e.id), o;
    return n ? n.acceptedAt ? o = "Invitation is already accepted" : Date.now() > n.expiresAt ? o = "Invitation is expired" : n.revokedAt && (o = "Invitation is already revoked") : o = "Invitation not found", o ? new l.ErrorWithProps(o) : (n = await s.update(e.id, {
      revokedAt: b(new Date(Date.now()))
    }), n);
  }
}, ts = {
  getInvitationByToken: async (r, e, t) => {
    try {
      return await O(
        t.config,
        t.database,
        t.dbSchema
      ).findByToken(e.token);
    } catch (s) {
      t.app.log.error(s);
      const n = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return n.statusCode = 500, n;
    }
  },
  invitations: async (r, e, t) => await O(
    t.config,
    t.database,
    t.dbSchema
  ).list(
    e.limit,
    e.offset,
    e.filters ? JSON.parse(JSON.stringify(e.filters)) : void 0,
    e.sort ? JSON.parse(JSON.stringify(e.sort)) : void 0
  )
}, Ms = { Mutation: ss, Query: ts }, ns = async (r, e) => {
  const { body: t, config: s, dbSchema: n, log: o, params: i, slonik: a } = r, { token: c } = i;
  try {
    const { email: u, password: d } = t, p = _(u, s);
    if (!p.success)
      return e.send({
        status: "ERROR",
        message: p.message
      });
    const m = F(d, s);
    if (!m.success)
      return e.send({
        status: "ERROR",
        message: m.message
      });
    const g = O(s, a, n), E = await g.findByToken(c);
    if (!E || !K(E))
      return e.send({
        status: "ERROR",
        message: "Invitation is invalid or has expired"
      });
    if (E.email != u)
      return e.send({
        status: "ERROR",
        message: "Email do not match with the invitation"
      });
    const h = await J(u, d, {
      roles: [E.role],
      autoVerifyEmail: !0
    });
    if (h.status !== "OK")
      return e.send(h);
    await g.update(E.id, {
      acceptedAt: b(new Date(Date.now()))
    });
    try {
      await s.user.invitation?.postAccept?.(
        r,
        E,
        h.user
      );
    } catch (R) {
      o.error(R);
    }
    await j(r, e, h.user.id), e.send({
      ...h,
      user: {
        ...h.user,
        roles: [E.role]
      }
    });
  } catch (u) {
    o.error(u), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, os = async (r, e) => {
  const {
    body: t,
    config: s,
    dbSchema: n,
    headers: o,
    hostname: i,
    log: a,
    server: c,
    session: u,
    slonik: d
  } = r;
  try {
    const p = u && u.getUserId();
    if (!p)
      throw new Error("User not found in session");
    const { appId: m, email: g, expiresAt: E, payload: h, role: R } = t, I = _(g, s);
    if (!I.success)
      return e.send({
        status: "ERROR",
        message: I.message
      });
    const y = O(s, d, n), D = {
      key: "email",
      operator: "eq",
      value: g
    };
    if (await y.count(D) > 0)
      return e.send({
        status: "ERROR",
        message: `User with email ${g} already exists`
      });
    const v = {
      email: g,
      expiresAt: Ee(s, E),
      invitedById: p,
      role: R || s.user.role || z
    }, k = s.apps?.find((V) => V.id == m);
    if (k)
      if (k.supportedRoles.includes(v.role))
        v.appId = m;
      else
        return e.send({
          status: "ERROR",
          message: `App ${k.name} does not support role ${v.role}`
        });
    Object.keys(h || {}).length > 0 && (v.payload = JSON.stringify(h));
    let C;
    try {
      C = await y.create(v);
    } catch (V) {
      return e.send({
        status: "ERROR",
        message: V.message
      });
    }
    if (C) {
      const V = o.referer || o.origin || i;
      try {
        q(c, C, V);
      } catch (Se) {
        a.error(Se);
      }
      const X = C;
      delete X.token, e.send(X);
    }
  } catch (p) {
    a.error(p), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, is = async (r, e) => {
  const { config: t, dbSchema: s, log: n, params: o, slonik: i } = r, { token: a } = o;
  try {
    const u = await O(t, i, s).findByToken(a);
    e.send(u);
  } catch (c) {
    n.error(c), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, as = async (r, e) => {
  const { config: t, dbSchema: s, log: n, query: o, slonik: i } = r;
  try {
    const { limit: a, offset: c, filters: u, sort: d } = o, m = await O(t, i, s).list(
      a,
      c,
      u ? JSON.parse(u) : void 0,
      d ? JSON.parse(d) : void 0
    );
    for (const g of m.data)
      delete g.token;
    e.send(m);
  } catch (a) {
    n.error(a), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, cs = async (r, e) => {
  const { config: t, dbSchema: s, headers: n, hostname: o, log: i, params: a, slonik: c, server: u } = r;
  try {
    const { id: d } = a, m = await O(t, c, s).findById(d);
    if (!m || !K(m))
      return e.send({
        status: "ERROR",
        message: "Invitation is invalid or has expired"
      });
    const g = n.referer || n.origin || o;
    try {
      q(u, m, g);
    } catch (h) {
      i.error(h);
    }
    const E = m;
    delete E.token, e.send(E);
  } catch (d) {
    i.error(d), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, us = async (r, e) => {
  const { config: t, dbSchema: s, log: n, params: o, slonik: i } = r;
  try {
    const { id: a } = o, c = O(t, i, s);
    let u = await c.findById(a);
    if (u) {
      if (u.acceptedAt)
        return e.send({
          status: "error",
          message: "Invitation is already accepted"
        });
      if (Date.now() > u.expiresAt)
        return e.send({
          status: "error",
          message: "Invitation is expired"
        });
      if (u.revokedAt)
        return e.send({
          status: "error",
          message: "Invitation is already revoked"
        });
    } else
      return e.send({
        status: "error",
        message: "Invitation not found"
      });
    u = await c.update(a, {
      revokedAt: b(new Date(Date.now()))
    });
    const d = u;
    delete d.token, e.send(d);
  } catch (a) {
    n.error(a), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, L = {
  acceptInvitation: ns,
  createInvitation: os,
  getInvitationByToken: is,
  listInvitation: as,
  resendInvitation: cs,
  revokeInvitation: us
}, Bs = async (r, e, t) => {
  const s = r.config.user.handlers?.invitation;
  r.get(
    Le,
    {
      preHandler: [
        r.verifySession(),
        r.hasPermission(Ye)
      ]
    },
    s?.list || L.listInvitation
  ), r.post(
    Fe,
    {
      preHandler: [
        r.verifySession(),
        r.hasPermission(ze)
      ]
    },
    s?.create || L.createInvitation
  ), r.get(
    De,
    s?.getByToken || L.getInvitationByToken
  ), r.post(
    $e,
    s?.accept || L.acceptInvitation
  ), r.put(
    Ve,
    {
      preHandler: [
        r.verifySession(),
        r.hasPermission(Ze)
      ]
    },
    s?.revoke || L.revokeInvitation
  ), r.post(
    We,
    {
      preHandler: [
        r.verifySession(),
        r.hasPermission(Xe)
      ]
    },
    s?.resend || L.resendInvitation
  ), t();
}, ds = {
  permissions: async (r, e, t) => {
    const { app: s, config: n } = t;
    try {
      return n.user.permissions || [];
    } catch (o) {
      s.log.error(o);
      const i = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return i.statusCode = 500, i;
    }
  }
}, Hs = { Query: ds }, ls = async (r, e) => {
  const { config: t, log: s } = r;
  try {
    const n = t.user.permissions || [];
    e.send({ permissions: n });
  } catch (n) {
    s.error(n), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, ms = {
  getPermissions: ls
}, Ks = async (r, e, t) => {
  r.get(
    xe,
    {
      preHandler: [r.verifySession()]
    },
    ms.getPermissions
  ), t();
};
class T {
  createRole = async (e) => {
    await f.createNewRoleOrAddPermissions(e, []);
  };
  getPermissionsForRole = async (e) => {
    let t = [];
    const s = await f.getPermissionsForRole(e);
    return s.status === "OK" && (t = s.permissions), t;
  };
  getRoles = async () => {
    let e = [];
    const t = await f.getAllRoles();
    return t.status === "OK" && (e = t.roles), e;
  };
  updateRolePermissions = async (e, t) => {
    const s = await f.getPermissionsForRole(e);
    if (s.status === "UNKNOWN_ROLE_ERROR")
      throw new Error("UNKNOWN_ROLE_ERROR");
    const n = s.permissions, o = t.filter(
      (a) => !n.includes(a)
    ), i = n.filter(
      (a) => !t.includes(a)
    );
    return await f.removePermissionsFromRole(e, i), await f.createNewRoleOrAddPermissions(e, o), this.getPermissionsForRole(e);
  };
}
const ps = {
  createRole: async (r, e, t) => {
    const { app: s } = t;
    try {
      return await new T().createRole(e.role), e.role;
    } catch (n) {
      s.log.error(n);
      const o = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return o.statusCode = 500, o;
    }
  },
  updateRolePermissions: async (r, e, t) => {
    const { app: s } = t, { permissions: n, role: o } = e;
    try {
      return await new T().updateRolePermissions(
        o,
        n
      );
    } catch (i) {
      s.log.error(i);
      const a = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return a.statusCode = 500, a;
    }
  }
}, gs = {
  roles: async (r, e, t) => {
    const { app: s } = t;
    try {
      return await new T().getRoles();
    } catch (n) {
      s.log.error(n);
      const o = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return o.statusCode = 500, o;
    }
  },
  rolePermissions: async (r, e, t) => {
    const { app: s } = t, { role: n } = e;
    let o = [];
    try {
      return n && (o = await new T().getPermissionsForRole(n)), o;
    } catch (i) {
      s.log.error(i);
      const a = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return a.statusCode = 500, a;
    }
  }
}, qs = { Mutation: ps, Query: gs }, ws = async (r, e) => {
  const { body: t, log: s } = r, { role: n } = t;
  try {
    return await new T().createRole(n), e.send({ role: n });
  } catch (o) {
    return s.error(o), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, hs = async (r, e) => {
  const { log: t, query: s } = r;
  let n = [];
  try {
    const { role: o } = s;
    return o && (n = await new T().getPermissionsForRole(o)), e.send({ permissions: n });
  } catch (o) {
    return t.error(o), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, fs = async (r, e) => {
  const { log: t } = r;
  try {
    const n = await new T().getRoles();
    return e.send({ roles: n });
  } catch (s) {
    return t.error(s), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, Es = async (r, e) => {
  const { log: t, body: s } = r;
  try {
    const { role: n, permissions: o } = s, a = await new T().updateRolePermissions(
      n,
      o
    );
    return e.send({ permissions: a });
  } catch (n) {
    return t.error(n), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, H = {
  createRole: ws,
  getRoles: fs,
  getPermissions: hs,
  updatePermissions: Es
}, js = async (r, e, t) => {
  r.get(
    se,
    {
      preHandler: [r.verifySession()]
    },
    H.getRoles
  ), r.get(
    te,
    {
      preHandler: [r.verifySession()]
    },
    H.getPermissions
  ), r.post(
    se,
    {
      preHandler: [r.verifySession()]
    },
    H.createRole
  ), r.put(
    te,
    {
      preHandler: [r.verifySession()]
    },
    H.updatePermissions
  ), t();
}, Js = async (r) => {
  const { roles: e } = await f.getAllRoles();
  return e.includes(r);
};
export {
  Ge as EMAIL_VERIFICATION_MODE,
  Qe as EMAIL_VERIFICATION_PATH,
  ke as INVITATION_ACCEPT_LINK_PATH,
  Ce as INVITATION_EXPIRE_AFTER_IN_DAYS,
  es as InvitationService,
  Zr as InvitationSqlFactory,
  ze as PERMISSIONS_INVITIATIONS_CREATE,
  Ye as PERMISSIONS_INVITIATIONS_LIST,
  Xe as PERMISSIONS_INVITIATIONS_RESEND,
  Ze as PERMISSIONS_INVITIATIONS_REVOKE,
  er as PERMISSIONS_USERS_DISABLE,
  rr as PERMISSIONS_USERS_ENABLE,
  sr as PERMISSIONS_USERS_LIST,
  Be as RESET_PASSWORD_PATH,
  P as ROLE_ADMIN,
  He as ROLE_SUPER_ADMIN,
  z as ROLE_USER,
  Ke as ROUTE_CHANGE_PASSWORD,
  Le as ROUTE_INVITATIONS,
  $e as ROUTE_INVITATIONS_ACCEPT,
  Fe as ROUTE_INVITATIONS_CREATE,
  De as ROUTE_INVITATIONS_GET_BY_TOKEN,
  We as ROUTE_INVITATIONS_RESEND,
  Ve as ROUTE_INVITATIONS_REVOKE,
  re as ROUTE_ME,
  xe as ROUTE_PERMISSIONS,
  se as ROUTE_ROLES,
  te as ROUTE_ROLES_PERMISSIONS,
  ee as ROUTE_SIGNUP_ADMIN,
  qe as ROUTE_USERS,
  je as ROUTE_USERS_DISABLE,
  Je as ROUTE_USERS_ENABLE,
  T as RoleService,
  Me as TABLE_INVITATIONS,
  pe as TABLE_USERS,
  wr as UserService,
  lr as UserSqlFactory,
  he as areRolesExist,
  Ee as computeInvitationExpiresAt,
  Br as default,
  Qs as formatDate,
  O as getInvitationService,
  Y as getOrigin,
  S as getUserService,
  ge as hasUserPermission,
  Ms as invitationResolver,
  Bs as invitationRoutes,
  K as isInvitationValid,
  Js as isRoleExists,
  Hs as permissionResolver,
  Ks as permissionRoutes,
  qs as roleResolver,
  js as roleRoutes,
  B as sendEmail,
  q as sendInvitation,
  Ws as userResolver,
  Vs as userRoutes,
  _ as validateEmail,
  F as validatePassword,
  Or as verifyEmail
};

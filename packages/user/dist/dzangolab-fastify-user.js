import "@dzangolab/fastify-mercurius";
import q from "fastify-plugin";
import l from "mercurius";
import ae from "mercurius-auth";
import A, { EmailVerificationClaim as Ie } from "supertokens-node/recipe/emailverification";
import g from "supertokens-node/recipe/userroles";
import b, { Error as te, createNewSession as G } from "supertokens-node/recipe/session";
import Pe from "@fastify/cors";
import ye from "@fastify/formbody";
import ce, { deleteUser as Z } from "supertokens-node";
import { errorHandler as Ue, plugin as Ne, wrapResponse as Te } from "supertokens-node/framework/fastify";
import { verifySession as _e } from "supertokens-node/recipe/session/framework/fastify";
import "@dzangolab/fastify-mailer";
import { DefaultSqlFactory as ue, createTableIdentifier as de, createFilterFragment as le, createLimitFragment as me, BaseService as ge, formatDate as _, createTableFragment as be, createSortFragment as Ae } from "@dzangolab/fastify-slonik";
import { formatDate as Yr } from "@dzangolab/fastify-slonik";
import B, { getUserById as ke, getUserByThirdPartyInfo as Ce, emailPasswordSignUp as Q } from "supertokens-node/recipe/thirdpartyemailpassword";
import ee from "humps";
import { sql as E } from "slonik";
import pe from "validator";
import { z as we } from "zod";
const Le = q(async (s) => {
  await s.register(ae, {
    async applyPolicy(e, t, r, n) {
      return n.user ? n.user.disabled ? new l.ErrorWithProps("user is disabled", {}, 401) : s.config.user.features?.signUp?.emailVerification && !await A.isEmailVerified(n.user.id) ? new l.ErrorWithProps(
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
}), $e = "/signup/token/:token", Fe = 30, De = "/invitations", We = "/invitations/token/:token", Ve = "/invitations", Ke = "/invitations/token/:token", He = "/invitations/resend/:id(^\\d+)", Me = "/invitations/revoke/:id(^\\d+)", Be = "invitations", qe = "/reset-password", D = "ADMIN", k = "SUPER_ADMIN", z = "USER", je = "/change_password", ne = "/signup/admin", oe = "/me", Je = "/users", xe = "/users/:id/disable", Ge = "/users/:id/enable", he = "users", Y = "/roles", ie = "/roles/permissions", Qe = "/permissions", ze = "REQUIRED", Ye = "/verify-email", Xe = "invitations:create", Ze = "invitations:list", es = "invitations:resend", ss = "invitations:revoke", rs = "users:disable", ts = "users:enable", ns = "users:enable", w = "public", os = async (s) => {
  let e = [];
  for (const t of s) {
    const r = await g.getPermissionsForRole(t);
    r.status === "OK" && (e = [.../* @__PURE__ */ new Set([...e, ...r.permissions])]);
  }
  return e;
}, Ee = async (s, e, t) => {
  const r = s.config.user.permissions;
  if (!r || !r.includes(t))
    return !0;
  const { roles: n } = await g.getRolesForUser(w, e);
  if (n && n.includes(k))
    return !0;
  const o = await os(n);
  return !(!o || !o.includes(t));
}, is = q(async (s) => {
  await s.register(ae, {
    applyPolicy: async (e, t, r, n) => {
      const o = e.arguments.find(
        (a) => a.name.value === "permission"
      ).value.value;
      return n.user ? await Ee(
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
}), as = q(async (s) => {
  s.config.mercurius.enabled && (await s.register(is), await s.register(Le));
}), cs = (s) => async (e) => {
  const t = e.session?.getUserId();
  if (!t)
    throw new te({
      type: "UNAUTHORISED",
      message: "unauthorised"
    });
  if (!await Ee(e.server, t, s))
    throw new te({
      type: "INVALID_CLAIMS",
      message: "Not have enough permission",
      payload: [
        {
          id: g.PermissionClaim.key,
          reason: {
            message: "Not have enough permission",
            expectedToInclude: s
          }
        }
      ]
    });
}, se = (s) => {
  let e;
  try {
    if (e = new URL(s).origin, !e || e === "null")
      throw new Error("Origin is empty");
  } catch {
    e = "";
  }
  return e;
}, j = async ({
  fastify: s,
  subject: e,
  templateData: t = {},
  templateName: r,
  to: n
}) => {
  const { config: o, log: i, mailer: a } = s;
  return a.sendMail({
    subject: e,
    templateName: r,
    to: n,
    templateData: {
      appName: o.appName,
      ...t
    }
  }).catch((c) => {
    i.error(c.stack);
  });
}, us = (s, e) => {
  const t = e.config.appOrigin[0];
  return async (r) => {
    let n;
    try {
      const i = r.userContext._default.request.request, a = i.headers.referer || i.headers.origin || i.hostname;
      n = se(a) || t;
    } catch {
      n = t;
    }
    const o = r.emailVerifyLink.replace(
      t + "/auth/verify-email",
      n + (e.config.user.supertokens.emailVerificationPath || Ye)
    );
    j({
      fastify: e,
      subject: "Email Verification",
      templateName: "email-verification",
      to: r.user.email,
      templateData: {
        emailVerifyLink: o
      }
    });
  };
}, ds = (s) => {
  const { config: e } = s;
  let t = {};
  return typeof e.user.supertokens.recipes?.emailVerification == "object" && (t = e.user.supertokens.recipes.emailVerification), {
    mode: t?.mode || ze,
    emailDelivery: {
      override: (r) => {
        let n;
        return t?.sendEmail && (n = t.sendEmail), {
          ...r,
          sendEmail: n ? n(r, s) : us(r, s)
        };
      }
    },
    override: {
      apis: (r) => {
        const n = {};
        if (t.override?.apis) {
          const o = t.override.apis;
          let i;
          for (i in o) {
            const a = o[i];
            a && (n[i] = a(
              r,
              s
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...r,
          verifyEmailPOST: async (o) => {
            if (r.verifyEmailPOST === void 0)
              throw new Error("Should never come here");
            return o.session ? await r.verifyEmailPOST(
              o
            ) : {
              status: "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR"
            };
          },
          ...n
        };
      },
      functions: (r) => {
        const n = {};
        if (t.override?.functions) {
          const o = t.override.functions;
          let i;
          for (i in o) {
            const a = o[i];
            a && (n[i] = a(
              r,
              s
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...r,
          ...n
        };
      }
    }
  };
}, ls = (s) => {
  const e = s.config.user.supertokens.recipes?.emailVerification;
  return typeof e == "function" ? A.init(e(s)) : A.init(ds(s));
}, ms = (s, e) => {
  if (e && e.length > 0) {
    const t = [];
    for (const r of e) {
      const n = r.direction === "ASC" ? E.fragment`ASC` : E.fragment`DESC`;
      let o;
      r.key === "roles" && (o = E.fragment`user_role.role ->> 0`);
      const i = E.identifier([
        ...s.names,
        ee.decamelize(r.key)
      ]);
      t.push(
        E.fragment`${o ?? i} ${n}`
      );
    }
    return E.fragment`ORDER BY ${E.join(t, E.fragment`,`)}`;
  }
  return E.fragment``;
}, X = (s, e) => {
  let t = E.fragment`ASC`;
  return Array.isArray(e) || (e = []), e.some((r) => r.key === "roles" && r.direction != "ASC" ? (t = E.fragment`DESC`, !0) : !1), E.fragment`ORDER BY ${s} ${t}`;
};
class gs extends ue {
  /* eslint-enabled */
  getFindByIdSql = (e) => E.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(ur.role ${X(
    E.identifier(["ur", "role"])
  )}) AS role
        FROM "public"."st__user_roles" as ur
        WHERE ur.user_id = users.id
      ) AS user_role ON TRUE
      WHERE id = ${e};
    `;
  getListSql = (e, t, r, n) => {
    const o = de(this.table, this.schema);
    return E.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(ur.role ${X(
      E.identifier(["ur", "role"]),
      n
    )}) AS role
        FROM "public"."st__user_roles" as ur
        WHERE ur.user_id = users.id
      ) AS user_role ON TRUE
      ${le(r, o)}
      ${ms(o, this.getSortInput(n))}
      ${me(e, t)};
    `;
  };
  getUpdateSql = (e, t) => {
    const r = [];
    for (const n in t) {
      const o = t[n];
      r.push(
        E.fragment`${E.identifier([ee.decamelize(n)])} = ${o}`
      );
    }
    return E.type(this.validationSchema)`
      UPDATE ${this.getTableFragment()}
      SET ${E.join(r, E.fragment`, `)}
      WHERE id = ${e}
      RETURNING *, (
        SELECT COALESCE(user_role.role, '[]') AS roles
        FROM ${this.getTableFragment()}
        LEFT JOIN LATERAL (
          SELECT jsonb_agg(ur.role ${X(
      E.identifier(["ur", "role"])
    )}) AS role
          FROM "public"."st__user_roles" as ur
          WHERE ur.user_id = users.id
        ) AS user_role ON TRUE
        WHERE id = ${e}
      ) as roles;
    `;
  };
}
const ps = (s, e) => we.string({
  required_error: s.required
}).refine((t) => pe.isEmail(t, e || {}), {
  message: s.invalid
}), fe = {
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
}, ws = (s, e) => {
  const t = {
    ...fe,
    ...e
  };
  return we.string({
    required_error: s.required
  }).refine(
    (r) => pe.isStrongPassword(
      r,
      t
    ),
    {
      message: s.weak
    }
  );
}, hs = (s) => {
  let e = "Password is too weak";
  if (!s)
    return e;
  const t = [];
  if (s.minLength) {
    const r = s.minLength;
    t.push(
      `minimum ${r} ${r > 1 ? "characters" : "character"}`
    );
  }
  if (s.minLowercase) {
    const r = s.minLowercase;
    t.push(
      `minimum ${r} ${r > 1 ? "lowercases" : "lowercase"}`
    );
  }
  if (s.minUppercase) {
    const r = s.minUppercase;
    t.push(
      `minimum ${r} ${r > 1 ? "uppercases" : "uppercase"}`
    );
  }
  if (s.minNumbers) {
    const r = s.minNumbers;
    t.push(`minimum ${r} ${r > 1 ? "numbers" : "number"}`);
  }
  if (s.minSymbols) {
    const r = s.minSymbols;
    t.push(`minimum ${r} ${r > 1 ? "symbols" : "symbol"}`);
  }
  if (t.length > 0) {
    e = "Password should contain ";
    const r = t.pop();
    t.length > 0 && (e += t.join(", ") + " and "), e += r;
  }
  return e;
}, W = (s, e) => {
  const t = e.user.password, r = ws(
    {
      required: "Password is required",
      weak: hs({ ...fe, ...t })
    },
    t
  ).safeParse(s);
  return r.success ? { success: !0 } : {
    message: r.error.issues[0].message,
    success: !1
  };
};
class Es extends ge {
  get table() {
    return this.config.user?.table?.name || he;
  }
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new gs(this)), this._factory;
  }
  changePassword = async (e, t, r) => {
    const n = W(r, this.config);
    if (!n.success)
      return {
        status: "FIELD_ERROR",
        message: n.message
      };
    const o = await B.getUserById(e);
    if (t && r)
      if (o)
        if ((await B.emailPasswordSignIn(
          w,
          o.email,
          t,
          { dbSchema: this.schema }
        )).status === "OK") {
          if (await B.updateEmailOrPassword({
            userId: e,
            password: r
          }))
            return await b.revokeAllSessionsForUser(e), {
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
const S = (s, e, t) => {
  const r = s.user.services?.user || Es;
  return new r(
    s,
    e,
    t
  );
}, fs = (s, e) => async (t) => {
  if (s.createNewSession === void 0)
    throw new Error("Should never come here");
  const r = t.userContext._default.request.request, n = await s.createNewSession(
    t
  ), o = n.getUserId();
  if ((await S(
    r.config,
    r.slonik,
    r.dbSchema
  ).findById(o))?.disabled)
    throw await n.revokeSession(), {
      name: "SIGN_IN_FAILED",
      message: "user is disabled",
      statusCode: 401
    };
  return n;
}, Rs = (s, e) => async (t) => {
  if (s.verifySession === void 0)
    throw new Error("Should never come here");
  const r = await s.verifySession(t);
  if (r) {
    const n = r.getUserId(), o = t.userContext._default.request.request;
    if ((await S(
      o.config,
      o.slonik,
      o.dbSchema
    ).findById(n))?.disabled)
      throw await r.revokeSession(), {
        name: "SESSION_VERIFICATION_FAILED",
        message: "user is disabled",
        statusCode: 401
      };
  }
  return r;
}, Ss = (s) => {
  const { config: e } = s;
  let t = {};
  return typeof e.user.supertokens.recipes?.session == "object" && (t = e.user.supertokens.recipes.session), {
    ...t,
    getTokenTransferMethod: (r) => r.req.getHeaderValue("st-auth-mode") === "header" ? "header" : "cookie",
    override: {
      apis: (r) => {
        const n = {};
        if (t.override?.apis) {
          const o = t.override.apis;
          let i;
          for (i in o) {
            const a = o[i];
            a && (n[i] = a(
              r,
              s
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...r,
          verifySession: Rs(r),
          ...n
        };
      },
      functions: (r) => {
        const n = {};
        if (t.override?.functions) {
          const o = t.override.functions;
          let i;
          for (i in o) {
            const a = o[i];
            a && (n[i] = a(
              r,
              s
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...r,
          createNewSession: fs(r),
          ...n
        };
      },
      openIdFeature: t.override?.openIdFeature
    }
  };
}, vs = (s) => {
  const e = s.config.user.supertokens.recipes?.session;
  return typeof e == "function" ? b.init(e(s)) : b.init(Ss(s));
}, Os = (s, e) => async (t) => {
  if (s.appleRedirectHandlerPOST === void 0)
    throw new Error("Should never come here");
  const r = t.formPostInfoFromProvider.state, n = JSON.parse(
    Buffer.from(r, "base64").toString("ascii")
  );
  if (n.isAndroid && n.appId) {
    const i = `intent://callback?${`code=${t.formPostInfoFromProvider.code}&state=${t.formPostInfoFromProvider.state}`}#Intent;package=${n.appId};scheme=signinwithapple;end`;
    t.options.res.original.redirect(i);
  } else
    s.appleRedirectHandlerPOST(t);
}, Is = (s, e) => {
  const { config: t, log: r, slonik: n } = e;
  return async (o) => {
    const i = await s.emailPasswordSignIn(
      o
    );
    if (i.status !== "OK")
      return i;
    const a = S(t, n), c = await a.findById(i.user.id);
    return c ? (c.lastLoginAt = Date.now(), await a.update(c.id, {
      lastLoginAt: _(new Date(c.lastLoginAt))
    }).catch((d) => {
      r.error(
        `Unable to update lastLoginAt for userId ${i.user.id}`
      ), r.error(d);
    }), {
      status: "OK",
      user: {
        ...i.user,
        ...c
      }
    }) : (r.error(`User record not found for userId ${i.user.id}`), { status: "WRONG_CREDENTIALS_ERROR" });
  };
}, Ps = async (s) => {
  const e = await A.createEmailVerificationToken(
    w,
    s
  );
  e.status === "OK" && await A.verifyEmailUsingToken(
    w,
    e.token
  );
}, Re = async (s) => {
  const { roles: e } = await g.getAllRoles();
  return s.every((t) => e.includes(t));
}, ys = (s, e) => {
  const { config: t, log: r, slonik: n } = e;
  return async (o) => {
    const i = o.userContext.roles || [];
    if (!await Re(i))
      throw r.error(`At least one role from ${i.join(", ")} does not exist.`), {
        name: "SIGN_UP_FAILED",
        message: "Something went wrong",
        statusCode: 500
      };
    const a = await s.emailPasswordSignUp(
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
        throw r.error("Error while creating user"), r.error(d), await Z(a.user.id), {
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
        const m = await g.addRoleToUser(
          w,
          a.user.id,
          d
        );
        m.status !== "OK" && r.error(m.status);
      }
      if (t.user.features?.signUp?.emailVerification)
        try {
          if (o.userContext.autoVerifyEmail)
            await Ps(u.id);
          else {
            const d = await A.createEmailVerificationToken(
              w,
              a.user.id
            );
            d.status === "OK" && await A.sendEmail({
              type: "EMAIL_VERIFICATION",
              user: a.user,
              emailVerifyLink: `${t.appOrigin[0]}/auth/verify-email?token=${d.token}&rid=emailverification`,
              tenantId: w,
              userContext: o.userContext
            });
          }
        } catch (d) {
          r.error(d);
        }
    }
    if (t.user.supertokens.sendUserAlreadyExistsWarning && a.status === "EMAIL_ALREADY_EXISTS_ERROR")
      try {
        j({
          fastify: e,
          subject: "Duplicate Email Registration",
          templateData: {
            emailId: o.email
          },
          templateName: "duplicate-email-warning",
          to: o.email
        });
      } catch (c) {
        r.error(c);
      }
    return a;
  };
}, Us = (s, e) => async (t) => {
  if (t.userContext.roles = [e.config.user.role || z], s.emailPasswordSignUpPOST === void 0)
    throw new Error("Should never come here");
  if (e.config.user.features?.signUp?.enabled === !1)
    throw {
      name: "SIGN_UP_DISABLED",
      message: "SignUp feature is currently disabled",
      statusCode: 404
    };
  const r = await s.emailPasswordSignUpPOST(t);
  return r.status === "OK" ? {
    status: "OK",
    user: r.user,
    session: r.session
  } : r;
}, C = (s, e) => {
  const t = ps(
    {
      invalid: "Email is invalid",
      required: "Email is required"
    },
    e.user.email
  ).safeParse(s);
  return t.success ? { success: !0 } : {
    message: t.error.issues[0].message,
    success: !1
  };
}, Ns = (s) => [
  {
    id: "email",
    validate: async (e) => {
      const t = C(e, s);
      if (!t.success)
        return t.message;
    }
  },
  {
    id: "password",
    validate: async (e) => {
      const t = W(e, s);
      if (!t.success)
        return t.message;
    }
  }
], Ts = (s) => {
  let e = [];
  if (typeof s.user.supertokens?.recipes?.thirdPartyEmailPassword == "object") {
    const r = s.user.supertokens?.recipes?.thirdPartyEmailPassword.signUpFeature?.formFields;
    r && (e = [...r]);
  }
  const t = new Set(e.map((r) => r.id));
  for (const r of Ns(s))
    t.has(r.id) || e.push(r);
  return e;
}, _s = (s, e) => async (t) => {
  const r = await s.resetPasswordUsingToken(t);
  if (r.status === "OK" && r.userId) {
    const n = await ke(r.userId);
    n && j({
      fastify: e,
      subject: "Reset Password Notification",
      templateName: "reset-password-notification",
      to: n.email,
      templateData: {
        emailId: n.email
      }
    });
  }
  return r;
}, bs = (s, e) => {
  const t = e.config.appOrigin[0];
  return async (r) => {
    const n = r.userContext._default.request.request, o = n.headers.referer || n.headers.origin || n.hostname, i = se(o) || t, a = r.passwordResetLink.replace(
      t + "/auth/reset-password",
      i + (e.config.user.supertokens.resetPasswordPath || qe)
    );
    j({
      fastify: e,
      subject: "Reset Password",
      templateName: "reset-password",
      to: r.user.email,
      templateData: {
        passwordResetLink: a
      }
    });
  };
}, As = (s, e) => {
  const { config: t, log: r } = e;
  return async (n) => {
    const o = n.userContext.roles || [];
    if (!await Ce(
      n.tenantId,
      n.thirdPartyId,
      n.thirdPartyUserId,
      n.userContext
    ) && t.user.features?.signUp?.enabled === !1)
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404
      };
    const a = await s.thirdPartySignInUp(
      n
    );
    if (a.status === "OK" && a.createdNewUser) {
      if (!await Re(o))
        throw await Z(a.user.id), r.error(`At least one role from ${o.join(", ")} does not exist.`), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      for (const c of o) {
        const u = await g.addRoleToUser(
          w,
          a.user.id,
          c
        );
        u.status !== "OK" && r.error(u.status);
      }
    }
    return a;
  };
}, ks = (s, e) => {
  const { config: t, log: r, slonik: n } = e;
  return async (o) => {
    if (o.userContext.roles = [t.user.role || z], s.thirdPartySignInUpPOST === void 0)
      throw new Error("Should never come here");
    const i = await s.thirdPartySignInUpPOST(o);
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
          throw r.error("Error while creating user"), r.error(u), await Z(i.user.id), {
            name: "SIGN_UP_FAILED",
            message: "Something went wrong",
            statusCode: 500
          };
        }
      else {
        if (c = await a.findById(i.user.id), !c)
          return r.error(
            `User record not found for userId ${i.user.id}`
          ), {
            status: "GENERAL_ERROR",
            message: "Something went wrong"
          };
        c.lastLoginAt = Date.now(), await a.update(c.id, {
          lastLoginAt: _(new Date(c.lastLoginAt))
        }).catch((u) => {
          r.error(
            `Unable to update lastLoginAt for userId ${i.user.id}`
          ), r.error(u);
        });
      }
      return {
        ...i,
        user: {
          ...i.user,
          ...c
        }
      };
    }
    return i;
  };
}, Cs = (s) => {
  const { config: e } = s;
  let t = {};
  return typeof e.user.supertokens.recipes?.thirdPartyEmailPassword == "object" && (t = e.user.supertokens.recipes.thirdPartyEmailPassword), {
    override: {
      apis: (r) => {
        const n = {};
        if (t.override?.apis) {
          const o = t.override.apis;
          let i;
          for (i in o) {
            const a = o[i];
            a && (n[i] = a(
              r,
              s
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...r,
          emailPasswordSignUpPOST: Us(
            r,
            s
          ),
          thirdPartySignInUpPOST: ks(
            r,
            s
          ),
          appleRedirectHandlerPOST: Os(
            r
          ),
          ...n
        };
      },
      functions: (r) => {
        const n = {};
        if (t.override?.functions) {
          const o = t.override.functions;
          let i;
          for (i in o) {
            const a = o[i];
            a && (n[i] = a(
              r,
              s
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...r,
          emailPasswordSignIn: Is(
            r,
            s
          ),
          emailPasswordSignUp: ys(
            r,
            s
          ),
          resetPasswordUsingToken: _s(
            r,
            s
          ),
          thirdPartySignInUp: As(
            r,
            s
          ),
          ...n
        };
      }
    },
    signUpFeature: {
      formFields: Ts(e)
    },
    emailDelivery: {
      override: (r) => {
        let n;
        return t?.sendEmail && (n = t.sendEmail), {
          ...r,
          sendEmail: n ? n(r, s) : bs(r, s)
        };
      }
    },
    providers: e.user.supertokens.providers
  };
}, Ls = (s) => {
  const e = s.config.user.supertokens.recipes?.thirdPartyEmailPassword;
  return typeof e == "function" ? B.init(e(s)) : B.init(
    Cs(s)
  );
}, $s = () => ({}), Fs = (s) => {
  const e = s.config.user.supertokens.recipes;
  return e && e.userRoles ? g.init(e.userRoles(s)) : g.init($s());
}, Ds = (s) => {
  const e = [
    vs(s),
    Ls(s),
    Fs(s)
  ];
  return s.config.user.features?.signUp?.emailVerification && e.push(ls(s)), e;
}, Ws = (s) => {
  const { config: e } = s;
  ce.init({
    appInfo: {
      apiDomain: e.baseUrl,
      appName: e.appName,
      websiteDomain: e.appOrigin[0]
    },
    framework: "fastify",
    recipeList: Ds(s),
    supertokens: {
      connectionURI: e.user.supertokens.connectionUri
    }
  });
}, Vs = async (s, e, t) => {
  const { config: r, log: n } = s;
  n.info("Registering supertokens plugin"), Ws(s), s.setErrorHandler(Ue()), await s.register(Pe, {
    origin: r.appOrigin,
    allowedHeaders: [
      "Content-Type",
      "st-auth-mode",
      ...ce.getAllCORSHeaders()
    ],
    credentials: !0
  }), await s.register(ye), await s.register(Ne), n.info("Registering supertokens plugin complete"), s.decorate("verifySession", _e), t();
}, Ks = q(Vs), Hs = async (s, e, t) => {
  const { config: r, slonik: n, dbSchema: o } = e;
  let i;
  try {
    const a = await b.getSession(e, Te(t), {
      sessionRequired: !1,
      overrideGlobalClaimValidators: async (c) => c.filter(
        (u) => u.id !== Ie.key
      )
    });
    i = a === void 0 ? void 0 : a.getUserId();
  } catch (a) {
    throw b.Error.isErrorFromSuperTokens(a) ? new l.ErrorWithProps(
      "Session related error",
      {
        code: "UNAUTHENTICATED",
        http: {
          status: a.type === b.Error.INVALID_CLAIMS ? 403 : 401
        }
      },
      a.type === b.Error.INVALID_CLAIMS ? 403 : 401
    ) : a;
  }
  if (i && !s.user) {
    const a = S(r, n, o);
    let c = null;
    try {
      c = await a.findById(i);
    } catch {
    }
    if (!c)
      throw new Error("Unable to find user");
    const { roles: u } = await g.getRolesForUser(w, i);
    s.user = c, s.roles = u;
  }
}, Ms = q(
  async (s, e, t) => {
    const { mercurius: r } = s.config;
    await s.register(Ks), s.decorate("hasPermission", cs), r.enabled && await s.register(as), t();
  }
);
Ms.updateContext = Hs;
const Bs = /* @__PURE__ */ new Set([
  "id",
  "disable",
  "enable",
  "email",
  "lastLoginAt",
  "roles",
  "signedUpAt"
]), Se = (s) => {
  for (const e of Object.keys(s))
    Bs.has(ee.camelize(e)) && delete s[e];
}, qs = {
  adminSignUp: async (s, e, t) => {
    const { app: r, config: n, reply: o } = t;
    try {
      const { email: i, password: a } = e.data, c = await g.getUsersThatHaveRole(
        w,
        D
      ), u = await g.getUsersThatHaveRole(
        w,
        k
      );
      let d;
      if (c.status === "UNKNOWN_ROLE_ERROR" && u.status === "UNKNOWN_ROLE_ERROR" ? d = c.status : (c.status === "OK" && c.users.length > 0 || u.status === "OK" && u.users.length > 0) && (d = "First admin user already exists"), d)
        return new l.ErrorWithProps(d);
      const m = C(i, n);
      if (!m.success && m.message)
        return new l.ErrorWithProps(
          m.message
        );
      const p = W(a, n);
      if (!p.success && p.message)
        return new l.ErrorWithProps(
          p.message
        );
      const h = await Q(
        w,
        i,
        a,
        {
          autoVerifyEmail: !0,
          roles: [
            D,
            ...u.status === "OK" ? [k] : []
          ],
          _default: {
            request: {
              request: o.request
            }
          }
        }
      );
      return h.status !== "OK" ? new l.ErrorWithProps(
        h.status
      ) : (await G(
        o.request,
        o,
        w,
        h.user.id
      ), h);
    } catch (i) {
      r.log.error(i);
      const a = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return a.statusCode = 500, a;
    }
  },
  disableUser: async (s, e, t) => {
    const { id: r } = e;
    if (t.user?.id === r) {
      const i = new l.ErrorWithProps(
        "you cannot disable yourself"
      );
      return i.statusCode = 409, i;
    }
    return await S(
      t.config,
      t.database,
      t.dbSchema
    ).update(r, { disabled: !0 }) ? { status: "OK" } : new l.ErrorWithProps(`user id ${r} not found`, {}, 404);
  },
  enableUser: async (s, e, t) => {
    const { id: r } = e;
    return await S(
      t.config,
      t.database,
      t.dbSchema
    ).update(r, { disabled: !1 }) ? { status: "OK" } : new l.ErrorWithProps(`user id ${r} not found`, {}, 404);
  },
  changePassword: async (s, e, t) => {
    const r = S(
      t.config,
      t.database,
      t.dbSchema
    );
    try {
      return t.user?.id ? await r.changePassword(
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
  updateMe: async (s, e, t) => {
    const { data: r } = e, n = S(
      t.config,
      t.database,
      t.dbSchema
    );
    try {
      return t.user?.id ? (Se(r), await n.update(t.user.id, r)) : {
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
}, js = {
  canAdminSignUp: async (s, e, t) => {
    const { app: r } = t;
    try {
      const n = await g.getUsersThatHaveRole(
        w,
        D
      ), o = await g.getUsersThatHaveRole(
        w,
        k
      );
      return n.status === "UNKNOWN_ROLE_ERROR" && o.status === "UNKNOWN_ROLE_ERROR" ? new l.ErrorWithProps(n.status) : n.status === "OK" && n.users.length > 0 || o.status === "OK" && o.users.length > 0 ? { signUp: !1 } : { signUp: !0 };
    } catch (n) {
      r.log.error(n);
      const o = new l.ErrorWithProps(
        "Oops! Something went wrong"
      );
      return o.statusCode = 500, o;
    }
  },
  me: async (s, e, t) => {
    const r = S(
      t.config,
      t.database,
      t.dbSchema
    );
    if (t.user?.id)
      return await r.findById(t.user.id);
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
  user: async (s, e, t) => await S(
    t.config,
    t.database,
    t.dbSchema
  ).findById(e.id),
  users: async (s, e, t) => await S(
    t.config,
    t.database,
    t.dbSchema
  ).list(
    e.limit,
    e.offset,
    e.filters ? JSON.parse(JSON.stringify(e.filters)) : void 0,
    e.sort ? JSON.parse(JSON.stringify(e.sort)) : void 0
  )
}, Kr = { Mutation: qs, Query: js }, Js = async (s, e) => {
  const { body: t, config: r, log: n } = s;
  try {
    const { email: o, password: i } = t, a = await g.getUsersThatHaveRole(
      w,
      D
    ), c = await g.getUsersThatHaveRole(
      w,
      k
    );
    if (a.status === "UNKNOWN_ROLE_ERROR" && c.status === "UNKNOWN_ROLE_ERROR")
      return e.send({
        status: "ERROR",
        message: a.status
      });
    if (a.status === "OK" && a.users.length > 0 || c.status === "OK" && c.users.length > 0)
      return e.send({
        status: "ERROR",
        message: "First admin user already exists"
      });
    const u = C(o, r);
    if (!u.success)
      return e.send({
        status: "ERROR",
        message: u.message
      });
    const d = W(i, r);
    if (!d.success)
      return e.send({
        status: "ERROR",
        message: d.message
      });
    const m = await Q(
      w,
      o,
      i,
      {
        autoVerifyEmail: !0,
        roles: [
          D,
          ...c.status === "OK" ? [k] : []
        ],
        _default: {
          request: {
            request: s
          }
        }
      }
    );
    if (m.status !== "OK")
      return e.send(m);
    await G(s, e, w, m.user.id), e.send(m);
  } catch (o) {
    n.error(o), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, xs = async (s, e) => {
  const { log: t } = s;
  try {
    const r = await g.getUsersThatHaveRole(
      w,
      D
    ), n = await g.getUsersThatHaveRole(
      w,
      k
    );
    if (r.status === "UNKNOWN_ROLE_ERROR" && n.status === "UNKNOWN_ROLE_ERROR")
      return e.send({
        status: "ERROR",
        message: r.status
      });
    if (r.status === "OK" && r.users.length > 0 || n.status === "OK" && n.users.length > 0)
      return e.send({ signUp: !1 });
    e.send({ signUp: !0 });
  } catch (r) {
    t.error(r), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, Gs = async (s, e) => {
  try {
    const t = s.session, r = s.body, n = t && t.getUserId();
    if (!n)
      throw new Error("User not found in session");
    const o = r.oldPassword ?? "", i = r.newPassword ?? "", c = await S(
      s.config,
      s.slonik,
      s.dbSchema
    ).changePassword(n, o, i);
    e.send(c);
  } catch (t) {
    s.log.error(t), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
      error: t
    });
  }
}, Qs = async (s, e) => {
  if (s.session) {
    const { id: t } = s.params;
    return s.session.getUserId() === t ? (e.status(409), await e.send({
      message: "you cannot disable yourself"
    })) : await S(
      s.config,
      s.slonik,
      s.dbSchema
    ).update(t, { disabled: !0 }) ? await e.send({ status: "OK" }) : (e.status(404), await e.send({ message: `user id ${t} not found` }));
  } else
    throw s.log.error("could not get session"), new Error("Oops, Something went wrong");
}, zs = async (s, e) => {
  if (s.session) {
    const { id: t } = s.params;
    return await S(
      s.config,
      s.slonik,
      s.dbSchema
    ).update(t, { disabled: !1 }) ? await e.send({ status: "OK" }) : (e.status(404), await e.send({ message: `user id ${t} not found` }));
  } else
    throw s.log.error("could not get session"), new Error("Oops, Something went wrong");
}, Ys = async (s, e) => {
  const t = S(
    s.config,
    s.slonik,
    s.dbSchema
  ), r = s.session?.getUserId();
  if (r)
    e.send(await t.findById(r));
  else
    throw s.log.error("Could not able to get user id from session"), new Error("Oops, Something went wrong");
}, Xs = async (s, e) => {
  const t = s.session?.getUserId(), r = s.body;
  if (t) {
    const n = S(
      s.config,
      s.slonik,
      s.dbSchema
    );
    Se(r), e.send(await n.update(t, r));
  } else
    throw s.log.error("could not get user id from session"), new Error("Oops, Something went wrong");
}, Zs = async (s, e) => {
  const t = S(
    s.config,
    s.slonik,
    s.dbSchema
  ), { limit: r, offset: n, filters: o, sort: i } = s.query, a = await t.list(
    r,
    n,
    o ? JSON.parse(o) : void 0,
    i ? JSON.parse(i) : void 0
  );
  e.send(a);
}, T = {
  adminSignUp: Js,
  canAdminSignUp: xs,
  changePassword: Gs,
  disable: Qs,
  enable: zs,
  me: Ys,
  updateMe: Xs,
  users: Zs
}, Hr = async (s, e, t) => {
  const r = s.config.user.handlers?.user;
  s.get(
    Je,
    {
      preHandler: [
        s.verifySession(),
        s.hasPermission(ns)
      ]
    },
    r?.users || T.users
  ), s.post(
    je,
    {
      preHandler: s.verifySession()
    },
    r?.changePassword || T.changePassword
  ), s.get(
    oe,
    {
      preHandler: s.verifySession()
    },
    r?.me || T.me
  ), s.put(
    oe,
    {
      preHandler: s.verifySession()
    },
    r?.updateMe || T.updateMe
  ), s.put(
    xe,
    {
      preHandler: [
        s.verifySession(),
        s.hasPermission(rs)
      ]
    },
    r?.disable || T.disable
  ), s.put(
    Ge,
    {
      preHandler: [
        s.verifySession(),
        s.hasPermission(ts)
      ]
    },
    r?.enable || T.enable
  ), s.post(
    ne,
    r?.adminSignUp || T.adminSignUp
  ), s.get(
    ne,
    r?.canAdminSignUp || T.canAdminSignUp
  ), t();
}, ve = (s, e) => e || _(
  new Date(
    Date.now() + (s.user.invitation?.expireAfterInDays ?? Fe) * (24 * 60 * 60 * 1e3)
  )
);
class er extends ue {
  /* eslint-enabled */
  getFindByTokenSql = (e) => E.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE token = ${e};
    `;
  getListSql = (e, t, r, n) => {
    const o = de(this.table, this.schema), i = be(
      this.config.user.table?.name || he,
      this.schema
    );
    return E.type(this.validationSchema)`
      SELECT ${this.getTableFragment()}.*, ROW_TO_JSON("user") as "invited_by"
      FROM ${this.getTableFragment()}
      join ${i} "user" on ${this.getTableFragment()}."invited_by_id" = "user"."id"
      ${le(r, o)}
      ${Ae(o, this.getSortInput(n))}
      ${me(e, t)};
    `;
  };
}
class sr extends ge {
  static TABLE = Be;
  create = async (e) => {
    const t = {
      AND: [
        { key: "email", operator: "eq", value: e.email },
        { key: "acceptedAt", operator: "eq", value: "null" },
        { key: "expiresAt", operator: "gt", value: _(/* @__PURE__ */ new Date()) },
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
    return this._factory || (this._factory = new er(this)), this._factory;
  }
  validateUUID = (e) => /^[\da-f]{8}(?:\b-[\da-f]{4}){3}\b-[\da-f]{12}$/gi.test(e);
}
const I = (s, e, t) => {
  const r = s.user.services?.invitation || sr;
  return new r(s, e, t);
}, J = (s) => !(s.acceptedAt || s.revokedAt || Date.now() > s.expiresAt), rr = (s, e, t) => {
  const { token: r } = e;
  let n = s.user.invitation?.acceptLinkPath || $e;
  return n = n.replace(/:token(?!\w)/g, r), new URL(n, t).href;
}, x = async (s, e, t) => {
  const { config: r, log: n } = s, o = r.apps?.find((i) => i.id === e.appId)?.origin || se(t || "") || r.appOrigin[0];
  o ? j({
    fastify: s,
    subject: "Invitation for Sign Up",
    templateData: {
      invitationLink: rr(r, e, o)
    },
    templateName: "user-invitation",
    to: e.email
  }) : n.error(`Could not send email for invitation ID ${e.id}`);
}, tr = {
  acceptInvitation: async (s, e, t) => {
    const { app: r, config: n, database: o, dbSchema: i, reply: a } = t, { token: c, data: u } = e;
    try {
      const { email: d, password: m } = u, p = C(d, n);
      if (!p.success && p.message)
        return new l.ErrorWithProps(
          p.message
        );
      const h = W(m, n);
      if (!h.success && h.message)
        return new l.ErrorWithProps(
          h.message
        );
      const f = I(n, o, i), R = await f.findByToken(c);
      if (!R || !J(R))
        return new l.ErrorWithProps(
          "Invitation is invalid or has expired"
        );
      if (R.email != d)
        return new l.ErrorWithProps(
          "Email do not match with the invitation"
        );
      const O = await Q(
        w,
        d,
        m,
        {
          roles: [R.role],
          autoVerifyEmail: !0
        }
      );
      if (O.status !== "OK")
        return O;
      await f.update(R.id, {
        acceptedAt: _(new Date(Date.now()))
      });
      try {
        await n.user.invitation?.postAccept?.(
          a.request,
          R,
          O.user
        );
      } catch (y) {
        r.log.error(y);
      }
      return await G(
        a.request,
        a,
        w,
        O.user.id
      ), {
        ...O,
        user: {
          ...O.user,
          roles: [R.role]
        }
      };
    } catch (d) {
      r.log.error(d);
      const m = new l.ErrorWithProps(
        "Oops! Something went wrong"
      );
      return m.statusCode = 500, m;
    }
  },
  createInvitation: async (s, e, t) => {
    const { app: r, config: n, database: o, dbSchema: i, reply: a, user: c } = t;
    try {
      if (!c)
        throw new Error("User not found in session");
      const { appId: u, email: d, expiresAt: m, payload: p, role: h } = e.data, f = C(d, n);
      if (!f.success && f.message)
        return new l.ErrorWithProps(f.message);
      const R = I(n, o, i), O = {
        key: "email",
        operator: "eq",
        value: d
      };
      if (await R.count(O) > 0)
        return new l.ErrorWithProps(
          `User with email ${d} already exists`
        );
      const N = {
        email: d,
        expiresAt: ve(n, m),
        invitedById: c.id,
        role: h || n.user.role || z
      }, V = n.apps?.find((v) => v.id == u);
      if (V)
        if (V.supportedRoles.includes(N.role))
          N.appId = u;
        else
          return new l.ErrorWithProps(
            `App ${V.name} does not support role ${N.role}`
          );
      Object.keys(p || {}).length > 0 && (N.payload = JSON.stringify(p));
      let K;
      try {
        K = await R.create(N);
      } catch (v) {
        return new l.ErrorWithProps(v.message);
      }
      if (K) {
        try {
          const { headers: v, hostname: L } = a.request, $ = v.referer || v.origin || L;
          x(r, K, $);
        } catch (v) {
          r.log.error(v);
        }
        return K;
      }
    } catch (u) {
      r.log.error(u);
      const d = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return d.statusCode = 500, d;
    }
  },
  resendInvitation: async (s, e, t) => {
    const { app: r, config: n, database: o, dbSchema: i, reply: a } = t, u = await I(n, o, i).findById(e.id);
    if (!u || !J(u))
      return new l.ErrorWithProps(
        "Invitation is invalid or has expired"
      );
    const { headers: d, hostname: m } = a.request, p = d.referer || d.origin || m;
    try {
      x(r, u, p);
    } catch (h) {
      r.log.error(h);
    }
    return u;
  },
  revokeInvitation: async (s, e, t) => {
    const r = I(
      t.config,
      t.database,
      t.dbSchema
    );
    let n = await r.findById(e.id), o;
    return n ? n.acceptedAt ? o = "Invitation is already accepted" : Date.now() > n.expiresAt ? o = "Invitation is expired" : n.revokedAt && (o = "Invitation is already revoked") : o = "Invitation not found", o ? new l.ErrorWithProps(o) : (n = await r.update(e.id, {
      revokedAt: _(new Date(Date.now()))
    }), n);
  }
}, nr = {
  getInvitationByToken: async (s, e, t) => {
    try {
      return await I(
        t.config,
        t.database,
        t.dbSchema
      ).findByToken(e.token);
    } catch (r) {
      t.app.log.error(r);
      const n = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return n.statusCode = 500, n;
    }
  },
  invitations: async (s, e, t) => await I(
    t.config,
    t.database,
    t.dbSchema
  ).list(
    e.limit,
    e.offset,
    e.filters ? JSON.parse(JSON.stringify(e.filters)) : void 0,
    e.sort ? JSON.parse(JSON.stringify(e.sort)) : void 0
  )
}, Mr = { Mutation: tr, Query: nr }, or = async (s, e) => {
  const { body: t, config: r, dbSchema: n, log: o, params: i, slonik: a } = s, { token: c } = i;
  try {
    const { email: u, password: d } = t, m = C(u, r);
    if (!m.success)
      return e.send({
        status: "ERROR",
        message: m.message
      });
    const p = W(d, r);
    if (!p.success)
      return e.send({
        status: "ERROR",
        message: p.message
      });
    const h = I(r, a, n), f = await h.findByToken(c);
    if (!f || !J(f))
      return e.send({
        status: "ERROR",
        message: "Invitation is invalid or has expired"
      });
    if (f.email != u)
      return e.send({
        status: "ERROR",
        message: "Email do not match with the invitation"
      });
    const R = await Q(
      w,
      u,
      d,
      {
        roles: [f.role],
        autoVerifyEmail: !0
      }
    );
    if (R.status !== "OK")
      return e.send(R);
    await h.update(f.id, {
      acceptedAt: _(new Date(Date.now()))
    });
    try {
      await r.user.invitation?.postAccept?.(
        s,
        f,
        R.user
      );
    } catch (O) {
      o.error(O);
    }
    await G(s, e, w, R.user.id), e.send({
      ...R,
      user: {
        ...R.user,
        roles: [f.role]
      }
    });
  } catch (u) {
    o.error(u), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, ir = async (s, e) => {
  const {
    body: t,
    config: r,
    dbSchema: n,
    headers: o,
    hostname: i,
    log: a,
    server: c,
    session: u,
    slonik: d
  } = s;
  try {
    const m = u && u.getUserId();
    if (!m)
      throw new Error("User not found in session");
    const { appId: p, email: h, expiresAt: f, payload: R, role: O } = t, y = C(h, r);
    if (!y.success)
      return e.send({
        status: "ERROR",
        message: y.message
      });
    const N = I(r, d, n), V = {
      key: "email",
      operator: "eq",
      value: h
    };
    if (await N.count(V) > 0)
      return e.send({
        status: "ERROR",
        message: `User with email ${h} already exists`
      });
    const v = {
      email: h,
      expiresAt: ve(r, f),
      invitedById: m,
      role: O || r.user.role || z
    }, L = r.apps?.find((H) => H.id == p);
    if (L)
      if (L.supportedRoles.includes(v.role))
        v.appId = p;
      else
        return e.send({
          status: "ERROR",
          message: `App ${L.name} does not support role ${v.role}`
        });
    Object.keys(R || {}).length > 0 && (v.payload = JSON.stringify(R));
    let $;
    try {
      $ = await N.create(v);
    } catch (H) {
      return e.send({
        status: "ERROR",
        message: H.message
      });
    }
    if ($) {
      const H = o.referer || o.origin || i;
      try {
        x(c, $, H);
      } catch (Oe) {
        a.error(Oe);
      }
      const re = $;
      delete re.token, e.send(re);
    }
  } catch (m) {
    a.error(m), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, ar = async (s, e) => {
  const { config: t, dbSchema: r, log: n, params: o, slonik: i } = s, { token: a } = o;
  try {
    const u = await I(t, i, r).findByToken(a);
    e.send(u);
  } catch (c) {
    n.error(c), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, cr = async (s, e) => {
  const { config: t, dbSchema: r, log: n, query: o, slonik: i } = s;
  try {
    const { limit: a, offset: c, filters: u, sort: d } = o, p = await I(t, i, r).list(
      a,
      c,
      u ? JSON.parse(u) : void 0,
      d ? JSON.parse(d) : void 0
    );
    for (const h of p.data)
      delete h.token;
    e.send(p);
  } catch (a) {
    n.error(a), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, ur = async (s, e) => {
  const { config: t, dbSchema: r, headers: n, hostname: o, log: i, params: a, slonik: c, server: u } = s;
  try {
    const { id: d } = a, p = await I(t, c, r).findById(d);
    if (!p || !J(p))
      return e.send({
        status: "ERROR",
        message: "Invitation is invalid or has expired"
      });
    const h = n.referer || n.origin || o;
    try {
      x(u, p, h);
    } catch (R) {
      i.error(R);
    }
    const f = p;
    delete f.token, e.send(f);
  } catch (d) {
    i.error(d), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, dr = async (s, e) => {
  const { config: t, dbSchema: r, log: n, params: o, slonik: i } = s;
  try {
    const { id: a } = o, c = I(t, i, r);
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
      revokedAt: _(new Date(Date.now()))
    });
    const d = u;
    delete d.token, e.send(d);
  } catch (a) {
    n.error(a), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, F = {
  acceptInvitation: or,
  createInvitation: ir,
  getInvitationByToken: ar,
  listInvitation: cr,
  resendInvitation: ur,
  revokeInvitation: dr
}, Br = async (s, e, t) => {
  const r = s.config.user.handlers?.invitation;
  s.get(
    De,
    {
      preHandler: [
        s.verifySession(),
        s.hasPermission(Ze)
      ]
    },
    r?.list || F.listInvitation
  ), s.post(
    Ve,
    {
      preHandler: [
        s.verifySession(),
        s.hasPermission(Xe)
      ]
    },
    r?.create || F.createInvitation
  ), s.get(
    Ke,
    r?.getByToken || F.getInvitationByToken
  ), s.post(
    We,
    r?.accept || F.acceptInvitation
  ), s.put(
    Me,
    {
      preHandler: [
        s.verifySession(),
        s.hasPermission(ss)
      ]
    },
    r?.revoke || F.revokeInvitation
  ), s.post(
    He,
    {
      preHandler: [
        s.verifySession(),
        s.hasPermission(es)
      ]
    },
    r?.resend || F.resendInvitation
  ), t();
}, lr = {
  permissions: async (s, e, t) => {
    const { app: r, config: n } = t;
    try {
      return n.user.permissions || [];
    } catch (o) {
      r.log.error(o);
      const i = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return i.statusCode = 500, i;
    }
  }
}, qr = { Query: lr }, mr = async (s, e) => {
  const { config: t, log: r } = s;
  try {
    const n = t.user.permissions || [];
    e.send({ permissions: n });
  } catch (n) {
    r.error(n), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, gr = {
  getPermissions: mr
}, jr = async (s, e, t) => {
  s.get(
    Qe,
    {
      preHandler: [s.verifySession()]
    },
    gr.getPermissions
  ), t();
};
class U extends Error {
  statusCode;
  constructor({ message: e, name: t, statusCode: r }) {
    super(e), this.message = e, this.name = t, this.statusCode = r;
  }
}
class P {
  createRole = async (e, t) => await g.createNewRoleOrAddPermissions(
    e,
    t || []
  );
  deleteRole = async (e) => {
    const t = await g.getUsersThatHaveRole(w, e);
    if (t.status === "UNKNOWN_ROLE_ERROR")
      throw new U({
        name: t.status,
        message: "Invalid role",
        statusCode: 422
      });
    if (t.users.length > 0)
      throw new U({
        name: "ROLE_IN_USE",
        message: "The role is currently assigned to one or more users and cannot be deleted",
        statusCode: 422
      });
    return await g.deleteRole(e);
  };
  getPermissionsForRole = async (e) => {
    let t = [];
    const r = await g.getPermissionsForRole(e);
    return r.status === "OK" && (t = r.permissions), t;
  };
  getRoles = async () => {
    let e = [];
    const t = await g.getAllRoles();
    return t.status === "OK" && (e = await Promise.all(
      t.roles.map(async (r) => {
        const n = await g.getPermissionsForRole(r);
        return {
          role: r,
          permissions: n.status === "OK" ? n.permissions : []
        };
      })
    )), e;
  };
  updateRolePermissions = async (e, t) => {
    const r = await g.getPermissionsForRole(e);
    if (r.status === "UNKNOWN_ROLE_ERROR")
      throw new U({
        name: "UNKNOWN_ROLE_ERROR",
        message: "Invalid role",
        statusCode: 422
      });
    const n = r.permissions, o = t.filter(
      (c) => !n.includes(c)
    ), i = n.filter(
      (c) => !t.includes(c)
    );
    return await g.removePermissionsFromRole(e, i), await g.createNewRoleOrAddPermissions(e, o), {
      status: "OK",
      permissions: await this.getPermissionsForRole(e)
    };
  };
}
const pr = {
  createRole: async (s, e, t) => {
    const { app: r } = t;
    try {
      return await new P().createRole(
        e.role,
        e.permissions
      );
    } catch (n) {
      r.log.error(n);
      const o = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return o.statusCode = 500, o;
    }
  },
  deleteRole: async (s, e, t) => {
    const { app: r } = t;
    try {
      const n = new P(), { role: o } = e;
      return await n.deleteRole(o);
    } catch (n) {
      if (n instanceof U) {
        const i = new l.ErrorWithProps(n.name);
        return i.statusCode = n.statusCode, i;
      }
      r.log.error(n);
      const o = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return o.statusCode = 500, o;
    }
  },
  updateRolePermissions: async (s, e, t) => {
    const { app: r } = t, { permissions: n, role: o } = e;
    try {
      return await new P().updateRolePermissions(
        o,
        n
      );
    } catch (i) {
      if (i instanceof U) {
        const c = new l.ErrorWithProps(i.name);
        return c.statusCode = i.statusCode, c;
      }
      r.log.error(i);
      const a = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return a.statusCode = 500, a;
    }
  }
}, wr = {
  roles: async (s, e, t) => {
    const { app: r } = t;
    try {
      return await new P().getRoles();
    } catch (n) {
      r.log.error(n);
      const o = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return o.statusCode = 500, o;
    }
  },
  rolePermissions: async (s, e, t) => {
    const { app: r } = t, { role: n } = e;
    let o = [];
    try {
      return n && (o = await new P().getPermissionsForRole(n)), o;
    } catch (i) {
      r.log.error(i);
      const a = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return a.statusCode = 500, a;
    }
  }
}, Jr = { Mutation: pr, Query: wr }, hr = async (s, e) => {
  const { body: t, log: r } = s, { role: n, permissions: o } = t;
  try {
    const a = await new P().createRole(n, o);
    return e.send(a);
  } catch (i) {
    return r.error(i), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, Er = async (s, e) => {
  const { log: t, query: r } = s;
  try {
    let { role: n } = r;
    if (n) {
      try {
        n = JSON.parse(n);
      } catch {
      }
      if (typeof n != "string")
        throw new U({
          name: "UNKNOWN_ROLE_ERROR",
          message: "Invalid role",
          statusCode: 422
        });
      const i = await new P().deleteRole(n);
      return e.send(i);
    }
    throw new U({
      name: "UNKNOWN_ROLE_ERROR",
      message: "Invalid role",
      statusCode: 422
    });
  } catch (n) {
    return n instanceof U ? (e.status(n.statusCode), e.send({
      message: n.message,
      name: n.name,
      statusCode: n.statusCode
    })) : (t.error(n), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    }));
  }
}, fr = async (s, e) => {
  const { log: t, query: r } = s;
  let n = [];
  try {
    let { role: o } = r;
    if (o) {
      try {
        o = JSON.parse(o);
      } catch {
      }
      if (typeof o != "string")
        return e.send({ permissions: n });
      n = await new P().getPermissionsForRole(o);
    }
    return e.send({ permissions: n });
  } catch (o) {
    return t.error(o), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, Rr = async (s, e) => {
  const { log: t } = s;
  try {
    const n = await new P().getRoles();
    return e.send({ roles: n });
  } catch (r) {
    return t.error(r), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, Sr = async (s, e) => {
  const { log: t, body: r } = s;
  try {
    const { role: n, permissions: o } = r, a = await new P().updateRolePermissions(
      n,
      o
    );
    return e.send(a);
  } catch (n) {
    return n instanceof U ? (e.status(n.statusCode), e.send({
      message: n.message,
      name: n.name,
      statusCode: n.statusCode
    })) : (t.error(n), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    }));
  }
}, M = {
  deleteRole: Er,
  createRole: hr,
  getRoles: Rr,
  getPermissions: fr,
  updatePermissions: Sr
}, xr = async (s, e, t) => {
  s.delete(
    Y,
    {
      preHandler: [s.verifySession()]
    },
    M.deleteRole
  ), s.get(
    Y,
    {
      preHandler: [s.verifySession()]
    },
    M.getRoles
  ), s.get(
    ie,
    {
      preHandler: [s.verifySession()]
    },
    M.getPermissions
  ), s.post(
    Y,
    {
      preHandler: [s.verifySession()]
    },
    M.createRole
  ), s.put(
    ie,
    {
      preHandler: [s.verifySession()]
    },
    M.updatePermissions
  ), t();
}, Gr = async (s) => {
  const { roles: e } = await g.getAllRoles();
  return e.includes(s);
};
export {
  ze as EMAIL_VERIFICATION_MODE,
  Ye as EMAIL_VERIFICATION_PATH,
  $e as INVITATION_ACCEPT_LINK_PATH,
  Fe as INVITATION_EXPIRE_AFTER_IN_DAYS,
  sr as InvitationService,
  er as InvitationSqlFactory,
  Xe as PERMISSIONS_INVITATIONS_CREATE,
  Ze as PERMISSIONS_INVITATIONS_LIST,
  es as PERMISSIONS_INVITATIONS_RESEND,
  ss as PERMISSIONS_INVITATIONS_REVOKE,
  rs as PERMISSIONS_USERS_DISABLE,
  ts as PERMISSIONS_USERS_ENABLE,
  ns as PERMISSIONS_USERS_LIST,
  qe as RESET_PASSWORD_PATH,
  D as ROLE_ADMIN,
  k as ROLE_SUPER_ADMIN,
  z as ROLE_USER,
  je as ROUTE_CHANGE_PASSWORD,
  De as ROUTE_INVITATIONS,
  We as ROUTE_INVITATIONS_ACCEPT,
  Ve as ROUTE_INVITATIONS_CREATE,
  Ke as ROUTE_INVITATIONS_GET_BY_TOKEN,
  He as ROUTE_INVITATIONS_RESEND,
  Me as ROUTE_INVITATIONS_REVOKE,
  oe as ROUTE_ME,
  Qe as ROUTE_PERMISSIONS,
  Y as ROUTE_ROLES,
  ie as ROUTE_ROLES_PERMISSIONS,
  ne as ROUTE_SIGNUP_ADMIN,
  Je as ROUTE_USERS,
  xe as ROUTE_USERS_DISABLE,
  Ge as ROUTE_USERS_ENABLE,
  P as RoleService,
  Be as TABLE_INVITATIONS,
  he as TABLE_USERS,
  w as TENANT_ID,
  Es as UserService,
  gs as UserSqlFactory,
  Re as areRolesExist,
  ve as computeInvitationExpiresAt,
  Ms as default,
  Yr as formatDate,
  I as getInvitationService,
  se as getOrigin,
  S as getUserService,
  Ee as hasUserPermission,
  Mr as invitationResolver,
  Br as invitationRoutes,
  J as isInvitationValid,
  Gr as isRoleExists,
  qr as permissionResolver,
  jr as permissionRoutes,
  Jr as roleResolver,
  xr as roleRoutes,
  j as sendEmail,
  x as sendInvitation,
  Kr as userResolver,
  Hr as userRoutes,
  C as validateEmail,
  W as validatePassword,
  Ps as verifyEmail
};

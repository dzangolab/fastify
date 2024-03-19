import "@dzangolab/fastify-mercurius";
import B from "fastify-plugin";
import l from "mercurius";
import oe from "mercurius-auth";
import _, { EmailVerificationClaim as ve } from "supertokens-node/recipe/emailverification";
import E from "supertokens-node/recipe/userroles";
import N, { Error as ee, createNewSession as J } from "supertokens-node/recipe/session";
import Ie from "@fastify/cors";
import Oe from "@fastify/formbody";
import ie, { deleteUser as Q } from "supertokens-node";
import { errorHandler as Pe, plugin as ye, wrapResponse as Ue } from "supertokens-node/framework/fastify";
import { verifySession as be } from "supertokens-node/recipe/session/framework/fastify";
import "@dzangolab/fastify-mailer";
import { DefaultSqlFactory as ae, createTableIdentifier as ce, createFilterFragment as ue, createLimitFragment as de, BaseService as le, formatDate as T, createTableFragment as Te, createSortFragment as Ae } from "@dzangolab/fastify-slonik";
import { formatDate as Qs } from "@dzangolab/fastify-slonik";
import M, { getUserById as Ne, getUserByThirdPartyInfo as _e, emailPasswordSignUp as x } from "supertokens-node/recipe/thirdpartyemailpassword";
import z from "humps";
import { sql as w } from "slonik";
import me from "validator";
import { z as ge } from "zod";
const ke = B(async (r) => {
  await r.register(oe, {
    async applyPolicy(e, t, s, n) {
      return n.user ? n.user.disabled ? new l.ErrorWithProps("user is disabled", {}, 401) : r.config.user.features?.signUp?.emailVerification && !await _.isEmailVerified(n.user.id) ? new l.ErrorWithProps(
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
}), Ce = "/signup/token/:token", Le = 30, $e = "/invitations", Fe = "/invitations/token/:token", De = "/invitations", We = "/invitations/token/:token", Ve = "/invitations/resend/:id(^\\d+)", Me = "/invitations/revoke/:id(^\\d+)", Be = "invitations", He = "/reset-password", y = "ADMIN", Ke = "SUPER_ADMIN", Y = "USER", qe = "/change_password", re = "/signup/admin", se = "/me", je = "/users", Je = "/users/:id/disable", xe = "/users/:id/enable", pe = "users", te = "/roles", ne = "/roles/permissions", Ge = "/permissions", Qe = "REQUIRED", ze = "/verify-email", Ye = "invitations:create", Xe = "invitations:list", Ze = "invitations:resend", er = "invitations:revoke", rr = "users:disable", sr = "users:enable", tr = "users:enable", f = "public", nr = async (r) => {
  let e = [];
  for (const t of r) {
    const s = await E.getPermissionsForRole(t);
    s.status === "OK" && (e = [.../* @__PURE__ */ new Set([...e, ...s.permissions])]);
  }
  return e;
}, we = async (r, e, t) => {
  const s = r.config.user.permissions;
  if (!s || !s.includes(t))
    return !0;
  const { roles: n } = await E.getRolesForUser(f, e);
  if (n && n.includes(Ke))
    return !0;
  const o = await nr(n);
  return !(!o || !o.includes(t));
}, or = B(async (r) => {
  await r.register(oe, {
    applyPolicy: async (e, t, s, n) => {
      const o = e.arguments.find(
        (a) => a.name.value === "permission"
      ).value.value;
      return n.user ? await we(
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
}), ir = B(async (r) => {
  r.config.mercurius.enabled && (await r.register(or), await r.register(ke));
}), ar = (r) => async (e) => {
  const t = e.session?.getUserId();
  if (!t)
    throw new ee({
      type: "UNAUTHORISED",
      message: "unauthorised"
    });
  if (!await we(e.server, t, r))
    throw new ee({
      type: "INVALID_CLAIMS",
      message: "Not have enough permission",
      payload: [
        {
          id: E.PermissionClaim.key,
          reason: {
            message: "Not have enough permission",
            expectedToInclude: r
          }
        }
      ]
    });
}, X = (r) => {
  let e;
  try {
    if (e = new URL(r).origin, !e || e === "null")
      throw new Error("Origin is empty");
  } catch {
    e = "";
  }
  return e;
}, H = async ({
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
  }).catch((u) => {
    i.error(u.stack);
  });
}, cr = (r, e) => {
  const t = e.config.appOrigin[0];
  return async (s) => {
    let n;
    try {
      const i = s.userContext._default.request.request, a = i.headers.referer || i.headers.origin || i.hostname;
      n = X(a) || t;
    } catch {
      n = t;
    }
    const o = s.emailVerifyLink.replace(
      t + "/auth/verify-email",
      n + (e.config.user.supertokens.emailVerificationPath || ze)
    );
    H({
      fastify: e,
      subject: "Email Verification",
      templateName: "email-verification",
      to: s.user.email,
      templateData: {
        emailVerifyLink: o
      }
    });
  };
}, ur = (r) => {
  const { config: e } = r;
  let t = {};
  return typeof e.user.supertokens.recipes?.emailVerification == "object" && (t = e.user.supertokens.recipes.emailVerification), {
    mode: t?.mode || Qe,
    emailDelivery: {
      override: (s) => {
        let n;
        return t?.sendEmail && (n = t.sendEmail), {
          ...s,
          sendEmail: n ? n(s, r) : cr(s, r)
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
}, dr = (r) => {
  const e = r.config.user.supertokens.recipes?.emailVerification;
  return typeof e == "function" ? _.init(e(r)) : _.init(ur(r));
}, lr = (r, e) => {
  if (e && e.length > 0) {
    const t = [];
    for (const s of e) {
      const n = s.direction === "ASC" ? w.fragment`ASC` : w.fragment`DESC`;
      let o;
      s.key === "roles" && (o = w.fragment`user_role.role ->> 0`);
      const i = w.identifier([
        ...r.names,
        z.decamelize(s.key)
      ]);
      t.push(
        w.fragment`${o ?? i} ${n}`
      );
    }
    return w.fragment`ORDER BY ${w.join(t, w.fragment`,`)}`;
  }
  return w.fragment``;
}, G = (r, e) => {
  let t = w.fragment`ASC`;
  return Array.isArray(e) || (e = []), e.some((s) => s.key === "roles" && s.direction != "ASC" ? (t = w.fragment`DESC`, !0) : !1), w.fragment`ORDER BY ${r} ${t}`;
};
class mr extends ae {
  /* eslint-enabled */
  getFindByIdSql = (e) => w.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(ur.role ${G(
    w.identifier(["ur", "role"])
  )}) AS role
        FROM "public"."st__user_roles" as ur
        WHERE ur.user_id = users.id
      ) AS user_role ON TRUE
      WHERE id = ${e};
    `;
  getListSql = (e, t, s, n) => {
    const o = ce(this.table, this.schema);
    return w.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(ur.role ${G(
      w.identifier(["ur", "role"]),
      n
    )}) AS role
        FROM "public"."st__user_roles" as ur
        WHERE ur.user_id = users.id
      ) AS user_role ON TRUE
      ${ue(s, o)}
      ${lr(o, this.getSortInput(n))}
      ${de(e, t)};
    `;
  };
  getUpdateSql = (e, t) => {
    const s = [];
    for (const n in t) {
      const o = t[n];
      s.push(
        w.fragment`${w.identifier([z.decamelize(n)])} = ${o}`
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
          SELECT jsonb_agg(ur.role ${G(
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
const gr = (r, e) => ge.string({
  required_error: r.required
}).refine((t) => me.isEmail(t, e || {}), {
  message: r.invalid
}), he = {
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
    ...he,
    ...e
  };
  return ge.string({
    required_error: r.required
  }).refine(
    (s) => me.isStrongPassword(
      s,
      t
    ),
    {
      message: r.weak
    }
  );
}, wr = (r) => {
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
      weak: wr({ ...he, ...t })
    },
    t
  ).safeParse(r);
  return s.success ? { success: !0 } : {
    message: s.error.issues[0].message,
    success: !1
  };
};
class hr extends le {
  get table() {
    return this.config.user?.table?.name || pe;
  }
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new mr(this)), this._factory;
  }
  changePassword = async (e, t, s) => {
    const n = F(s, this.config);
    if (!n.success)
      return {
        status: "FIELD_ERROR",
        message: n.message
      };
    const o = await M.getUserById(e);
    if (t && s)
      if (o)
        if ((await M.emailPasswordSignIn(
          f,
          o.email,
          t,
          { dbSchema: this.schema }
        )).status === "OK") {
          if (await M.updateEmailOrPassword({
            userId: e,
            password: s
          }))
            return await N.revokeAllSessionsForUser(e), {
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
const R = (r, e, t) => {
  const s = r.user.services?.user || hr;
  return new s(
    r,
    e,
    t
  );
}, fr = (r, e) => async (t) => {
  if (r.createNewSession === void 0)
    throw new Error("Should never come here");
  const s = t.userContext._default.request.request, n = await r.createNewSession(
    t
  ), o = n.getUserId();
  if ((await R(
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
}, Er = (r, e) => async (t) => {
  if (r.verifySession === void 0)
    throw new Error("Should never come here");
  const s = await r.verifySession(t);
  if (s) {
    const n = s.getUserId(), o = t.userContext._default.request.request;
    if ((await R(
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
}, Sr = (r) => {
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
          verifySession: Er(s),
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
          createNewSession: fr(s),
          ...n
        };
      },
      openIdFeature: t.override?.openIdFeature
    }
  };
}, Rr = (r) => {
  const e = r.config.user.supertokens.recipes?.session;
  return typeof e == "function" ? N.init(e(r)) : N.init(Sr(r));
}, vr = (r, e) => async (t) => {
  if (r.appleRedirectHandlerPOST === void 0)
    throw new Error("Should never come here");
  const s = t.formPostInfoFromProvider.state, n = JSON.parse(
    Buffer.from(s, "base64").toString("ascii")
  );
  if (n.isAndroid && n.appId) {
    const i = `intent://callback?${`code=${t.formPostInfoFromProvider.code}&state=${t.formPostInfoFromProvider.state}`}#Intent;package=${n.appId};scheme=signinwithapple;end`;
    t.options.res.original.redirect(i);
  } else
    r.appleRedirectHandlerPOST(t);
}, Ir = (r, e) => {
  const { config: t, log: s, slonik: n } = e;
  return async (o) => {
    const i = await r.emailPasswordSignIn(
      o
    );
    if (i.status !== "OK")
      return i;
    const a = R(t, n), u = await a.findById(i.user.id);
    return u ? (u.lastLoginAt = Date.now(), await a.update(u.id, {
      lastLoginAt: T(new Date(u.lastLoginAt))
    }).catch((d) => {
      s.error(
        `Unable to update lastLoginAt for userId ${i.user.id}`
      ), s.error(d);
    }), {
      status: "OK",
      user: {
        ...i.user,
        ...u
      }
    }) : (s.error(`User record not found for userId ${i.user.id}`), { status: "WRONG_CREDENTIALS_ERROR" });
  };
}, Or = async (r) => {
  const e = await _.createEmailVerificationToken(
    f,
    r
  );
  e.status === "OK" && await _.verifyEmailUsingToken(
    f,
    e.token
  );
}, fe = async (r) => {
  const { roles: e } = await E.getAllRoles();
  return r.every((t) => e.includes(t));
}, Pr = (r, e) => {
  const { config: t, log: s, slonik: n } = e;
  return async (o) => {
    const i = o.userContext.roles || [];
    if (!await fe(i))
      throw s.error(`At least one role from ${i.join(", ")} does not exist.`), {
        name: "SIGN_UP_FAILED",
        message: "Something went wrong",
        statusCode: 500
      };
    const a = await r.emailPasswordSignUp(
      o
    );
    if (a.status === "OK") {
      const u = R(t, n);
      let c;
      try {
        if (c = await u.create({
          id: a.user.id,
          email: a.user.email
        }), !c)
          throw new Error("User not found");
      } catch (d) {
        throw s.error("Error while creating user"), s.error(d), await Q(a.user.id), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      }
      c.roles = i, a.user = {
        ...a.user,
        ...c
      };
      for (const d of i) {
        const g = await E.addRoleToUser(
          f,
          a.user.id,
          d
        );
        g.status !== "OK" && s.error(g.status);
      }
      if (t.user.features?.signUp?.emailVerification)
        try {
          if (o.userContext.autoVerifyEmail)
            await Or(c.id);
          else {
            const d = await _.createEmailVerificationToken(
              f,
              a.user.id
            );
            d.status === "OK" && await _.sendEmail({
              type: "EMAIL_VERIFICATION",
              user: a.user,
              emailVerifyLink: `${t.appOrigin[0]}/auth/verify-email?token=${d.token}&rid=emailverification`,
              tenantId: f,
              userContext: o.userContext
            });
          }
        } catch (d) {
          s.error(d);
        }
    }
    if (t.user.supertokens.sendUserAlreadyExistsWarning && a.status === "EMAIL_ALREADY_EXISTS_ERROR")
      try {
        H({
          fastify: e,
          subject: "Duplicate Email Registration",
          templateData: {
            emailId: o.email
          },
          templateName: "duplicate-email-warning",
          to: o.email
        });
      } catch (u) {
        s.error(u);
      }
    return a;
  };
}, yr = (r, e) => async (t) => {
  if (t.userContext.roles = [e.config.user.role || Y], r.emailPasswordSignUpPOST === void 0)
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
}, k = (r, e) => {
  const t = gr(
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
}, Ur = (r) => [
  {
    id: "email",
    validate: async (e) => {
      const t = k(e, r);
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
], br = (r) => {
  let e = [];
  if (typeof r.user.supertokens?.recipes?.thirdPartyEmailPassword == "object") {
    const s = r.user.supertokens?.recipes?.thirdPartyEmailPassword.signUpFeature?.formFields;
    s && (e = [...s]);
  }
  const t = new Set(e.map((s) => s.id));
  for (const s of Ur(r))
    t.has(s.id) || e.push(s);
  return e;
}, Tr = (r, e) => async (t) => {
  const s = await r.resetPasswordUsingToken(t);
  if (s.status === "OK" && s.userId) {
    const n = await Ne(s.userId);
    n && H({
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
}, Ar = (r, e) => {
  const t = e.config.appOrigin[0];
  return async (s) => {
    const n = s.userContext._default.request.request, o = n.headers.referer || n.headers.origin || n.hostname, i = X(o) || t, a = s.passwordResetLink.replace(
      t + "/auth/reset-password",
      i + (e.config.user.supertokens.resetPasswordPath || He)
    );
    H({
      fastify: e,
      subject: "Reset Password",
      templateName: "reset-password",
      to: s.user.email,
      templateData: {
        passwordResetLink: a
      }
    });
  };
}, Nr = (r, e) => {
  const { config: t, log: s } = e;
  return async (n) => {
    const o = n.userContext.roles || [];
    if (!await _e(
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
    const a = await r.thirdPartySignInUp(
      n
    );
    if (a.status === "OK" && a.createdNewUser) {
      if (!await fe(o))
        throw await Q(a.user.id), s.error(`At least one role from ${o.join(", ")} does not exist.`), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      for (const u of o) {
        const c = await E.addRoleToUser(
          f,
          a.user.id,
          u
        );
        c.status !== "OK" && s.error(c.status);
      }
    }
    return a;
  };
}, _r = (r, e) => {
  const { config: t, log: s, slonik: n } = e;
  return async (o) => {
    if (o.userContext.roles = [t.user.role || Y], r.thirdPartySignInUpPOST === void 0)
      throw new Error("Should never come here");
    const i = await r.thirdPartySignInUpPOST(o);
    if (i.status === "OK") {
      const a = R(t, n);
      let u;
      if (i.createdNewUser)
        try {
          if (u = await a.create({
            id: i.user.id,
            email: i.user.email
          }), !u)
            throw new Error("User not found");
          u.roles = o.userContext.roles;
        } catch (c) {
          throw s.error("Error while creating user"), s.error(c), await Q(i.user.id), {
            name: "SIGN_UP_FAILED",
            message: "Something went wrong",
            statusCode: 500
          };
        }
      else {
        if (u = await a.findById(i.user.id), !u)
          return s.error(
            `User record not found for userId ${i.user.id}`
          ), {
            status: "GENERAL_ERROR",
            message: "Something went wrong"
          };
        u.lastLoginAt = Date.now(), await a.update(u.id, {
          lastLoginAt: T(new Date(u.lastLoginAt))
        }).catch((c) => {
          s.error(
            `Unable to update lastLoginAt for userId ${i.user.id}`
          ), s.error(c);
        });
      }
      return {
        ...i,
        user: {
          ...i.user,
          ...u
        }
      };
    }
    return i;
  };
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
          emailPasswordSignUpPOST: yr(
            s,
            r
          ),
          thirdPartySignInUpPOST: _r(
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
          emailPasswordSignIn: Ir(
            s,
            r
          ),
          emailPasswordSignUp: Pr(
            s,
            r
          ),
          resetPasswordUsingToken: Tr(
            s,
            r
          ),
          thirdPartySignInUp: Nr(
            s,
            r
          ),
          ...n
        };
      }
    },
    signUpFeature: {
      formFields: br(e)
    },
    emailDelivery: {
      override: (s) => {
        let n;
        return t?.sendEmail && (n = t.sendEmail), {
          ...s,
          sendEmail: n ? n(s, r) : Ar(s, r)
        };
      }
    },
    providers: e.user.supertokens.providers
  };
}, Cr = (r) => {
  const e = r.config.user.supertokens.recipes?.thirdPartyEmailPassword;
  return typeof e == "function" ? M.init(e(r)) : M.init(
    kr(r)
  );
}, Lr = () => ({}), $r = (r) => {
  const e = r.config.user.supertokens.recipes;
  return e && e.userRoles ? E.init(e.userRoles(r)) : E.init(Lr());
}, Fr = (r) => {
  const e = [
    Rr(r),
    Cr(r),
    $r(r)
  ];
  return r.config.user.features?.signUp?.emailVerification && e.push(dr(r)), e;
}, Dr = (r) => {
  const { config: e } = r;
  ie.init({
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
  n.info("Registering supertokens plugin"), Dr(r), r.setErrorHandler(Pe()), await r.register(Ie, {
    origin: s.appOrigin,
    allowedHeaders: [
      "Content-Type",
      "st-auth-mode",
      ...ie.getAllCORSHeaders()
    ],
    credentials: !0
  }), await r.register(Oe), await r.register(ye), n.info("Registering supertokens plugin complete"), r.decorate("verifySession", be), t();
}, Vr = B(Wr), Mr = async (r, e, t) => {
  const { config: s, slonik: n, dbSchema: o } = e;
  let i;
  try {
    const a = await N.getSession(e, Ue(t), {
      sessionRequired: !1,
      overrideGlobalClaimValidators: async (u) => u.filter(
        (c) => c.id !== ve.key
      )
    });
    i = a === void 0 ? void 0 : a.getUserId();
  } catch (a) {
    throw N.Error.isErrorFromSuperTokens(a) ? new l.ErrorWithProps(
      "Session related error",
      {
        code: "UNAUTHENTICATED",
        http: {
          status: a.type === N.Error.INVALID_CLAIMS ? 403 : 401
        }
      },
      a.type === N.Error.INVALID_CLAIMS ? 403 : 401
    ) : a;
  }
  if (i && !r.user) {
    const a = R(s, n, o);
    let u = null;
    try {
      u = await a.findById(i);
    } catch {
    }
    if (!u)
      throw new Error("Unable to find user");
    const { roles: c } = await E.getRolesForUser(f, i);
    r.user = u, r.roles = c;
  }
}, Br = B(
  async (r, e, t) => {
    const { mercurius: s } = r.config;
    await r.register(Vr), r.decorate("hasPermission", ar), s.enabled && await r.register(ir), t();
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
]), Ee = (r) => {
  for (const e of Object.keys(r))
    Hr.has(z.camelize(e)) && delete r[e];
}, Kr = {
  adminSignUp: async (r, e, t) => {
    const { app: s, config: n, reply: o } = t;
    try {
      const { email: i, password: a } = e.data, u = await E.getUsersThatHaveRole(
        f,
        y
      );
      let c;
      if (u.status === "UNKNOWN_ROLE_ERROR" ? c = u.status : u.users.length > 0 && (c = "First admin user already exists"), c)
        return new l.ErrorWithProps(c);
      const d = k(i, n);
      if (!d.success && d.message)
        return new l.ErrorWithProps(
          d.message
        );
      const g = F(a, n);
      if (!g.success && g.message)
        return new l.ErrorWithProps(
          g.message
        );
      const m = await x(
        f,
        i,
        a,
        {
          autoVerifyEmail: !0,
          roles: [y],
          _default: {
            request: {
              request: o.request
            }
          }
        }
      );
      return m.status !== "OK" ? new l.ErrorWithProps(
        m.status
      ) : (await J(
        o.request,
        o,
        f,
        m.user.id
      ), {
        ...m,
        user: {
          ...m.user,
          roles: [y]
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
    return await R(
      t.config,
      t.database,
      t.dbSchema
    ).update(s, { disabled: !0 }) ? { status: "OK" } : new l.ErrorWithProps(`user id ${s} not found`, {}, 404);
  },
  enableUser: async (r, e, t) => {
    const { id: s } = e;
    return await R(
      t.config,
      t.database,
      t.dbSchema
    ).update(s, { disabled: !1 }) ? { status: "OK" } : new l.ErrorWithProps(`user id ${s} not found`, {}, 404);
  },
  changePassword: async (r, e, t) => {
    const s = R(
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
    const { data: s } = e, n = R(
      t.config,
      t.database,
      t.dbSchema
    );
    try {
      return t.user?.id ? (Ee(s), await n.update(t.user.id, s)) : {
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
      const n = await E.getUsersThatHaveRole(
        f,
        y
      );
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
    const s = R(
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
  user: async (r, e, t) => await R(
    t.config,
    t.database,
    t.dbSchema
  ).findById(e.id),
  users: async (r, e, t) => await R(
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
    const { email: o, password: i } = t, a = await E.getUsersThatHaveRole(
      f,
      y
    );
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
    const u = k(o, s);
    if (!u.success)
      return e.send({
        status: "ERROR",
        message: u.message
      });
    const c = F(i, s);
    if (!c.success)
      return e.send({
        status: "ERROR",
        message: c.message
      });
    const d = await x(
      f,
      o,
      i,
      {
        autoVerifyEmail: !0,
        roles: [y],
        _default: {
          request: {
            request: r
          }
        }
      }
    );
    if (d.status !== "OK")
      return e.send(d);
    await J(r, e, f, d.user.id), e.send({
      ...d,
      user: {
        ...d.user,
        roles: [y]
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
    const s = await E.getUsersThatHaveRole(
      f,
      y
    );
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
    const o = s.oldPassword ?? "", i = s.newPassword ?? "", u = await R(
      r.config,
      r.slonik,
      r.dbSchema
    ).changePassword(n, o, i);
    e.send(u);
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
    })) : await R(
      r.config,
      r.slonik,
      r.dbSchema
    ).update(t, { disabled: !0 }) ? await e.send({ status: "OK" }) : (e.status(404), await e.send({ message: `user id ${t} not found` }));
  } else
    throw r.log.error("could not get session"), new Error("Oops, Something went wrong");
}, Qr = async (r, e) => {
  if (r.session) {
    const { id: t } = r.params;
    return await R(
      r.config,
      r.slonik,
      r.dbSchema
    ).update(t, { disabled: !1 }) ? await e.send({ status: "OK" }) : (e.status(404), await e.send({ message: `user id ${t} not found` }));
  } else
    throw r.log.error("could not get session"), new Error("Oops, Something went wrong");
}, zr = async (r, e) => {
  const t = R(
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
    const n = R(
      r.config,
      r.slonik,
      r.dbSchema
    );
    Ee(s), e.send(await n.update(t, s));
  } else
    throw r.log.error("could not get user id from session"), new Error("Oops, Something went wrong");
}, Xr = async (r, e) => {
  const t = R(
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
}, b = {
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
    je,
    {
      preHandler: [
        r.verifySession(),
        r.hasPermission(tr)
      ]
    },
    s?.users || b.users
  ), r.post(
    qe,
    {
      preHandler: r.verifySession()
    },
    s?.changePassword || b.changePassword
  ), r.get(
    se,
    {
      preHandler: r.verifySession()
    },
    s?.me || b.me
  ), r.put(
    se,
    {
      preHandler: r.verifySession()
    },
    s?.updateMe || b.updateMe
  ), r.put(
    Je,
    {
      preHandler: [
        r.verifySession(),
        r.hasPermission(rr)
      ]
    },
    s?.disable || b.disable
  ), r.put(
    xe,
    {
      preHandler: [
        r.verifySession(),
        r.hasPermission(sr)
      ]
    },
    s?.enable || b.enable
  ), r.post(
    re,
    s?.adminSignUp || b.adminSignUp
  ), r.get(
    re,
    s?.canAdminSignUp || b.canAdminSignUp
  ), t();
}, Se = (r, e) => e || T(
  new Date(
    Date.now() + (r.user.invitation?.expireAfterInDays ?? Le) * (24 * 60 * 60 * 1e3)
  )
);
class Zr extends ae {
  /* eslint-enabled */
  getFindByTokenSql = (e) => w.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE token = ${e};
    `;
  getListSql = (e, t, s, n) => {
    const o = ce(this.table, this.schema), i = Te(
      this.config.user.table?.name || pe,
      this.schema
    );
    return w.type(this.validationSchema)`
      SELECT ${this.getTableFragment()}.*, ROW_TO_JSON("user") as "invited_by"
      FROM ${this.getTableFragment()}
      join ${i} "user" on ${this.getTableFragment()}."invited_by_id" = "user"."id"
      ${ue(s, o)}
      ${Ae(o, this.getSortInput(n))}
      ${de(e, t)};
    `;
  };
}
class es extends le {
  static TABLE = Be;
  create = async (e) => {
    const t = {
      AND: [
        { key: "email", operator: "eq", value: e.email },
        { key: "acceptedAt", operator: "eq", value: "null" },
        { key: "expiresAt", operator: "gt", value: T(/* @__PURE__ */ new Date()) },
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
}, q = (r) => !(r.acceptedAt || r.revokedAt || Date.now() > r.expiresAt), rs = (r, e, t) => {
  const { token: s } = e;
  let n = r.user.invitation?.acceptLinkPath || Ce;
  return n = n.replace(/:token(?!\w)/g, s), new URL(n, t).href;
}, j = async (r, e, t) => {
  const { config: s, log: n } = r, o = s.apps?.find((i) => i.id === e.appId)?.origin || X(t || "") || s.appOrigin[0];
  o ? H({
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
    const { app: s, config: n, database: o, dbSchema: i, reply: a } = t, { token: u, data: c } = e;
    try {
      const { email: d, password: g } = c, m = k(d, n);
      if (!m.success && m.message)
        return new l.ErrorWithProps(
          m.message
        );
      const p = F(g, n);
      if (!p.success && p.message)
        return new l.ErrorWithProps(
          p.message
        );
      const S = O(n, o, i), h = await S.findByToken(u);
      if (!h || !q(h))
        return new l.ErrorWithProps(
          "Invitation is invalid or has expired"
        );
      if (h.email != d)
        return new l.ErrorWithProps(
          "Email do not match with the invitation"
        );
      const I = await x(
        f,
        d,
        g,
        {
          roles: [h.role],
          autoVerifyEmail: !0
        }
      );
      if (I.status !== "OK")
        return I;
      await S.update(h.id, {
        acceptedAt: T(new Date(Date.now()))
      });
      try {
        await n.user.invitation?.postAccept?.(
          a.request,
          h,
          I.user
        );
      } catch (P) {
        s.log.error(P);
      }
      return await J(
        a.request,
        a,
        f,
        I.user.id
      ), {
        ...I,
        user: {
          ...I.user,
          roles: [h.role]
        }
      };
    } catch (d) {
      s.log.error(d);
      const g = new l.ErrorWithProps(
        "Oops! Something went wrong"
      );
      return g.statusCode = 500, g;
    }
  },
  createInvitation: async (r, e, t) => {
    const { app: s, config: n, database: o, dbSchema: i, reply: a, user: u } = t;
    try {
      if (!u)
        throw new Error("User not found in session");
      const { appId: c, email: d, expiresAt: g, payload: m, role: p } = e.data, S = k(d, n);
      if (!S.success && S.message)
        return new l.ErrorWithProps(S.message);
      const h = O(n, o, i), I = {
        key: "email",
        operator: "eq",
        value: d
      };
      if (await h.count(I) > 0)
        return new l.ErrorWithProps(
          `User with email ${d} already exists`
        );
      const U = {
        email: d,
        expiresAt: Se(n, g),
        invitedById: u.id,
        role: p || n.user.role || y
      }, D = n.apps?.find((v) => v.id == c);
      if (D)
        if (D.supportedRoles.includes(U.role))
          U.appId = c;
        else
          return new l.ErrorWithProps(
            `App ${D.name} does not support role ${U.role}`
          );
      Object.keys(m || {}).length > 0 && (U.payload = JSON.stringify(m));
      let W;
      try {
        W = await h.create(U);
      } catch (v) {
        return new l.ErrorWithProps(v.message);
      }
      if (W) {
        try {
          const { headers: v, hostname: C } = a.request, L = v.referer || v.origin || C;
          j(s, W, L);
        } catch (v) {
          s.log.error(v);
        }
        return W;
      }
    } catch (c) {
      s.log.error(c);
      const d = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return d.statusCode = 500, d;
    }
  },
  resendInvitation: async (r, e, t) => {
    const { app: s, config: n, database: o, dbSchema: i, reply: a } = t, c = await O(n, o, i).findById(e.id);
    if (!c || !q(c))
      return new l.ErrorWithProps(
        "Invitation is invalid or has expired"
      );
    const { headers: d, hostname: g } = a.request, m = d.referer || d.origin || g;
    try {
      j(s, c, m);
    } catch (p) {
      s.log.error(p);
    }
    return c;
  },
  revokeInvitation: async (r, e, t) => {
    const s = O(
      t.config,
      t.database,
      t.dbSchema
    );
    let n = await s.findById(e.id), o;
    return n ? n.acceptedAt ? o = "Invitation is already accepted" : Date.now() > n.expiresAt ? o = "Invitation is expired" : n.revokedAt && (o = "Invitation is already revoked") : o = "Invitation not found", o ? new l.ErrorWithProps(o) : (n = await s.update(e.id, {
      revokedAt: T(new Date(Date.now()))
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
  const { body: t, config: s, dbSchema: n, log: o, params: i, slonik: a } = r, { token: u } = i;
  try {
    const { email: c, password: d } = t, g = k(c, s);
    if (!g.success)
      return e.send({
        status: "ERROR",
        message: g.message
      });
    const m = F(d, s);
    if (!m.success)
      return e.send({
        status: "ERROR",
        message: m.message
      });
    const p = O(s, a, n), S = await p.findByToken(u);
    if (!S || !q(S))
      return e.send({
        status: "ERROR",
        message: "Invitation is invalid or has expired"
      });
    if (S.email != c)
      return e.send({
        status: "ERROR",
        message: "Email do not match with the invitation"
      });
    const h = await x(
      f,
      c,
      d,
      {
        roles: [S.role],
        autoVerifyEmail: !0
      }
    );
    if (h.status !== "OK")
      return e.send(h);
    await p.update(S.id, {
      acceptedAt: T(new Date(Date.now()))
    });
    try {
      await s.user.invitation?.postAccept?.(
        r,
        S,
        h.user
      );
    } catch (I) {
      o.error(I);
    }
    await J(r, e, f, h.user.id), e.send({
      ...h,
      user: {
        ...h.user,
        roles: [S.role]
      }
    });
  } catch (c) {
    o.error(c), e.status(500), e.send({
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
    server: u,
    session: c,
    slonik: d
  } = r;
  try {
    const g = c && c.getUserId();
    if (!g)
      throw new Error("User not found in session");
    const { appId: m, email: p, expiresAt: S, payload: h, role: I } = t, P = k(p, s);
    if (!P.success)
      return e.send({
        status: "ERROR",
        message: P.message
      });
    const U = O(s, d, n), D = {
      key: "email",
      operator: "eq",
      value: p
    };
    if (await U.count(D) > 0)
      return e.send({
        status: "ERROR",
        message: `User with email ${p} already exists`
      });
    const v = {
      email: p,
      expiresAt: Se(s, S),
      invitedById: g,
      role: I || s.user.role || Y
    }, C = s.apps?.find((V) => V.id == m);
    if (C)
      if (C.supportedRoles.includes(v.role))
        v.appId = m;
      else
        return e.send({
          status: "ERROR",
          message: `App ${C.name} does not support role ${v.role}`
        });
    Object.keys(h || {}).length > 0 && (v.payload = JSON.stringify(h));
    let L;
    try {
      L = await U.create(v);
    } catch (V) {
      return e.send({
        status: "ERROR",
        message: V.message
      });
    }
    if (L) {
      const V = o.referer || o.origin || i;
      try {
        j(u, L, V);
      } catch (Re) {
        a.error(Re);
      }
      const Z = L;
      delete Z.token, e.send(Z);
    }
  } catch (g) {
    a.error(g), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, is = async (r, e) => {
  const { config: t, dbSchema: s, log: n, params: o, slonik: i } = r, { token: a } = o;
  try {
    const c = await O(t, i, s).findByToken(a);
    e.send(c);
  } catch (u) {
    n.error(u), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, as = async (r, e) => {
  const { config: t, dbSchema: s, log: n, query: o, slonik: i } = r;
  try {
    const { limit: a, offset: u, filters: c, sort: d } = o, m = await O(t, i, s).list(
      a,
      u,
      c ? JSON.parse(c) : void 0,
      d ? JSON.parse(d) : void 0
    );
    for (const p of m.data)
      delete p.token;
    e.send(m);
  } catch (a) {
    n.error(a), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, cs = async (r, e) => {
  const { config: t, dbSchema: s, headers: n, hostname: o, log: i, params: a, slonik: u, server: c } = r;
  try {
    const { id: d } = a, m = await O(t, u, s).findById(d);
    if (!m || !q(m))
      return e.send({
        status: "ERROR",
        message: "Invitation is invalid or has expired"
      });
    const p = n.referer || n.origin || o;
    try {
      j(c, m, p);
    } catch (h) {
      i.error(h);
    }
    const S = m;
    delete S.token, e.send(S);
  } catch (d) {
    i.error(d), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, us = async (r, e) => {
  const { config: t, dbSchema: s, log: n, params: o, slonik: i } = r;
  try {
    const { id: a } = o, u = O(t, i, s);
    let c = await u.findById(a);
    if (c) {
      if (c.acceptedAt)
        return e.send({
          status: "error",
          message: "Invitation is already accepted"
        });
      if (Date.now() > c.expiresAt)
        return e.send({
          status: "error",
          message: "Invitation is expired"
        });
      if (c.revokedAt)
        return e.send({
          status: "error",
          message: "Invitation is already revoked"
        });
    } else
      return e.send({
        status: "error",
        message: "Invitation not found"
      });
    c = await u.update(a, {
      revokedAt: T(new Date(Date.now()))
    });
    const d = c;
    delete d.token, e.send(d);
  } catch (a) {
    n.error(a), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, $ = {
  acceptInvitation: ns,
  createInvitation: os,
  getInvitationByToken: is,
  listInvitation: as,
  resendInvitation: cs,
  revokeInvitation: us
}, Bs = async (r, e, t) => {
  const s = r.config.user.handlers?.invitation;
  r.get(
    $e,
    {
      preHandler: [
        r.verifySession(),
        r.hasPermission(Xe)
      ]
    },
    s?.list || $.listInvitation
  ), r.post(
    De,
    {
      preHandler: [
        r.verifySession(),
        r.hasPermission(Ye)
      ]
    },
    s?.create || $.createInvitation
  ), r.get(
    We,
    s?.getByToken || $.getInvitationByToken
  ), r.post(
    Fe,
    s?.accept || $.acceptInvitation
  ), r.put(
    Me,
    {
      preHandler: [
        r.verifySession(),
        r.hasPermission(er)
      ]
    },
    s?.revoke || $.revokeInvitation
  ), r.post(
    Ve,
    {
      preHandler: [
        r.verifySession(),
        r.hasPermission(Ze)
      ]
    },
    s?.resend || $.resendInvitation
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
    Ge,
    {
      preHandler: [r.verifySession()]
    },
    ms.getPermissions
  ), t();
};
class A {
  createRole = async (e) => {
    await E.createNewRoleOrAddPermissions(e, []);
  };
  getPermissionsForRole = async (e) => {
    let t = [];
    const s = await E.getPermissionsForRole(e);
    return s.status === "OK" && (t = s.permissions), t;
  };
  getRoles = async () => {
    let e = [];
    const t = await E.getAllRoles();
    return t.status === "OK" && (e = t.roles), e;
  };
  updateRolePermissions = async (e, t) => {
    const s = await E.getPermissionsForRole(e);
    if (s.status === "UNKNOWN_ROLE_ERROR")
      throw new Error("UNKNOWN_ROLE_ERROR");
    const n = s.permissions, o = t.filter(
      (a) => !n.includes(a)
    ), i = n.filter(
      (a) => !t.includes(a)
    );
    return await E.removePermissionsFromRole(e, i), await E.createNewRoleOrAddPermissions(e, o), this.getPermissionsForRole(e);
  };
}
const gs = {
  createRole: async (r, e, t) => {
    const { app: s } = t;
    try {
      return await new A().createRole(e.role), e.role;
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
      return await new A().updateRolePermissions(
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
}, ps = {
  roles: async (r, e, t) => {
    const { app: s } = t;
    try {
      return await new A().getRoles();
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
      return n && (o = await new A().getPermissionsForRole(n)), o;
    } catch (i) {
      s.log.error(i);
      const a = new l.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return a.statusCode = 500, a;
    }
  }
}, qs = { Mutation: gs, Query: ps }, ws = async (r, e) => {
  const { body: t, log: s } = r, { role: n } = t;
  try {
    return await new A().createRole(n), e.send({ role: n });
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
    return o && (n = await new A().getPermissionsForRole(o)), e.send({ permissions: n });
  } catch (o) {
    return t.error(o), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, fs = async (r, e) => {
  const { log: t } = r;
  try {
    const n = await new A().getRoles();
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
    const { role: n, permissions: o } = s, a = await new A().updateRolePermissions(
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
}, K = {
  createRole: ws,
  getRoles: fs,
  getPermissions: hs,
  updatePermissions: Es
}, js = async (r, e, t) => {
  r.get(
    te,
    {
      preHandler: [r.verifySession()]
    },
    K.getRoles
  ), r.get(
    ne,
    {
      preHandler: [r.verifySession()]
    },
    K.getPermissions
  ), r.post(
    te,
    {
      preHandler: [r.verifySession()]
    },
    K.createRole
  ), r.put(
    ne,
    {
      preHandler: [r.verifySession()]
    },
    K.updatePermissions
  ), t();
}, Js = async (r) => {
  const { roles: e } = await E.getAllRoles();
  return e.includes(r);
};
export {
  Qe as EMAIL_VERIFICATION_MODE,
  ze as EMAIL_VERIFICATION_PATH,
  Ce as INVITATION_ACCEPT_LINK_PATH,
  Le as INVITATION_EXPIRE_AFTER_IN_DAYS,
  es as InvitationService,
  Zr as InvitationSqlFactory,
  Ye as PERMISSIONS_INVITATIONS_CREATE,
  Xe as PERMISSIONS_INVITATIONS_LIST,
  Ze as PERMISSIONS_INVITATIONS_RESEND,
  er as PERMISSIONS_INVITATIONS_REVOKE,
  rr as PERMISSIONS_USERS_DISABLE,
  sr as PERMISSIONS_USERS_ENABLE,
  tr as PERMISSIONS_USERS_LIST,
  He as RESET_PASSWORD_PATH,
  y as ROLE_ADMIN,
  Ke as ROLE_SUPER_ADMIN,
  Y as ROLE_USER,
  qe as ROUTE_CHANGE_PASSWORD,
  $e as ROUTE_INVITATIONS,
  Fe as ROUTE_INVITATIONS_ACCEPT,
  De as ROUTE_INVITATIONS_CREATE,
  We as ROUTE_INVITATIONS_GET_BY_TOKEN,
  Ve as ROUTE_INVITATIONS_RESEND,
  Me as ROUTE_INVITATIONS_REVOKE,
  se as ROUTE_ME,
  Ge as ROUTE_PERMISSIONS,
  te as ROUTE_ROLES,
  ne as ROUTE_ROLES_PERMISSIONS,
  re as ROUTE_SIGNUP_ADMIN,
  je as ROUTE_USERS,
  Je as ROUTE_USERS_DISABLE,
  xe as ROUTE_USERS_ENABLE,
  A as RoleService,
  Be as TABLE_INVITATIONS,
  pe as TABLE_USERS,
  f as TENANT_ID,
  hr as UserService,
  mr as UserSqlFactory,
  fe as areRolesExist,
  Se as computeInvitationExpiresAt,
  Br as default,
  Qs as formatDate,
  O as getInvitationService,
  X as getOrigin,
  R as getUserService,
  we as hasUserPermission,
  Ms as invitationResolver,
  Bs as invitationRoutes,
  q as isInvitationValid,
  Js as isRoleExists,
  Hs as permissionResolver,
  Ks as permissionRoutes,
  qs as roleResolver,
  js as roleRoutes,
  H as sendEmail,
  j as sendInvitation,
  Ws as userResolver,
  Vs as userRoutes,
  k as validateEmail,
  F as validatePassword,
  Or as verifyEmail
};

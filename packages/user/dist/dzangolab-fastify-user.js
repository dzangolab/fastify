import x from "fastify-plugin";
import p from "mercurius";
import le from "mercurius-auth";
import T, { EmailVerificationClaim as be } from "supertokens-node/recipe/emailverification";
import B, { Error as se, createNewSession as D } from "supertokens-node/recipe/session";
import { FastifyRequest as _e } from "supertokens-node/lib/build/framework/fastify/framework";
import pe, { getRequestFromUserContext as te, deleteUser as re } from "supertokens-node";
import { SessionClaim as Ne } from "supertokens-node/lib/build/recipe/session/claims";
import g from "supertokens-node/recipe/userroles";
import Te from "@fastify/cors";
import Ce from "@fastify/formbody";
import { errorHandler as ke, plugin as Fe, wrapResponse as Le } from "supertokens-node/framework/fastify";
import { verifySession as Ve } from "supertokens-node/recipe/session/framework/fastify";
import { DefaultSqlFactory as me, createTableIdentifier as ge, createFilterFragment as he, createLimitFragment as fe, BaseService as we, formatDate as b, createTableFragment as $e, createSortFragment as De } from "@dzangolab/fastify-slonik";
import { formatDate as Rt } from "@dzangolab/fastify-slonik";
import $, { getUserById as We, getUserByThirdPartyInfo as Ke, emailPasswordSignUp as Y } from "supertokens-node/recipe/thirdpartyemailpassword";
import ne from "humps";
import { sql as f } from "slonik";
import Se from "validator";
import { z as Re } from "zod";
import { gql as oe, mergeTypeDefs as Me, baseSchema as He } from "@dzangolab/fastify-graphql";
const q = (s, e) => (s === void 0 && (s = {}), s._default === void 0 && (s._default = {}), typeof s._default == "object" && (s._default.request = new _e(
  e
)), s);
class P extends Ne {
  static defaultMaxAgeInSeconds = void 0;
  static key = "profileValidation";
  constructor() {
    super("profileValidation");
  }
  addToPayload_internal(e, t, r) {
    return {
      ...e,
      [this.key]: {
        v: t,
        t: Date.now()
      }
    };
  }
  fetchValue = async (e, t) => {
    const r = te(t)?.original;
    if (!r)
      throw new Error("Request not set in userContext");
    const n = r.config.user?.features?.profileValidation;
    if (!n?.enabled)
      throw new Error("Profile validation is not enabled");
    const o = r?.user;
    if (!o)
      throw new Error("User not found");
    const a = !(n.fields || []).some((u) => o[u] === null);
    return {
      gracePeriodEndsAt: !a && n.gracePeriodInDays ? o.signedUpAt + n.gracePeriodInDays * (24 * 60 * 60 * 1e3) : void 0,
      isVerified: a
    };
  };
  getLastRefetchTime(e, t) {
    return e[this.key]?.t;
  }
  getValueFromPayload(e, t) {
    return e[this.key]?.v;
  }
  removeFromPayload(e, t) {
    const r = {
      ...e
    };
    return delete r[this.key], r;
  }
  removeFromPayloadByMerge_internal(e, t) {
    return {
      ...e,
      [this.key]: null
    };
  }
  validators = {
    isVerified: (e = P.defaultMaxAgeInSeconds, t) => ({
      claim: this,
      id: t ?? this.key,
      shouldRefetch: () => !0,
      validate: async (r, n) => {
        const i = this.getValueFromPayload(r, n);
        return i === void 0 ? {
          isValid: !1,
          reason: {
            message: "value does not exist",
            expectedValue: !0,
            actualValue: void 0
          }
        } : i.isVerified !== !0 && (!i.gracePeriodEndsAt || i.gracePeriodEndsAt <= Date.now()) ? {
          isValid: !1,
          reason: {
            message: "User profile is incomplete",
            expectedValue: !0,
            actualValue: i.isVerified
          }
        } : { isValid: !0 };
      }
    })
  };
}
const Be = x(async (s) => {
  await s.register(le, {
    async applyPolicy(e, t, r, n) {
      if (!n.user)
        return new p.ErrorWithProps("unauthorized", {}, 401);
      if (n.user.disabled)
        return new p.ErrorWithProps("user is disabled", {}, 401);
      if (s.config.user.features?.signUp?.emailVerification && !await T.isEmailVerified(n.user.id))
        return new p.ErrorWithProps(
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
        );
      if (s.config.user.features?.profileValidation?.enabled && e.arguments.find(
        (i) => i?.name?.value === "profileValidation"
      )?.value?.value != !1) {
        const i = n.reply.request, a = new P(), c = q(
          void 0,
          n.reply.request
        );
        await i.session?.fetchAndSetClaim(
          a,
          c
        );
        try {
          await i.session?.assertClaims(
            [a.validators.isVerified()],
            c
          );
        } catch (u) {
          if (u instanceof se)
            return new p.ErrorWithProps(
              "invalid claim",
              {
                claimValidationErrors: u.payload
              },
              403
            );
          throw u;
        }
      }
      return !0;
    },
    authDirective: "auth"
  });
}), xe = "/signup/token/:token", qe = 30, Je = "/invitations", je = "/invitations/token/:token", Ge = "/invitations", Qe = "/invitations/:id(^\\d+)", Ye = "/invitations/token/:token", ze = "/invitations/resend/:id(^\\d+)", Xe = "/invitations/revoke/:id(^\\d+)", Ze = "invitations", es = "/reset-password", W = "ADMIN", C = "SUPERADMIN", z = "USER", ss = "/change_password", ce = "/signup/admin", ue = "/me", rs = "/users", ts = "/users/:id", ns = "/users/:id/disable", os = "/users/:id/enable", Ee = "users", Z = "/roles", de = "/roles/permissions", is = "/permissions", as = "REQUIRED", cs = "/verify-email", us = "invitations:create", ds = "invitations:delete", ls = "invitations:list", ps = "invitations:resend", ms = "invitations:revoke", gs = "users:disable", hs = "users:enable", fs = "users:list", ws = "users:read", Ss = async (s) => {
  let e = [];
  for (const t of s) {
    const r = await g.getPermissionsForRole(t);
    r.status === "OK" && (e = [.../* @__PURE__ */ new Set([...e, ...r.permissions])]);
  }
  return e;
}, ve = async (s, e, t) => {
  const r = s.config.user.permissions;
  if (!r || !r.includes(t))
    return !0;
  const { roles: n } = await g.getRolesForUser(e);
  if (n && n.includes(C))
    return !0;
  const o = await Ss(n);
  return !(!o || !o.includes(t));
}, Rs = x(async (s) => {
  await s.register(le, {
    applyPolicy: async (e, t, r, n) => {
      const o = e.arguments.find(
        (a) => a.name.value === "permission"
      ).value.value;
      return n.user ? await ve(
        n.app,
        n.user?.id,
        o
      ) ? !0 : new p.ErrorWithProps(
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
      ) : new p.ErrorWithProps("unauthorized", {}, 401);
    },
    authDirective: "hasPermission"
  });
}), Es = x(async (s) => {
  s.config.graphql?.enabled && (await s.register(Rs), await s.register(Be));
}), vs = (s) => async (e) => {
  const t = e.session?.getUserId();
  if (!t)
    throw new se({
      type: "UNAUTHORISED",
      message: "unauthorised"
    });
  if (!await ve(e.server, t, s))
    throw new se({
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
}, ie = (s) => {
  let e;
  try {
    if (e = new URL(s).origin, !e || e === "null")
      throw new Error("Origin is empty");
  } catch {
    e = "";
  }
  return e;
}, J = async ({
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
}, Is = (s, e) => {
  const t = e.config.appOrigin[0];
  return async (r) => {
    let n;
    try {
      const i = r.userContext._default.request.request, a = i.headers.referer || i.headers.origin || i.hostname;
      n = ie(a) || t;
    } catch {
      n = t;
    }
    const o = r.emailVerifyLink.replace(
      t + "/auth/verify-email",
      n + (e.config.user.supertokens.emailVerificationPath || cs)
    );
    J({
      fastify: e,
      subject: "Email Verification",
      templateName: "email-verification",
      to: r.user.email,
      templateData: {
        emailVerifyLink: o
      }
    });
  };
}, Os = (s) => {
  const { config: e } = s;
  let t = {};
  return typeof e.user.supertokens.recipes?.emailVerification == "object" && (t = e.user.supertokens.recipes.emailVerification), {
    mode: t?.mode || as,
    emailDelivery: {
      override: (r) => {
        let n;
        return t?.sendEmail && (n = t.sendEmail), {
          ...r,
          sendEmail: n ? n(r, s) : Is(r, s)
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
}, Ps = (s) => {
  const e = s.config.user.supertokens.recipes?.emailVerification;
  return typeof e == "function" ? T.init(e(s)) : T.init(Os(s));
}, ys = (s, e) => {
  if (e && e.length > 0) {
    const t = [];
    for (const r of e) {
      const n = r.direction === "ASC" ? f.fragment`ASC` : f.fragment`DESC`;
      let o;
      r.key === "roles" && (o = f.fragment`user_role.role ->> 0`);
      const i = f.identifier([
        ...s.names,
        ne.decamelize(r.key)
      ]);
      t.push(
        f.fragment`${o ?? i} ${n}`
      );
    }
    return f.fragment`ORDER BY ${f.join(t, f.fragment`,`)}`;
  }
  return f.fragment``;
}, ee = (s, e) => {
  let t = f.fragment`ASC`;
  return Array.isArray(e) || (e = []), e.some((r) => r.key === "roles" && r.direction != "ASC" ? (t = f.fragment`DESC`, !0) : !1), f.fragment`ORDER BY ${s} ${t}`;
};
class Us extends me {
  /* eslint-enabled */
  getFindByIdSql = (e) => f.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(ur.role ${ee(
    f.identifier(["ur", "role"])
  )}) AS role
        FROM "public"."st__user_roles" as ur
        WHERE ur.user_id = users.id
      ) AS user_role ON TRUE
      WHERE id = ${e};
    `;
  getListSql = (e, t, r, n) => {
    const o = ge(this.table, this.schema);
    return f.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(ur.role ${ee(
      f.identifier(["ur", "role"]),
      n
    )}) AS role
        FROM "public"."st__user_roles" as ur
        WHERE ur.user_id = users.id
      ) AS user_role ON TRUE
      ${he(r, o)}
      ${ys(o, this.getSortInput(n))}
      ${fe(e, t)};
    `;
  };
  getUpdateSql = (e, t) => {
    const r = [];
    for (const n in t) {
      const o = t[n];
      r.push(
        f.fragment`${f.identifier([ne.decamelize(n)])} = ${o}`
      );
    }
    return f.type(this.validationSchema)`
      UPDATE ${this.getTableFragment()}
      SET ${f.join(r, f.fragment`, `)}
      WHERE id = ${e}
      RETURNING *, (
        SELECT COALESCE(user_role.role, '[]') AS roles
        FROM ${this.getTableFragment()}
        LEFT JOIN LATERAL (
          SELECT jsonb_agg(ur.role ${ee(
      f.identifier(["ur", "role"])
    )}) AS role
          FROM "public"."st__user_roles" as ur
          WHERE ur.user_id = users.id
        ) AS user_role ON TRUE
        WHERE id = ${e}
      ) as roles;
    `;
  };
}
const As = (s, e) => Re.string({
  required_error: s.required
}).refine((t) => Se.isEmail(t, e || {}), {
  message: s.invalid
}), Ie = {
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
}, bs = (s, e) => {
  const t = {
    ...Ie,
    ...e
  };
  return Re.string({
    required_error: s.required
  }).refine(
    (r) => Se.isStrongPassword(
      r,
      t
    ),
    {
      message: s.weak
    }
  );
}, _s = (s) => {
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
}, K = (s, e) => {
  const t = e.user.password, r = bs(
    {
      required: "Password is required",
      weak: _s({ ...Ie, ...t })
    },
    t
  ).safeParse(s);
  return r.success ? { success: !0 } : {
    message: r.error.issues[0].message,
    success: !1
  };
};
class Ns extends we {
  changePassword = async (e, t, r) => {
    const n = K(r, this.config);
    if (!n.success)
      return {
        status: "FIELD_ERROR",
        message: n.message
      };
    const o = await $.getUserById(e);
    if (t && r)
      if (o)
        if ((await $.emailPasswordSignIn(
          o.email,
          t,
          { dbSchema: this.schema }
        )).status === "OK") {
          if (await $.updateEmailOrPassword({
            userId: e,
            password: r
          }))
            return await B.revokeAllSessionsForUser(e), {
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
  get table() {
    return this.config.user?.table?.name || Ee;
  }
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new Us(this)), this._factory;
  }
}
const R = (s, e, t) => {
  const r = s.user.services?.user || Ns;
  return new r(
    s,
    e,
    t
  );
}, Ts = (s, e) => async (t) => {
  if (s.createNewSession === void 0)
    throw new Error("Should never come here");
  const r = te(t.userContext)?.original;
  if (r) {
    const { config: o, dbSchema: i, slonik: a } = r, u = await R(o, a, i).findById(t.userId) || void 0;
    if (u?.disabled)
      throw {
        name: "SIGN_IN_FAILED",
        message: "user is disabled",
        statusCode: 401
      };
    r.user = u;
  }
  const n = await s.createNewSession(t);
  return r?.user && r?.config.user.features?.profileValidation?.enabled && await n.fetchAndSetClaim(
    new P(),
    t.userContext
  ), n;
}, Cs = (s, e) => async (t) => {
  if (s.getGlobalClaimValidators === void 0)
    throw new Error("Should never come here");
  const r = te(t.userContext)?.original;
  return r && r.config.user.features?.profileValidation?.enabled ? [
    ...t.claimValidatorsAddedByOtherRecipes,
    new P().validators.isVerified()
  ] : t.claimValidatorsAddedByOtherRecipes;
}, ks = (s, e) => async (t) => {
  if (s.getSession === void 0)
    throw new Error("Should never come here");
  const { config: r, dbSchema: n, slonik: o } = t.userContext._default.request.request;
  t.options = {
    checkDatabase: r.user.supertokens.checkSessionInDatabase ?? !0,
    ...t.options
  };
  const i = await s.getSession(t);
  if (i) {
    const a = i.getUserId(), u = await R(r, o, n).findById(a) || void 0;
    t.userContext._default.request.request.user = u;
  }
  return i;
}, Fs = (s, e) => async (t) => {
  if (s.verifySession === void 0)
    throw new Error("Should never come here");
  t.verifySessionOptions = {
    checkDatabase: e.config.user.supertokens.checkSessionInDatabase ?? !0,
    ...t.verifySessionOptions
  };
  const r = await s.verifySession(t);
  if (r && t.userContext._default.request.request.user?.disabled)
    throw await r.revokeSession(), {
      name: "SESSION_VERIFICATION_FAILED",
      message: "user is disabled",
      statusCode: 401
    };
  return r;
}, Ls = (s) => {
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
          verifySession: Fs(r, s),
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
          createNewSession: Ts(r),
          ...n,
          getSession: ks(r),
          getGlobalClaimValidators: Cs(
            r
          )
        };
      },
      openIdFeature: t.override?.openIdFeature
    }
  };
}, Vs = (s) => {
  const e = s.config.user.supertokens.recipes?.session;
  return typeof e == "function" ? B.init(e(s)) : B.init(Ls(s));
}, $s = (s, e) => async (t) => {
  if (s.appleRedirectHandlerPOST === void 0)
    throw new Error("Should never come here");
  const r = t.state, n = JSON.parse(
    Buffer.from(r, "base64").toString("ascii")
  );
  if (n.isAndroid && n.appId) {
    const i = `intent://callback?${`code=${t.code}&state=${t.state}`}#Intent;package=${n.appId};scheme=signinwithapple;end`;
    t.options.res.original.redirect(i);
  } else
    s.appleRedirectHandlerPOST(t);
}, Ds = (s, e) => {
  const { config: t, log: r, slonik: n } = e;
  return async (o) => {
    const i = await s.emailPasswordSignIn(
      o
    );
    if (i.status !== "OK")
      return i;
    const a = R(t, n), c = await a.findById(i.user.id);
    return c ? (c.lastLoginAt = Date.now(), await a.update(c.id, {
      lastLoginAt: b(new Date(c.lastLoginAt))
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
}, Ws = async (s) => {
  const e = await T.createEmailVerificationToken(
    s
  );
  e.status === "OK" && await T.verifyEmailUsingToken(e.token);
}, Oe = async (s) => {
  const { roles: e } = await g.getAllRoles();
  return s.every((t) => e.includes(t));
}, Ks = (s, e) => {
  const { config: t, log: r, slonik: n } = e;
  return async (o) => {
    const i = o.userContext.roles || [];
    if (!await Oe(i))
      throw r.error(`At least one role from ${i.join(", ")} does not exist.`), {
        name: "SIGN_UP_FAILED",
        message: "Something went wrong",
        statusCode: 500
      };
    const a = await s.emailPasswordSignUp(
      o
    );
    if (a.status === "OK") {
      const c = R(t, n);
      let u;
      try {
        if (u = await c.create({
          id: a.user.id,
          email: a.user.email
        }), !u)
          throw new Error("User not found");
      } catch (d) {
        throw r.error("Error while creating user"), r.error(d), await re(a.user.id), {
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
        const l = await g.addRoleToUser(
          a.user.id,
          d
        );
        l.status !== "OK" && r.error(l.status);
      }
      if (t.user.features?.signUp?.emailVerification)
        try {
          if (o.userContext.autoVerifyEmail)
            await Ws(u.id);
          else {
            const d = await T.createEmailVerificationToken(
              a.user.id
            );
            d.status === "OK" && await T.sendEmail({
              type: "EMAIL_VERIFICATION",
              user: a.user,
              emailVerifyLink: `${t.appOrigin[0]}/auth/verify-email?token=${d.token}&rid=emailverification`,
              userContext: o.userContext
            });
          }
        } catch (d) {
          r.error(d);
        }
    }
    if (t.user.supertokens.sendUserAlreadyExistsWarning && a.status === "EMAIL_ALREADY_EXISTS_ERROR")
      try {
        J({
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
}, Ms = (s, e) => async (t) => {
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
}, k = (s, e) => {
  const t = As(
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
}, Hs = (s) => [
  {
    id: "email",
    validate: async (e) => {
      const t = k(e, s);
      if (!t.success)
        return t.message;
    }
  },
  {
    id: "password",
    validate: async (e) => {
      const t = K(e, s);
      if (!t.success)
        return t.message;
    }
  }
], Bs = (s) => {
  let e = [];
  if (typeof s.user.supertokens?.recipes?.thirdPartyEmailPassword == "object") {
    const r = s.user.supertokens?.recipes?.thirdPartyEmailPassword.signUpFeature?.formFields;
    r && (e = [...r]);
  }
  const t = new Set(e.map((r) => r.id));
  for (const r of Hs(s))
    t.has(r.id) || e.push(r);
  return e;
}, xs = (s, e) => async (t) => {
  const r = await s.resetPasswordUsingToken(t);
  if (r.status === "OK" && r.userId) {
    const n = await We(r.userId);
    n && J({
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
}, qs = (s, e) => {
  const t = e.config.appOrigin[0];
  return async (r) => {
    const n = r.userContext._default.request.request;
    let o;
    if (n.query.appId) {
      const u = Number(n.query.appId);
      o = e.config.apps?.find((d) => d.id === u);
    }
    const i = o?.origin || n.headers.referer || n.headers.origin || n.hostname, a = ie(i) || t, c = r.passwordResetLink.replace(
      t + "/auth/reset-password",
      a + (e.config.user.supertokens.resetPasswordPath || es)
    );
    J({
      fastify: e,
      subject: "Reset Password",
      templateName: "reset-password",
      to: r.user.email,
      templateData: {
        passwordResetLink: c
      }
    });
  };
}, Js = (s, e) => {
  const { config: t, log: r, slonik: n } = e;
  return async (o) => {
    const i = o.userContext.roles || [];
    if (!await Ke(
      o.thirdPartyId,
      o.thirdPartyUserId,
      o.userContext
    ) && t.user.features?.signUp?.enabled === !1)
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404
      };
    const c = await s.thirdPartySignInUp(
      o
    ), u = R(
      t,
      n,
      o.userContext._default.request.request.dbSchema
    );
    if (c.createdNewUser) {
      if (!await Oe(i))
        throw await re(c.user.id), r.error(`At least one role from ${i.join(", ")} does not exist.`), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      for (const l of i) {
        const m = await g.addRoleToUser(
          c.user.id,
          l
        );
        m.status !== "OK" && r.error(m.status);
      }
      let d;
      try {
        if (d = await u.create({
          id: c.user.id,
          email: c.user.email
        }), !d)
          throw new Error("User not found");
      } catch (l) {
        throw r.error("Error while creating user"), r.error(l), await re(c.user.id), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      }
    } else
      await u.update(c.user.id, {
        lastLoginAt: b(new Date(Date.now()))
      }).catch((d) => {
        r.error(
          `Unable to update lastLoginAt for userId ${c.user.id}`
        ), r.error(d);
      });
    return c;
  };
}, js = (s, e) => {
  const { config: t, log: r, slonik: n } = e;
  return async (o) => {
    if (o.userContext.roles = [t.user.role || z], s.thirdPartySignInUpPOST === void 0)
      throw new Error("Should never come here");
    const i = await s.thirdPartySignInUpPOST(o);
    if (i.status === "OK") {
      const c = await R(
        t,
        n,
        o.userContext._default.request.request.dbSchema
      ).findById(i.user.id);
      return c ? {
        ...i,
        user: {
          ...i.user,
          ...c
        }
      } : (r.error(
        `User record not found for userId ${i.user.id}`
      ), {
        status: "GENERAL_ERROR",
        message: "Something went wrong"
      });
    }
    return i;
  };
}, Gs = (s) => {
  const { Apple: e, Facebook: t, Github: r, Google: n } = $, o = s.user.supertokens.providers, i = [], a = [
    { name: "google", initProvider: n },
    { name: "github", initProvider: r },
    { name: "facebook", initProvider: t },
    { name: "apple", initProvider: e }
  ];
  for (const u of a)
    if (o?.[u.name])
      if (u.name === "apple") {
        const d = o[u.name];
        if (d)
          for (const l of d)
            i.push(u.initProvider(l));
      } else
        i.push(
          u.initProvider(
            o[u.name]
          )
        );
  const c = o?.custom;
  if (c)
    for (const u of c)
      i.push(u);
  return i;
}, Qs = (s) => {
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
          emailPasswordSignUpPOST: Ms(
            r,
            s
          ),
          thirdPartySignInUpPOST: js(
            r,
            s
          ),
          appleRedirectHandlerPOST: $s(
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
          emailPasswordSignIn: Ds(
            r,
            s
          ),
          emailPasswordSignUp: Ks(
            r,
            s
          ),
          resetPasswordUsingToken: xs(
            r,
            s
          ),
          thirdPartySignInUp: Js(
            r,
            s
          ),
          ...n
        };
      }
    },
    signUpFeature: {
      formFields: Bs(e)
    },
    emailDelivery: {
      override: (r) => {
        let n;
        return t?.sendEmail && (n = t.sendEmail), {
          ...r,
          sendEmail: n ? n(r, s) : qs(r, s)
        };
      }
    },
    providers: Gs(e)
  };
}, Ys = (s) => {
  const e = s.config.user.supertokens.recipes?.thirdPartyEmailPassword;
  return typeof e == "function" ? $.init(e(s)) : $.init(
    Qs(s)
  );
}, zs = () => ({}), Xs = (s) => {
  const e = s.config.user.supertokens.recipes;
  return e && e.userRoles ? g.init(e.userRoles(s)) : g.init(zs());
}, Zs = (s) => {
  const e = [
    Vs(s),
    Ys(s),
    Xs(s)
  ];
  return s.config.user.features?.signUp?.emailVerification && e.push(Ps(s)), e;
}, er = (s) => {
  const { config: e } = s;
  pe.init({
    appInfo: {
      apiDomain: e.baseUrl,
      appName: e.appName,
      websiteDomain: e.appOrigin[0]
    },
    framework: "fastify",
    recipeList: Zs(s),
    supertokens: {
      connectionURI: e.user.supertokens.connectionUri
    }
  });
}, sr = async (s, e, t) => {
  const { config: r, log: n } = s;
  n.info("Registering supertokens plugin"), er(s), s.setErrorHandler(ke()), await s.register(Te, {
    origin: r.appOrigin,
    allowedHeaders: [
      "Content-Type",
      "st-auth-mode",
      ...pe.getAllCORSHeaders()
    ],
    credentials: !0
  }), await s.register(Ce), await s.register(Fe), n.info("Registering supertokens plugin complete"), s.decorate("verifySession", Ve), s.addHook("onSend", async (o, i) => {
    const a = o.server.config.user.supertokens.refreshTokenCookiePath, c = i.getHeader("set-cookie");
    if (c && a) {
      const d = (Array.isArray(c) ? c : [c]).map((l) => String(l).startsWith("sRefreshToken") ? String(l).replace(
        // eslint-disable-next-line unicorn/better-regex
        /Path=\/[^;]*/i,
        `Path=${a}`
      ) : l);
      i.removeHeader("set-cookie"), i.header("set-cookie", d);
    }
  }), t();
}, rr = x(sr), tr = async (s, e, t) => {
  try {
    e.session = await B.getSession(e, Le(t), {
      sessionRequired: !1,
      overrideGlobalClaimValidators: async (r) => r.filter(
        (n) => ![be.key, P.key].includes(
          n.id
        )
      )
    });
  } catch (r) {
    if (!B.Error.isErrorFromSuperTokens(r))
      throw r;
  }
  s.user = e.user, s.roles = e.user?.roles;
}, nr = x(
  async (s, e, t) => {
    const { graphql: r } = s.config;
    await s.register(rr), s.decorate("hasPermission", vs), r?.enabled && await s.register(Es), t();
  }
);
nr.updateContext = tr;
const or = /* @__PURE__ */ new Set([
  "id",
  "disable",
  "enable",
  "email",
  "lastLoginAt",
  "roles",
  "signedUpAt"
]), Pe = (s) => {
  for (const e of Object.keys(s))
    or.has(ne.camelize(e)) && delete s[e];
}, ir = {
  adminSignUp: async (s, e, t) => {
    const { app: r, config: n, reply: o } = t;
    try {
      const { email: i, password: a } = e.data, c = await g.getUsersThatHaveRole(W), u = await g.getUsersThatHaveRole(
        C
      );
      let d;
      if (c.status === "UNKNOWN_ROLE_ERROR" && u.status === "UNKNOWN_ROLE_ERROR" ? d = c.status : (c.status === "OK" && c.users.length > 0 || u.status === "OK" && u.users.length > 0) && (d = "First admin user already exists"), d)
        return new p.ErrorWithProps(d);
      const l = k(i, n);
      if (!l.success && l.message)
        return new p.ErrorWithProps(
          l.message
        );
      const m = K(a, n);
      if (!m.success && m.message)
        return new p.ErrorWithProps(
          m.message
        );
      const h = await Y(i, a, {
        autoVerifyEmail: !0,
        roles: [
          W,
          ...u.status === "OK" ? [C] : []
        ],
        _default: {
          request: {
            request: o.request
          }
        }
      });
      return h.status !== "OK" ? new p.ErrorWithProps(
        h.status
      ) : (await D(o.request, o, h.user.id), h);
    } catch (i) {
      r.log.error(i);
      const a = new p.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return a.statusCode = 500, a;
    }
  },
  disableUser: async (s, e, t) => {
    const { id: r } = e;
    if (t.user?.id === r) {
      const i = new p.ErrorWithProps(
        "you cannot disable yourself"
      );
      return i.statusCode = 409, i;
    }
    return await R(
      t.config,
      t.database,
      t.dbSchema
    ).update(r, { disabled: !0 }) ? { status: "OK" } : new p.ErrorWithProps(`user id ${r} not found`, {}, 404);
  },
  enableUser: async (s, e, t) => {
    const { id: r } = e;
    return await R(
      t.config,
      t.database,
      t.dbSchema
    ).update(r, { disabled: !1 }) ? { status: "OK" } : new p.ErrorWithProps(`user id ${r} not found`, {}, 404);
  },
  changePassword: async (s, e, t) => {
    const { app: r, config: n, database: o, dbSchema: i, reply: a, user: c } = t, u = R(n, o, i);
    try {
      if (c) {
        const d = await u.changePassword(
          c.id,
          e.oldPassword,
          e.newPassword
        );
        return d.status === "OK" && await D(a.request, a, c.id), d;
      } else
        return {
          status: "NOT_FOUND",
          message: "User not found"
        };
    } catch (d) {
      r.log.error(d);
      const l = new p.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return l.statusCode = 500, l;
    }
  },
  updateMe: async (s, e, t) => {
    const { data: r } = e, n = R(
      t.config,
      t.database,
      t.dbSchema
    );
    try {
      if (t.user?.id) {
        Pe(r);
        const o = await n.update(t.user.id, r), i = t.reply.request;
        return i.user = o, t.config.user.features?.profileValidation?.enabled && await i.session?.fetchAndSetClaim(
          new P(),
          q(void 0, i)
        ), o;
      } else
        return {
          status: "NOT_FOUND",
          message: "User not found"
        };
    } catch (o) {
      t.app.log.error(o);
      const i = new p.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return i.statusCode = 500, i;
    }
  }
}, ar = {
  canAdminSignUp: async (s, e, t) => {
    const { app: r } = t;
    try {
      const n = await g.getUsersThatHaveRole(W), o = await g.getUsersThatHaveRole(
        C
      );
      return n.status === "UNKNOWN_ROLE_ERROR" && o.status === "UNKNOWN_ROLE_ERROR" ? new p.ErrorWithProps(n.status) : n.status === "OK" && n.users.length > 0 || o.status === "OK" && o.users.length > 0 ? { signUp: !1 } : { signUp: !0 };
    } catch (n) {
      r.log.error(n);
      const o = new p.ErrorWithProps(
        "Oops! Something went wrong"
      );
      return o.statusCode = 500, o;
    }
  },
  me: async (s, e, t) => {
    if (t.user)
      return t.user;
    {
      t.app.log.error(
        "Could not able to get user from mercurius context"
      );
      const r = new p.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return r.statusCode = 500, r;
    }
  },
  user: async (s, e, t) => {
    const n = await R(
      t.config,
      t.database,
      t.dbSchema
    ).findById(e.id);
    if (t.config.user.features?.profileValidation?.enabled) {
      const o = t.reply.request;
      await o.session?.fetchAndSetClaim(
        new P(),
        q(void 0, o)
      );
    }
    return n;
  },
  users: async (s, e, t) => await R(
    t.config,
    t.database,
    t.dbSchema
  ).list(
    e.limit,
    e.offset,
    e.filters ? JSON.parse(JSON.stringify(e.filters)) : void 0,
    e.sort ? JSON.parse(JSON.stringify(e.sort)) : void 0
  )
}, at = { Mutation: ir, Query: ar }, cr = async (s, e) => {
  const { body: t, config: r, log: n } = s;
  try {
    const { email: o, password: i } = t, a = await g.getUsersThatHaveRole(W), c = await g.getUsersThatHaveRole(
      C
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
    const u = k(o, r);
    if (!u.success)
      return e.send({
        status: "ERROR",
        message: u.message
      });
    const d = K(i, r);
    if (!d.success)
      return e.send({
        status: "ERROR",
        message: d.message
      });
    const l = await Y(o, i, {
      autoVerifyEmail: !0,
      roles: [
        W,
        ...c.status === "OK" ? [C] : []
      ],
      _default: {
        request: {
          request: s
        }
      }
    });
    if (l.status !== "OK")
      return e.send(l);
    await D(s, e, l.user.id), e.send(l);
  } catch (o) {
    n.error(o), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, ur = async (s, e) => {
  const { log: t } = s;
  try {
    const r = await g.getUsersThatHaveRole(W), n = await g.getUsersThatHaveRole(
      C
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
}, dr = async (s, e) => {
  try {
    const t = s.session, r = s.body, n = t && t.getUserId();
    if (!n)
      throw new Error("User not found in session");
    const o = r.oldPassword ?? "", i = r.newPassword ?? "", c = await R(
      s.config,
      s.slonik,
      s.dbSchema
    ).changePassword(
      n,
      o,
      i
    );
    c.status === "OK" && await D(s, e, n), e.send(c);
  } catch (t) {
    s.log.error(t), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
      error: t
    });
  }
}, lr = async (s, e) => {
  if (s.session) {
    const { id: t } = s.params;
    return s.session.getUserId() === t ? (e.status(409), await e.send({
      message: "you cannot disable yourself"
    })) : await R(
      s.config,
      s.slonik,
      s.dbSchema
    ).update(t, { disabled: !0 }) ? await e.send({ status: "OK" }) : (e.status(404), await e.send({ message: `user id ${t} not found` }));
  } else
    throw s.log.error("could not get session"), new Error("Oops, Something went wrong");
}, pr = async (s, e) => {
  if (s.session) {
    const { id: t } = s.params;
    return await R(
      s.config,
      s.slonik,
      s.dbSchema
    ).update(t, { disabled: !1 }) ? await e.send({ status: "OK" }) : (e.status(404), await e.send({ message: `user id ${t} not found` }));
  } else
    throw s.log.error("could not get session"), new Error("Oops, Something went wrong");
}, mr = async (s, e) => {
  if (s.user)
    s.config.user.features?.profileValidation?.enabled && await s.session?.fetchAndSetClaim(
      new P(),
      q(void 0, s)
    ), e.send(s.user);
  else
    throw s.log.error("Could not able to get user from session"), new Error("Oops, Something went wrong");
}, gr = async (s, e) => {
  const t = s.session?.getUserId(), r = s.body;
  if (t) {
    const n = R(
      s.config,
      s.slonik,
      s.dbSchema
    );
    Pe(r);
    const o = await n.update(t, r);
    s.user = o, s.config.user.features?.profileValidation?.enabled && await s.session?.fetchAndSetClaim(
      new P(),
      q(void 0, s)
    ), e.send(o);
  } else
    throw s.log.error("could not get user id from session"), new Error("Oops, Something went wrong");
}, hr = async (s, e) => {
  const t = R(
    s.config,
    s.slonik,
    s.dbSchema
  ), { id: r } = s.params, n = await t.findById(r);
  e.send(n);
}, fr = async (s, e) => {
  const t = R(
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
}, A = {
  adminSignUp: cr,
  canAdminSignUp: ur,
  changePassword: dr,
  disable: lr,
  enable: pr,
  me: mr,
  updateMe: gr,
  user: hr,
  users: fr
}, ct = async (s, e, t) => {
  const r = s.config.user.handlers?.user;
  s.get(
    rs,
    {
      preHandler: [
        s.verifySession(),
        s.hasPermission(fs)
      ]
    },
    r?.users || A.users
  ), s.get(
    ts,
    {
      preHandler: [
        s.verifySession(),
        s.hasPermission(ws)
      ]
    },
    r?.user || A.user
  ), s.post(
    ss,
    {
      preHandler: s.verifySession()
    },
    r?.changePassword || A.changePassword
  ), s.get(
    ue,
    {
      preHandler: s.verifySession({
        overrideGlobalClaimValidators: async (n) => n.filter(
          (o) => o.id !== P.key
        )
      })
    },
    r?.me || A.me
  ), s.put(
    ue,
    {
      preHandler: s.verifySession({
        overrideGlobalClaimValidators: async (n) => n.filter(
          (o) => o.id !== P.key
        )
      })
    },
    r?.updateMe || A.updateMe
  ), s.put(
    ns,
    {
      preHandler: [
        s.verifySession(),
        s.hasPermission(gs)
      ]
    },
    r?.disable || A.disable
  ), s.put(
    os,
    {
      preHandler: [
        s.verifySession(),
        s.hasPermission(hs)
      ]
    },
    r?.enable || A.enable
  ), s.post(
    ce,
    r?.adminSignUp || A.adminSignUp
  ), s.get(
    ce,
    r?.canAdminSignUp || A.canAdminSignUp
  ), t();
}, ye = (s, e) => e || b(
  new Date(
    Date.now() + (s.user.invitation?.expireAfterInDays ?? qe) * (24 * 60 * 60 * 1e3)
  )
);
class wr extends me {
  /* eslint-enabled */
  getFindByTokenSql = (e) => f.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE token = ${e};
    `;
  getListSql = (e, t, r, n) => {
    const o = ge(this.table, this.schema), i = $e(
      this.config.user.table?.name || Ee,
      this.schema
    );
    return f.type(this.validationSchema)`
      SELECT ${this.getTableFragment()}.*, ROW_TO_JSON("user") as "invited_by"
      FROM ${this.getTableFragment()}
      join ${i} "user" on ${this.getTableFragment()}."invited_by_id" = "user"."id"
      ${he(r, o)}
      ${De(o, this.getSortInput(n))}
      ${fe(e, t)};
    `;
  };
}
class Ue extends we {
  static TABLE = Ze;
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
    return this._factory || (this._factory = new wr(this)), this._factory;
  }
  validateUUID = (e) => /^[\da-f]{8}(?:\b-[\da-f]{4}){3}\b-[\da-f]{12}$/gi.test(e);
}
const v = (s, e, t) => {
  const r = s.user.services?.invitation || Ue;
  return new r(s, e, t);
}, G = (s) => !(s.acceptedAt || s.revokedAt || Date.now() > s.expiresAt), Sr = (s, e, t) => {
  const { token: r } = e;
  let n = s.user.invitation?.acceptLinkPath || xe;
  return n = n.replace(/:token(?!\w)/g, r), new URL(n, t).href;
}, Q = async (s, e, t) => {
  const { config: r, log: n } = s, o = r.apps?.find((i) => i.id === e.appId)?.origin || ie(t || "") || r.appOrigin[0];
  o ? J({
    fastify: s,
    subject: "Invitation for Sign Up",
    templateData: {
      invitationLink: Sr(r, e, o)
    },
    templateName: "user-invitation",
    to: e.email
  }) : n.error(`Could not send email for invitation ID ${e.id}`);
}, Rr = {
  acceptInvitation: async (s, e, t) => {
    const { app: r, config: n, database: o, dbSchema: i, reply: a } = t, { token: c, data: u } = e;
    try {
      const { email: d, password: l } = u, m = k(d, n);
      if (!m.success && m.message)
        return new p.ErrorWithProps(
          m.message
        );
      const h = K(l, n);
      if (!h.success && h.message)
        return new p.ErrorWithProps(
          h.message
        );
      const w = v(n, o, i), S = await w.findByToken(c);
      if (!S || !G(S))
        return new p.ErrorWithProps(
          "Invitation is invalid or has expired"
        );
      if (S.email != d)
        return new p.ErrorWithProps(
          "Email do not match with the invitation"
        );
      const I = await Y(d, l, {
        roles: [S.role],
        autoVerifyEmail: !0
      });
      if (I.status !== "OK")
        return I;
      await w.update(S.id, {
        acceptedAt: b(new Date(Date.now()))
      });
      try {
        await n.user.invitation?.postAccept?.(
          a.request,
          S,
          I.user
        );
      } catch (U) {
        r.log.error(U);
      }
      return await D(a.request, a, I.user.id), {
        ...I,
        user: {
          ...I.user,
          roles: [S.role]
        }
      };
    } catch (d) {
      r.log.error(d);
      const l = new p.ErrorWithProps(
        "Oops! Something went wrong"
      );
      return l.statusCode = 500, l;
    }
  },
  createInvitation: async (s, e, t) => {
    const { app: r, config: n, database: o, dbSchema: i, reply: a, user: c } = t;
    try {
      if (!c)
        throw new Error("User not found in session");
      const { appId: u, email: d, expiresAt: l, payload: m, role: h } = e.data, w = k(d, n);
      if (!w.success && w.message)
        return new p.ErrorWithProps(w.message);
      const S = R(n, o, i), I = {
        key: "email",
        operator: "eq",
        value: d
      };
      if (await S.count(I) > 0)
        return new p.ErrorWithProps(
          `User with email ${d} already exists`
        );
      const X = v(n, o, i), _ = {
        email: d,
        expiresAt: ye(n, l),
        invitedById: c.id,
        role: h || n.user.role || z
      }, j = n.apps?.find((E) => E.id == u);
      if (j)
        if (j.supportedRoles.includes(_.role))
          _.appId = u;
        else
          return new p.ErrorWithProps(
            `App ${j.name} does not support role ${_.role}`
          );
      Object.keys(m || {}).length > 0 && (_.payload = JSON.stringify(m));
      let F;
      try {
        F = await X.create(_);
      } catch (E) {
        return new p.ErrorWithProps(E.message);
      }
      if (F) {
        try {
          const { headers: E, hostname: L } = a.request, V = E.referer || E.origin || L;
          Q(r, F, V);
        } catch (E) {
          r.log.error(E);
        }
        return F;
      }
    } catch (u) {
      r.log.error(u);
      const d = new p.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return d.statusCode = 500, d;
    }
  },
  resendInvitation: async (s, e, t) => {
    const { app: r, config: n, database: o, dbSchema: i, reply: a } = t, u = await v(n, o, i).findById(e.id);
    if (!u || !G(u))
      return new p.ErrorWithProps(
        "Invitation is invalid or has expired"
      );
    const { headers: d, hostname: l } = a.request, m = d.referer || d.origin || l;
    try {
      Q(r, u, m);
    } catch (h) {
      r.log.error(h);
    }
    return u;
  },
  revokeInvitation: async (s, e, t) => {
    const r = v(
      t.config,
      t.database,
      t.dbSchema
    );
    let n = await r.findById(e.id), o;
    return n ? n.acceptedAt ? o = "Invitation is already accepted" : Date.now() > n.expiresAt ? o = "Invitation is expired" : n.revokedAt && (o = "Invitation is already revoked") : o = "Invitation not found", o ? new p.ErrorWithProps(o) : (n = await r.update(e.id, {
      revokedAt: b(new Date(Date.now()))
    }), n);
  },
  deleteInvitation: async (s, e, t) => {
    const n = await v(
      t.config,
      t.database,
      t.dbSchema
    ).delete(e.id);
    let o;
    return n || (o = "Invitation not found"), o ? new p.ErrorWithProps(o) : n;
  }
}, Er = {
  getInvitationByToken: async (s, e, t) => {
    try {
      return await v(
        t.config,
        t.database,
        t.dbSchema
      ).findByToken(e.token);
    } catch (r) {
      t.app.log.error(r);
      const n = new p.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return n.statusCode = 500, n;
    }
  },
  invitations: async (s, e, t) => await v(
    t.config,
    t.database,
    t.dbSchema
  ).list(
    e.limit,
    e.offset,
    e.filters ? JSON.parse(JSON.stringify(e.filters)) : void 0,
    e.sort ? JSON.parse(JSON.stringify(e.sort)) : void 0
  )
}, ut = { Mutation: Rr, Query: Er }, vr = async (s, e) => {
  const { body: t, config: r, dbSchema: n, log: o, params: i, slonik: a } = s, { token: c } = i;
  try {
    const { email: u, password: d } = t, l = k(u, r);
    if (!l.success)
      return e.send({
        status: "ERROR",
        message: l.message
      });
    const m = K(d, r);
    if (!m.success)
      return e.send({
        status: "ERROR",
        message: m.message
      });
    const h = v(r, a, n), w = await h.findByToken(c);
    if (!w || !G(w))
      return e.send({
        status: "ERROR",
        message: "Invitation is invalid or has expired"
      });
    if (w.email != u)
      return e.send({
        status: "ERROR",
        message: "Email do not match with the invitation"
      });
    const S = await Y(u, d, {
      roles: [w.role],
      autoVerifyEmail: !0
    });
    if (S.status !== "OK")
      return e.send(S);
    await h.update(w.id, {
      acceptedAt: b(new Date(Date.now()))
    });
    try {
      await r.user.invitation?.postAccept?.(
        s,
        w,
        S.user
      );
    } catch (I) {
      o.error(I);
    }
    await D(s, e, S.user.id), e.send({
      ...S,
      user: {
        ...S.user,
        roles: [w.role]
      }
    });
  } catch (u) {
    o.error(u), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, Ir = async (s, e) => {
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
    const l = u && u.getUserId();
    if (!l)
      throw new Error("User not found in session");
    const { appId: m, email: h, expiresAt: w, payload: S, role: I } = t, U = k(h, r);
    if (!U.success)
      return e.send({
        status: "ERROR",
        message: U.message
      });
    const X = R(r, d, n), _ = {
      key: "email",
      operator: "eq",
      value: h
    };
    if (await X.count(_) > 0)
      return e.send({
        status: "ERROR",
        message: `User with email ${h} already exists`
      });
    const F = v(r, d, n), E = {
      email: h,
      expiresAt: ye(r, w),
      invitedById: l,
      role: I || r.user.role || z
    }, L = r.apps?.find((M) => M.id == m);
    if (L)
      if (L.supportedRoles.includes(E.role))
        E.appId = m;
      else
        return e.send({
          status: "ERROR",
          message: `App ${L.name} does not support role ${E.role}`
        });
    Object.keys(S || {}).length > 0 && (E.payload = JSON.stringify(S));
    let V;
    try {
      V = await F.create(E);
    } catch (M) {
      return e.send({
        status: "ERROR",
        message: M.message
      });
    }
    if (V) {
      const M = o.referer || o.origin || i;
      try {
        Q(c, V, M);
      } catch (Ae) {
        a.error(Ae);
      }
      const ae = V;
      delete ae.token, e.send(ae);
    }
  } catch (l) {
    a.error(l), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, Or = async (s, e) => {
  const { config: t, dbSchema: r, log: n, params: o, slonik: i } = s;
  try {
    const { id: a } = o, u = await new Ue(t, i, r).delete(a);
    if (!u)
      return e.send({
        status: "error",
        message: "Invitation not found"
      });
    const d = u;
    delete d.token, e.send(d);
  } catch (a) {
    n.error(a), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, Pr = async (s, e) => {
  const { config: t, dbSchema: r, log: n, params: o, slonik: i } = s, { token: a } = o;
  try {
    const u = await v(t, i, r).findByToken(a);
    e.send(u);
  } catch (c) {
    n.error(c), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, yr = async (s, e) => {
  const { config: t, dbSchema: r, log: n, query: o, slonik: i } = s;
  try {
    const { limit: a, offset: c, filters: u, sort: d } = o, m = await v(t, i, r).list(
      a,
      c,
      u ? JSON.parse(u) : void 0,
      d ? JSON.parse(d) : void 0
    );
    for (const h of m.data)
      delete h.token;
    e.send(m);
  } catch (a) {
    n.error(a), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, Ur = async (s, e) => {
  const { config: t, dbSchema: r, headers: n, hostname: o, log: i, params: a, slonik: c, server: u } = s;
  try {
    const { id: d } = a, m = await v(t, c, r).findById(d);
    if (!m || !G(m))
      return e.send({
        status: "ERROR",
        message: "Invitation is invalid or has expired"
      });
    const h = n.referer || n.origin || o;
    try {
      Q(u, m, h);
    } catch (S) {
      i.error(S);
    }
    const w = m;
    delete w.token, e.send(w);
  } catch (d) {
    i.error(d), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, Ar = async (s, e) => {
  const { config: t, dbSchema: r, log: n, params: o, slonik: i } = s;
  try {
    const { id: a } = o, c = v(t, i, r);
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
}, N = {
  acceptInvitation: vr,
  createInvitation: Ir,
  deleteInvitation: Or,
  getInvitationByToken: Pr,
  listInvitation: yr,
  resendInvitation: Ur,
  revokeInvitation: Ar
}, dt = async (s, e, t) => {
  const r = s.config.user.handlers?.invitation;
  s.get(
    Je,
    {
      preHandler: [
        s.verifySession(),
        s.hasPermission(ls)
      ]
    },
    r?.list || N.listInvitation
  ), s.post(
    Ge,
    {
      preHandler: [
        s.verifySession(),
        s.hasPermission(us)
      ]
    },
    r?.create || N.createInvitation
  ), s.get(
    Ye,
    r?.getByToken || N.getInvitationByToken
  ), s.post(
    je,
    r?.accept || N.acceptInvitation
  ), s.put(
    Xe,
    {
      preHandler: [
        s.verifySession(),
        s.hasPermission(ms)
      ]
    },
    r?.revoke || N.revokeInvitation
  ), s.post(
    ze,
    {
      preHandler: [
        s.verifySession(),
        s.hasPermission(ps)
      ]
    },
    r?.resend || N.resendInvitation
  ), s.delete(
    Qe,
    {
      preHandler: [
        s.verifySession(),
        s.hasPermission(ds)
      ]
    },
    r?.delete || N.deleteInvitation
  ), t();
}, br = {
  permissions: async (s, e, t) => {
    const { app: r, config: n } = t;
    try {
      return n.user.permissions || [];
    } catch (o) {
      r.log.error(o);
      const i = new p.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return i.statusCode = 500, i;
    }
  }
}, lt = { Query: br }, _r = async (s, e) => {
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
}, Nr = {
  getPermissions: _r
}, pt = async (s, e, t) => {
  s.get(
    is,
    {
      preHandler: [s.verifySession()]
    },
    Nr.getPermissions
  ), t();
};
class O extends Error {
  statusCode;
  constructor({ message: e, name: t, statusCode: r }) {
    super(e), this.message = e, this.name = t, this.statusCode = r;
  }
}
class y {
  createRole = async (e, t) => {
    const { roles: r } = await g.getAllRoles(e);
    if (r.includes(e))
      throw new O({
        name: "ROLE_ALREADY_EXISTS",
        message: "Unable to create role as it already exists",
        statusCode: 422
      });
    return { status: (await g.createNewRoleOrAddPermissions(
      e,
      t || []
    )).status };
  };
  deleteRole = async (e) => {
    const t = await g.getUsersThatHaveRole(e);
    if (t.status === "UNKNOWN_ROLE_ERROR")
      throw new O({
        name: t.status,
        message: "Invalid role",
        statusCode: 422
      });
    if (t.users.length > 0)
      throw new O({
        name: "ROLE_IN_USE",
        message: "The role is currently assigned to one or more users and cannot be deleted",
        statusCode: 422
      });
    return { status: (await g.deleteRole(e)).status };
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
      throw new O({
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
const Tr = {
  createRole: async (s, e, t) => {
    const { app: r } = t;
    try {
      return await new y().createRole(
        e.role,
        e.permissions
      );
    } catch (n) {
      if (n instanceof O) {
        const i = new p.ErrorWithProps(n.name);
        return i.statusCode = n.statusCode, i;
      }
      r.log.error(n);
      const o = new p.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return o.statusCode = 500, o;
    }
  },
  deleteRole: async (s, e, t) => {
    const { app: r } = t;
    try {
      const n = new y(), { role: o } = e;
      return await n.deleteRole(o);
    } catch (n) {
      if (n instanceof O) {
        const i = new p.ErrorWithProps(n.name);
        return i.statusCode = n.statusCode, i;
      }
      r.log.error(n);
      const o = new p.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return o.statusCode = 500, o;
    }
  },
  updateRolePermissions: async (s, e, t) => {
    const { app: r } = t, { permissions: n, role: o } = e;
    try {
      return await new y().updateRolePermissions(
        o,
        n
      );
    } catch (i) {
      if (i instanceof O) {
        const c = new p.ErrorWithProps(i.name);
        return c.statusCode = i.statusCode, c;
      }
      r.log.error(i);
      const a = new p.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return a.statusCode = 500, a;
    }
  }
}, Cr = {
  roles: async (s, e, t) => {
    const { app: r } = t;
    try {
      return await new y().getRoles();
    } catch (n) {
      r.log.error(n);
      const o = new p.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return o.statusCode = 500, o;
    }
  },
  rolePermissions: async (s, e, t) => {
    const { app: r } = t, { role: n } = e;
    let o = [];
    try {
      return n && (o = await new y().getPermissionsForRole(n)), o;
    } catch (i) {
      r.log.error(i);
      const a = new p.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return a.statusCode = 500, a;
    }
  }
}, mt = { Mutation: Tr, Query: Cr }, kr = async (s, e) => {
  const { body: t, log: r } = s, { role: n, permissions: o } = t;
  try {
    const a = await new y().createRole(n, o);
    return e.send(a);
  } catch (i) {
    return i instanceof O ? (e.status(i.statusCode), e.send({
      message: i.message,
      name: i.name,
      statusCode: i.statusCode
    })) : (r.error(i), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    }));
  }
}, Fr = async (s, e) => {
  const { log: t, query: r } = s;
  try {
    let { role: n } = r;
    if (n) {
      try {
        n = JSON.parse(n);
      } catch {
      }
      if (typeof n != "string")
        throw new O({
          name: "UNKNOWN_ROLE_ERROR",
          message: "Invalid role",
          statusCode: 422
        });
      const i = await new y().deleteRole(n);
      return e.send(i);
    }
    throw new O({
      name: "UNKNOWN_ROLE_ERROR",
      message: "Invalid role",
      statusCode: 422
    });
  } catch (n) {
    return n instanceof O ? (e.status(n.statusCode), e.send({
      message: n.message,
      name: n.name,
      statusCode: n.statusCode
    })) : (t.error(n), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    }));
  }
}, Lr = async (s, e) => {
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
      n = await new y().getPermissionsForRole(o);
    }
    return e.send({ permissions: n });
  } catch (o) {
    return t.error(o), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, Vr = async (s, e) => {
  const { log: t } = s;
  try {
    const n = await new y().getRoles();
    return e.send({ roles: n });
  } catch (r) {
    return t.error(r), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, $r = async (s, e) => {
  const { log: t, body: r } = s;
  try {
    const { role: n, permissions: o } = r, a = await new y().updateRolePermissions(
      n,
      o
    );
    return e.send(a);
  } catch (n) {
    return n instanceof O ? (e.status(n.statusCode), e.send({
      message: n.message,
      name: n.name,
      statusCode: n.statusCode
    })) : (t.error(n), e.status(500), e.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    }));
  }
}, H = {
  deleteRole: Fr,
  createRole: kr,
  getRoles: Vr,
  getPermissions: Lr,
  updatePermissions: $r
}, gt = async (s, e, t) => {
  s.delete(
    Z,
    {
      preHandler: [s.verifySession()]
    },
    H.deleteRole
  ), s.get(
    Z,
    {
      preHandler: [s.verifySession()]
    },
    H.getRoles
  ), s.get(
    de,
    {
      preHandler: [s.verifySession()]
    },
    H.getPermissions
  ), s.post(
    Z,
    {
      preHandler: [s.verifySession()]
    },
    H.createRole
  ), s.put(
    de,
    {
      preHandler: [s.verifySession()]
    },
    H.updatePermissions
  ), t();
}, ht = async (s) => {
  const { roles: e } = await g.getAllRoles();
  return e.includes(s);
}, Dr = oe`
  type Invitation {
    id: Int!
    acceptedAt: Float
    appId: Int
    email: String!
    expiresAt: Float!
    invitedById: String!
    payload: JSON
    revokedAt: Float
    role: String!
    createdAt: Float!
    updatedAt: Float!
  }

  type Invitations {
    totalCount: Int
    filteredCount: Int
    data: [Invitation]!
  }

  input AcceptInvitationFieldInput {
    email: String!
    password: String!
  }

  input InvitationCreateInput {
    appId: Int
    email: String!
    expiresAt: String
    payload: JSON
    role: String!
  }

  input InvitationUpdateInput {
    acceptedAt: String
    expiresAt: String
    revokedAt: String
  }

  type Mutation {
    acceptInvitation(
      token: String!
      data: AcceptInvitationFieldInput!
    ): AuthResponse
    createInvitation(data: InvitationCreateInput!): Invitation @auth
    deleteInvitation(id: Int!): Invitation @auth
    resendInvitation(id: Int!): Invitation @auth
    revokeInvitation(id: Int!): Invitation @auth
  }

  type Query {
    invitations(
      limit: Int
      offset: Int
      filters: Filters
      sort: [SortInput]
    ): Invitations!
    getInvitationByToken(token: String!): Invitation
  }
`, Wr = oe`
  type Role {
    role: String!
    permissions: [String]!
  }

  type UpdateRolePermissionsResponse {
    status: String!
    permissions: [String]!
  }

  type RoleResponse {
    status: String!
  }

  type Mutation {
    createRole(role: String!, permissions: [String]): RoleResponse! @auth
    deleteRole(role: String!): RoleResponse! @auth
    updateRolePermissions(
      role: String!
      permissions: [String]!
    ): UpdateRolePermissionsResponse! @auth
  }

  type Query {
    permissions: [String]! @auth
    roles: [Role]! @auth
    rolePermissions(role: String!): [String]! @auth
  }
`, Kr = oe`
  type User {
    id: String!
    disabled: Boolean!
    email: String!
    lastLoginAt: Float!
    roles: [String]
    signedUpAt: Float!
    timeJoined: Float
  }

  type Users {
    totalCount: Int
    filteredCount: Int
    data: [User]!
  }

  type ChangePasswordResponse {
    statusCode: Int
    status: String
    message: String
  }

  type AuthResponse {
    status: String!
    user: User!
  }

  type CanAdminSignUpResponse {
    signUp: Boolean!
  }

  type UpdateUserResponse {
    status: String!
  }

  input UserUpdateInput {
    id: String
  }

  input SingUpFieldInput {
    email: String!
    password: String!
  }

  type Mutation {
    adminSignUp(data: SingUpFieldInput!): AuthResponse
    disableUser(id: String!): UpdateUserResponse @auth
    enableUser(id: String!): UpdateUserResponse @auth
    changePassword(
      oldPassword: String
      newPassword: String
    ): ChangePasswordResponse @auth
    updateMe(data: UserUpdateInput): User @auth(profileValidation: false)
  }

  type Query {
    canAdminSignUp: CanAdminSignUpResponse
    user(id: String): User @auth
    users(limit: Int, offset: Int, filters: Filters, sort: [SortInput]): Users!
      @auth
    me: User! @auth(profileValidation: false)
  }
`, ft = Me([
  He,
  Dr,
  Wr,
  Kr
]);
export {
  as as EMAIL_VERIFICATION_MODE,
  cs as EMAIL_VERIFICATION_PATH,
  xe as INVITATION_ACCEPT_LINK_PATH,
  qe as INVITATION_EXPIRE_AFTER_IN_DAYS,
  Ue as InvitationService,
  wr as InvitationSqlFactory,
  us as PERMISSIONS_INVITATIONS_CREATE,
  ds as PERMISSIONS_INVITATIONS_DELETE,
  ls as PERMISSIONS_INVITATIONS_LIST,
  ps as PERMISSIONS_INVITATIONS_RESEND,
  ms as PERMISSIONS_INVITATIONS_REVOKE,
  gs as PERMISSIONS_USERS_DISABLE,
  hs as PERMISSIONS_USERS_ENABLE,
  fs as PERMISSIONS_USERS_LIST,
  ws as PERMISSIONS_USERS_READ,
  P as ProfileValidationClaim,
  es as RESET_PASSWORD_PATH,
  W as ROLE_ADMIN,
  C as ROLE_SUPERADMIN,
  z as ROLE_USER,
  ss as ROUTE_CHANGE_PASSWORD,
  Je as ROUTE_INVITATIONS,
  je as ROUTE_INVITATIONS_ACCEPT,
  Ge as ROUTE_INVITATIONS_CREATE,
  Qe as ROUTE_INVITATIONS_DELETE,
  Ye as ROUTE_INVITATIONS_GET_BY_TOKEN,
  ze as ROUTE_INVITATIONS_RESEND,
  Xe as ROUTE_INVITATIONS_REVOKE,
  ue as ROUTE_ME,
  is as ROUTE_PERMISSIONS,
  Z as ROUTE_ROLES,
  de as ROUTE_ROLES_PERMISSIONS,
  ce as ROUTE_SIGNUP_ADMIN,
  rs as ROUTE_USERS,
  ns as ROUTE_USERS_DISABLE,
  os as ROUTE_USERS_ENABLE,
  ts as ROUTE_USERS_FIND_BY_ID,
  y as RoleService,
  Ze as TABLE_INVITATIONS,
  Ee as TABLE_USERS,
  Ns as UserService,
  Us as UserSqlFactory,
  Oe as areRolesExist,
  ye as computeInvitationExpiresAt,
  q as createUserContext,
  nr as default,
  Rt as formatDate,
  v as getInvitationService,
  ie as getOrigin,
  R as getUserService,
  ve as hasUserPermission,
  ut as invitationResolver,
  dt as invitationRoutes,
  G as isInvitationValid,
  ht as isRoleExists,
  lt as permissionResolver,
  pt as permissionRoutes,
  mt as roleResolver,
  gt as roleRoutes,
  J as sendEmail,
  Q as sendInvitation,
  at as userResolver,
  ct as userRoutes,
  ft as userSchema,
  k as validateEmail,
  K as validatePassword,
  Ws as verifyEmail
};

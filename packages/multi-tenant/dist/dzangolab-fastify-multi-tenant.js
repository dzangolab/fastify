import _ from "fastify-plugin";
import j from "lodash.merge";
import S from "supertokens-node/recipe/userroles";
import { getOrigin as F, EMAIL_VERIFICATION_PATH as G, sendEmail as O, getUserService as z, ProfileValidationClaim as K, areRolesExist as $, verifyEmail as J, ROLE_USER as D, RESET_PASSWORD_PATH as X, formatDate as Y } from "@dzangolab/fastify-user";
import { getRequestFromUserContext as Q, deleteUser as P } from "supertokens-node";
import { formatDate as Z, DefaultSqlFactory as ee, createTableIdentifier as b, createFilterFragment as R, createSortFragment as te, createLimitFragment as ne, BaseService as se } from "@dzangolab/fastify-slonik";
import U from "supertokens-node/recipe/emailverification";
import { getUserById as re, getUserByThirdPartyInfo as ae } from "supertokens-node/recipe/thirdpartyemailpassword";
import T from "humps";
import { sql as l } from "slonik";
import { z as h } from "zod";
import { existsSync as L } from "node:fs";
import { migrate as oe } from "@dzangolab/postgres-migrations";
import * as ie from "pg";
import p from "mercurius";
const I = "TENANT_OWNER", de = async () => {
  await S.createNewRoleOrAddPermissions(I, []);
}, le = async (n, t) => {
  n.tenant = t.tenant;
}, g = (n) => {
  const t = n.slonik?.migrations?.path || "migrations";
  return {
    migrations: {
      path: n.multiTenant?.migrations?.path || `${t}/tenants`
    },
    reserved: {
      admin: {
        domains: n.multiTenant.reserved?.admin?.domains || [],
        enabled: n.multiTenant.reserved?.admin?.enabled ?? !0,
        slugs: n.multiTenant.reserved?.admin?.slugs || ["admin"]
      },
      blacklisted: {
        domains: n.multiTenant.reserved?.blacklisted?.domains || [],
        enabled: n.multiTenant.reserved?.blacklisted?.enabled ?? !0,
        slugs: n.multiTenant.reserved?.blacklisted?.slugs || []
      },
      others: {
        domains: n.multiTenant.reserved?.others?.domains || [],
        enabled: n.multiTenant.reserved?.others?.enabled ?? !0,
        slugs: n.multiTenant.reserved?.others?.slugs || []
      },
      www: {
        domains: n.multiTenant.reserved?.www?.domains || [],
        enabled: n.multiTenant.reserved?.www?.enabled ?? !0,
        slugs: n.multiTenant.reserved?.www?.slugs || ["www"]
      }
    },
    table: {
      name: n.multiTenant?.table?.name || "tenants",
      columns: {
        id: n.multiTenant?.table?.columns?.id || "id",
        domain: n.multiTenant?.table?.columns?.domain || "domain",
        name: n.multiTenant?.table?.columns?.name || "name",
        ownerId: n.multiTenant?.table?.columns?.ownerId || "owner_id",
        slug: n.multiTenant?.table?.columns?.slug || "slug"
      }
    }
  };
}, y = {
  addTenantPrefix: (n, t, e) => (e && (t = e[g(n).table.columns.id] + "_" + t), t),
  removeTenantPrefix: (n, t, e) => (e && e[g(n).table.columns.id] == t.slice(0, Math.max(0, Math.max(0, t.indexOf("_")))) && (t = t.slice(Math.max(0, t.indexOf("_") + 1))), t)
}, ce = (n, t) => {
  const e = t.config.appOrigin[0];
  return async (s) => {
    let r;
    try {
      const a = s.userContext._default.request.request;
      try {
        const i = a.headers.referer || a.headers.origin || a.hostname;
        r = F(i) || e;
      } catch {
        r = e;
      }
      const o = s.emailVerifyLink.replace(
        e + "/auth/verify-email",
        r + (t.config.user.supertokens.emailVerificationPath || G)
      );
      let d = s.user.email;
      a.tenant && (d = y.removeTenantPrefix(a.config, d, a.tenant)), O({
        fastify: t,
        subject: "Email Verification",
        templateName: "email-verification",
        to: d,
        templateData: {
          emailVerifyLink: o
        }
      });
    } catch (a) {
      a instanceof Error && t.log.error(a.message);
    }
  };
}, v = (n, t, e) => {
  const s = g(n), r = e ? e[s.table.columns.slug] : "";
  return z(n, t, r);
}, ue = (n, t) => async (e) => {
  if (n.createNewSession === void 0)
    throw new Error("Should never come here");
  const s = Q(e.userContext)?.original, r = e.userContext.tenant;
  if (s) {
    const { config: o, slonik: d } = s, i = g(o);
    r && (e.accessTokenPayload = {
      ...e.accessTokenPayload,
      tenantId: r[i.table.columns.id]
    });
    const m = await v(o, d, r).findById(e.userId) || void 0;
    if (m?.disabled)
      throw {
        name: "SIGN_IN_FAILED",
        message: "user is disabled",
        statusCode: 401
      };
    e.userContext._default.request.request.user = m;
  }
  const a = await n.createNewSession(e);
  return s && s.config.user.features?.profileValidation?.enabled && await a.fetchAndSetClaim(
    new K(),
    e.userContext
  ), a;
}, me = (n, t) => async (e) => {
  if (n.verifySession === void 0)
    throw new Error("Should never come here");
  const s = await n.verifySession(e);
  if (s) {
    const r = e.userContext._default.request.request, a = s.getAccessTokenPayload().tenantId;
    if (r.tenant) {
      const d = g(r.config);
      if (a != r.tenant[d.table.columns.id])
        throw {
          name: "SESSION_VERIFICATION_FAILED",
          message: "invalid session",
          statusCode: 401
        };
    }
    if (e.userContext._default.request.request.user?.disabled)
      throw await s.revokeSession(), {
        name: "SESSION_VERIFICATION_FAILED",
        message: "user is disabled",
        statusCode: 401
      };
  }
  return s;
}, ge = (n, t) => async (e) => {
  if (n.refreshPOST === void 0)
    throw new Error("Should never come here");
  const s = await n.refreshPOST(e);
  if (s) {
    const r = e.userContext._default.request.request, a = s.getAccessTokenPayload().tenantId;
    if (r.tenant) {
      const o = g(r.config);
      if (a != r.tenant[o.table.columns.id])
        throw {
          name: "SESSION_VERIFICATION_FAILED",
          message: "invalid session",
          statusCode: 401
        };
    }
  }
  return s;
}, fe = (n, t) => {
  const { config: e, log: s, slonik: r } = t;
  return async (a) => {
    a.email = y.addTenantPrefix(
      e,
      a.email,
      a.userContext.tenant
    );
    const o = await n.emailPasswordSignIn(
      a
    );
    if (o.status !== "OK")
      return o;
    const d = v(
      e,
      r,
      a.userContext.tenant
    ), i = await d.findById(o.user.id);
    return i ? (i.lastLoginAt = Date.now(), await d.update(i.id, {
      lastLoginAt: Z(new Date(i.lastLoginAt))
    }).catch((m) => {
      s.error(
        `Unable to update lastLoginAt for userId ${o.user.id}`
      ), s.error(m);
    }), {
      status: "OK",
      user: {
        ...o.user,
        ...i
      }
    }) : (s.error(`User record not found for userId ${o.user.id}`), { status: "WRONG_CREDENTIALS_ERROR" });
  };
}, he = (n, t) => async (e) => {
  if (e.userContext.tenant = e.options.req.original.tenant, e.userContext.dbSchema = e.options.req.original.dbSchema, n.emailPasswordSignInPOST === void 0)
    throw new Error("Should never come here");
  return await n.emailPasswordSignInPOST(e);
}, we = (n, t) => {
  const { config: e, log: s, slonik: r } = t;
  return async (a) => {
    const o = a.userContext.roles || [];
    if (!await $(o))
      throw s.error(`At least one role from ${o.join(", ")} does not exist.`), {
        name: "SIGN_UP_FAILED",
        message: "Something went wrong",
        statusCode: 500
      };
    const d = a.email;
    a.email = y.addTenantPrefix(
      e,
      d,
      a.userContext.tenant
    );
    const i = await n.emailPasswordSignUp(
      a
    );
    if (i.status === "OK") {
      const c = v(
        e,
        r,
        a.userContext.tenant
      );
      let m;
      try {
        if (m = await c.create({
          id: i.user.id,
          email: d
        }), !m)
          throw new Error("User not found");
      } catch (u) {
        throw s.error("Error while creating user"), s.error(u), await P(i.user.id), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      }
      m.roles = o, i.user = {
        ...i.user,
        ...m
      };
      for (const u of o) {
        const f = await S.addRoleToUser(
          i.user.id,
          u
        );
        f.status !== "OK" && s.error(f.status);
      }
      if (e.user.features?.signUp?.emailVerification)
        try {
          if (a.userContext.autoVerifyEmail)
            await J(m.id);
          else {
            const u = await U.createEmailVerificationToken(
              i.user.id
            );
            u.status === "OK" && await U.sendEmail({
              type: "EMAIL_VERIFICATION",
              user: {
                id: i.user.id,
                email: a.email
              },
              emailVerifyLink: `${e.appOrigin[0]}/auth/verify-email?token=${u.token}&rid=emailverification`,
              userContext: a.userContext
            });
          }
        } catch (u) {
          s.error(u);
        }
    }
    if (e.user.supertokens.sendUserAlreadyExistsWarning && i.status === "EMAIL_ALREADY_EXISTS_ERROR")
      try {
        O({
          fastify: t,
          subject: "Duplicate Email Registration",
          templateData: {
            emailId: d
          },
          templateName: "duplicate-email-warning",
          to: d
        });
      } catch (c) {
        s.error(c);
      }
    return i;
  };
}, A = (n) => {
  let t;
  try {
    if (t = new URL(n).host, !t)
      throw new Error("Host is empty");
  } catch {
    t = n;
  }
  return t;
}, pe = (n, t) => async (e) => {
  const s = e.options.req.original, r = s.headers.referer || s.headers.origin || s.hostname, a = A(r), { admin: o, www: d } = g(s.config).reserved;
  if (e.userContext.roles = d.enabled && (d.slugs.some(
    (i) => `${i}.${s.config.multiTenant.rootDomain}` === a
  ) || d.domains.includes(a)) ? [I] : [s.config.user.role || D], o.enabled && (o.slugs.some(
    (i) => `${i}.${s.config.multiTenant.rootDomain}` === a
  ) || o.domains.includes(a)))
    throw {
      name: "SIGN_UP_FAILED",
      message: "Admin signUp is not allowed",
      statusCode: 403
    };
  if (e.userContext.tenant = s.tenant, n.emailPasswordSignUpPOST === void 0)
    throw new Error("Should never come here");
  if (t.config.user.features?.signUp?.enabled === !1)
    throw {
      name: "SIGN_UP_DISABLED",
      message: "SignUp feature is currently disabled",
      statusCode: 404
    };
  return await n.emailPasswordSignUpPOST(e);
}, Se = (n, t, e) => (e && t.find((s) => {
  s.id === "email" && (s.value = e[g(n).table.columns.id] + "_" + s.value);
}), t), Ie = (n, t) => async (e) => {
  if (e.userContext.tenant = e.options.req.original.tenant, n.generatePasswordResetTokenPOST === void 0)
    throw new Error("Should never come here");
  return e.formFields = Se(
    t.config,
    e.formFields,
    e.userContext.tenant
  ), await n.generatePasswordResetTokenPOST(e);
}, Te = (n, t) => async (e) => {
  let s = await n.getUserById(e);
  return s && e.userContext && e.userContext.tenant && (s = {
    ...s,
    email: y.removeTenantPrefix(
      t.config,
      s.email,
      e.userContext.tenant
    )
  }), s;
}, Ee = (n, t) => async (e) => {
  const s = await n.resetPasswordUsingToken(e);
  if (s.status === "OK" && s.userId) {
    const r = await re(s.userId, {
      tenant: e.userContext._default.request.request.tenant
    });
    r && O({
      fastify: t,
      subject: "Reset Password Notification",
      templateName: "reset-password-notification",
      to: r.email,
      templateData: {
        emailId: r.email
      }
    });
  }
  return s;
}, ye = (n, t) => {
  const e = t.config.appOrigin[0];
  return async (s) => {
    const r = s.userContext._default.request.request;
    let a;
    if (r.query.appId) {
      const c = Number(r.query.appId);
      a = t.config.apps?.find((m) => m.id === c);
    }
    const o = a?.origin || r.headers.referer || r.headers.origin || r.hostname, d = F(o) || e, i = s.passwordResetLink.replace(
      e + "/auth/reset-password",
      d + (t.config.user.supertokens.resetPasswordPath || X)
    );
    O({
      fastify: t,
      subject: "Reset Password",
      templateName: "reset-password",
      to: y.removeTenantPrefix(
        r.config,
        s.user.email,
        s.userContext.tenant
      ),
      templateData: {
        passwordResetLink: i
      }
    });
  };
}, ve = (n, t) => {
  const { config: e, log: s, slonik: r } = t;
  return async (a) => {
    const o = a.userContext.roles || [], d = a.userContext.tenant;
    if (d) {
      const u = d[g(e).table.columns.id];
      a.thirdPartyUserId = u + "_" + a.thirdPartyUserId;
    }
    if (!await ae(
      a.thirdPartyId,
      a.thirdPartyUserId,
      a.userContext
    ) && e.user.features?.signUp?.enabled === !1)
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404
      };
    const c = await n.thirdPartySignInUp(
      a
    ), m = v(e, r, d);
    if (c.createdNewUser) {
      if (!await $(o))
        throw await P(c.user.id), s.error(`At least one role from ${o.join(", ")} does not exist.`), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      for (const f of o) {
        const E = await S.addRoleToUser(
          c.user.id,
          f
        );
        E.status !== "OK" && s.error(E.status);
      }
      let u;
      try {
        if (u = await m.create({
          id: c.user.id,
          email: c.user.email
        }), !u)
          throw new Error("User not found");
      } catch (f) {
        throw s.error("Error while creating user"), s.error(f), await P(c.user.id), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      }
    } else
      await m.update(c.user.id, {
        lastLoginAt: Y(new Date(Date.now()))
      }).catch((u) => {
        s.error(
          `Unable to update lastLoginAt for userId ${c.user.id}`
        ), s.error(u);
      });
    return c;
  };
}, be = (n, t) => {
  const { config: e, log: s, slonik: r } = t;
  return async (a) => {
    const o = a.options.req.original, d = o.headers.referer || o.headers.origin || o.hostname, i = A(d), { admin: c, www: m } = g(o.config).reserved;
    if (a.userContext.roles = m.enabled && (m.slugs.some(
      (f) => `${f}.${o.config.multiTenant.rootDomain}` === i
    ) || m.domains.includes(i)) ? [I] : [o.config.user.role || D], c.enabled && (c.slugs.some(
      (f) => `${f}.${o.config.multiTenant.rootDomain}` === i
    ) || c.domains.includes(i)))
      throw {
        name: "SIGN_UP_FAILED",
        message: "Admin signUp is not allowed",
        statusCode: 403
      };
    if (a.userContext.tenant = o.tenant, n.thirdPartySignInUpPOST === void 0)
      throw new Error("Should never come here");
    const u = await n.thirdPartySignInUpPOST(a);
    if (u.status === "OK") {
      const E = await v(e, r, o.tenant).findById(u.user.id);
      return E ? {
        ...u,
        user: {
          ...u.user,
          ...E
        }
      } : (s.error(
        `User record not found for userId ${u.user.id}`
      ), {
        status: "GENERAL_ERROR",
        message: "Something went wrong"
      });
    }
    return u;
  };
}, Re = {
  sendEmail: ce
}, Ce = {
  override: {
    apis: {
      refreshPOST: ge,
      verifySession: me
    },
    functions: {
      createNewSession: ue
    }
  }
}, Oe = {
  override: {
    apis: {
      emailPasswordSignInPOST: he,
      emailPasswordSignUpPOST: pe,
      generatePasswordResetTokenPOST: Ie,
      thirdPartySignInUpPOST: be
    },
    functions: {
      emailPasswordSignIn: fe,
      emailPasswordSignUp: we,
      getUserById: Te,
      resetPasswordUsingToken: Ee,
      thirdPartySignInUp: ve
    }
  },
  sendEmail: ye
}, Pe = {
  emailVerification: Re,
  thirdPartyEmailPassword: Oe,
  session: Ce
}, x = (n) => {
  const t = g(n).reserved;
  let e = [];
  for (const [, s] of Object.entries(t))
    s.enabled && (e = [...e, ...s.domains]);
  return e;
}, k = (n) => {
  const t = g(n).reserved;
  let e = [];
  for (const [, s] of Object.entries(t))
    s.enabled && (e = [...e, ...s.slugs]);
  return e;
};
class _e extends ee {
  /* eslint-enabled */
  fieldMappings = new Map(
    Object.entries({
      domain: "domain",
      id: "id",
      name: "name",
      ownerId: "owner_id",
      slug: "slug"
    })
  );
  constructor(t) {
    super(t), this.init();
  }
  getAllWithAliasesSql = (t) => {
    const e = [];
    for (const i of t)
      i != "host" && e.push(l.fragment`${this.getAliasedField(i)}`);
    const s = b(this.table, this.schema), r = l.identifier([this.getMappedField("domain")]), a = l.identifier([this.getMappedField("slug")]), o = this.config.multiTenant.rootDomain, d = t.includes("host") ? l.fragment`,
          CASE
            WHEN ${r} IS NOT NULL THEN ${r}
            ELSE CONCAT(${a}, ${"." + o}::TEXT)
          END AS host
        ` : l.fragment``;
    return l.type(h.any())`
      SELECT ${l.join(e, l.fragment`, `)}
        ${d}
      FROM ${this.getTableFragment()}
      ${R(this.filterWithOwnerId(), s)}
      ORDER BY ${l.identifier([
      T.decamelize(this.getMappedField("id"))
    ])} ASC;
    `;
  };
  getCountSql = (t) => {
    const e = b(this.table, this.schema), s = h.object({
      count: h.number()
    });
    return l.type(s)`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()}
      ${R(this.filterWithOwnerId(t), e)};
    `;
  };
  getCreateSql = (t) => {
    const e = [], s = [];
    for (const r in t) {
      const a = r, o = t[a];
      e.push(
        l.identifier([T.decamelize(this.getMappedField(a))])
      ), s.push(o);
    }
    return l.type(h.any())`
      INSERT INTO ${this.getTableFragment()}
        (${l.join(e, l.fragment`, `)})
      VALUES (${l.join(s, l.fragment`, `)})
      RETURNING *;
    `;
  };
  getFindByHostnameSql = (t, e) => l.type(h.any())`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE ${l.identifier([
    T.decamelize(this.getMappedField("domain"))
  ])} = ${t}
      OR (
        ${l.identifier([T.decamelize(this.getMappedField("slug"))])}
        || '.' ||
        ${e}
      ) = ${t};
    `;
  getFindByIdSql = (t) => {
    const e = {
      key: this.getMappedField("id"),
      operator: "eq",
      value: t
    }, s = b(this.table, this.schema);
    return l.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${R(this.filterWithOwnerId(e), s)}
    `;
  };
  getFindBySlugOrDomainSql = (t, e) => {
    const s = l.identifier([this.getMappedField("domain")]), r = l.identifier([this.getMappedField("slug")]), a = e ? l.fragment`
        OR ${s} = ${e}
      ` : l.fragment``;
    return l.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE
      ${r} = ${t}
      ${a};
    `;
  };
  getListSql = (t, e, s, r) => {
    const a = b(this.table, this.schema);
    return l.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${R(this.filterWithOwnerId(s), a)}
      ${te(a, this.getSortInput(r))}
      ${ne(t, e)};
    `;
  };
  getAliasedField = (t) => {
    const e = this.getMappedField(t);
    return e === t ? l.identifier([T.decamelize(t)]) : l.join(
      [l.identifier([T.decamelize(e)]), l.identifier([t])],
      l.fragment` AS `
    );
  };
  getMappedField = (t) => this.fieldMappings.has(t) ? this.fieldMappings.get(t) : t;
  init() {
    const t = this.config.multiTenant?.table?.columns;
    if (t)
      for (const e in t) {
        const s = e;
        this.fieldMappings.set(s, t[s]);
      }
  }
  filterWithOwnerId(t) {
    if (this.ownerId) {
      const e = {
        key: this.getMappedField("ownerId"),
        operator: "eq",
        value: this.ownerId
      };
      return t ? { AND: [e, t] } : e;
    }
    return t;
  }
  get ownerId() {
    return this.service.ownerId;
  }
}
const M = (n) => {
  let t = {
    database: n.db.databaseName,
    user: n.db.username,
    password: n.db.password,
    host: n.db.host,
    port: n.db.port
  };
  return n.clientConfiguration?.ssl && (t = {
    ...t,
    ssl: n.clientConfiguration?.ssl
  }), t;
}, q = async (n, t) => {
  await n.query(
    `
      CREATE SCHEMA IF NOT EXISTS ${t};
      SET search_path TO ${t};
    `
  );
}, V = async (n) => {
  const t = new ie.Client(n);
  return await t.connect(), t;
}, W = async (n, t, e) => {
  if (!L(t))
    return !1;
  const s = "client" in n ? n.client : (
    // DU [2023-JAN-06] This smells
    await V(n)
  );
  return await q(s, e.slug), await oe({ client: s }, t), "client" in n || await s.end(), !0;
}, N = h.optional(
  h.string().max(255).regex(/^([\da-z]([\da-z-]{0,61}[\da-z])?\.)+[a-z]{2,}$/)
), B = h.string().regex(/^(?!.*-+$)[a-z][\da-z-]{0,61}([\da-z])?$/), H = (n, t) => {
  const e = g(n).table.columns, s = {
    slug: t[e.slug],
    domain: t[e.domain]
  }, a = h.object({
    slug: B,
    domain: N
  }).safeParse(s);
  if (!a.success)
    throw a.error.issues.some((o) => o.path.includes("slug")) ? {
      name: "ERROR_INVALID_SLUG",
      message: "Invalid slug",
      statusCode: 422
    } : {
      name: "ERROR_INVALID_DOMAIN",
      message: "Invalid domain",
      statusCode: 422
    };
}, Ae = (n, t) => {
  const e = g(n).table.columns, s = {
    domain: t[e.domain]
  };
  if (!h.object({
    domain: N
  }).safeParse(s).success)
    throw {
      name: "ERROR_INVALID_DOMAIN",
      message: "Invalid domain",
      statusCode: 422
    };
}, st = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  domainSchema: N,
  slugSchema: B,
  validateTenantInput: H,
  validateTenantUpdate: Ae
}, Symbol.toStringTag, { value: "Module" }));
class w extends se {
  _ownerId = void 0;
  all = async (t) => {
    const e = this.factory.getAllWithAliasesSql(t);
    return await this.database.connect((r) => r.any(e));
  };
  create = async (t) => {
    const e = g(this.config), { slug: s, domain: r } = e.table.columns;
    if (t[r] === "" && delete t[r], H(this.config, t), k(this.config).includes(t[s]))
      throw {
        name: "ERROR_RESERVED_SLUG",
        message: `The requested ${s} "${t[s]}" is reserved and cannot be used`,
        statusCode: 422
      };
    if (x(this.config).includes(t[r]))
      throw {
        name: "ERROR_RESERVED_DOMAIN",
        message: `The requested ${r} "${t[r]}" is reserved and cannot be used`,
        statusCode: 422
      };
    await this.validateSlugOrDomain(
      t[s],
      t[r]
    );
    const a = this.factory.getCreateSql(t), o = await this.database.connect(async (d) => d.query(a).then((i) => i.rows[0]));
    return o ? this.postCreate(o) : void 0;
  };
  findByHostname = async (t) => {
    const e = this.factory.getFindByHostnameSql(
      t,
      this.config.multiTenant.rootDomain
    );
    return await this.database.connect(async (r) => r.maybeOne(e));
  };
  validateSlugOrDomain = async (t, e) => {
    const s = this.factory.getFindBySlugOrDomainSql(t, e), r = await this.database.connect(async (a) => a.any(s));
    if (r.length > 0) {
      const a = g(this.config), { slug: o, domain: d } = a.table.columns;
      throw r.some((i) => i[o] === t) ? {
        name: "ERROR_SLUG_ALREADY_EXISTS",
        message: `The specified ${o} "${t}" already exits`,
        statusCode: 422
      } : {
        name: "ERROR_DOMAIN_ALREADY_EXISTS",
        message: `The specified ${d} "${e}" already exits`,
        statusCode: 422
      };
    }
  };
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new _e(this)), this._factory;
  }
  get sortKey() {
    return this.config.multiTenant.table?.columns?.id || super.sortKey;
  }
  get ownerId() {
    return this._ownerId;
  }
  set ownerId(t) {
    this._ownerId = t;
  }
  get table() {
    return this.config.multiTenant?.table?.name || "tenants";
  }
  postCreate = async (t) => {
    const e = g(this.config);
    return await W(
      M(this.config.slonik),
      e.migrations.path,
      t
    ), t;
  };
}
const Ne = async (n, t, e) => {
  if (x(n).includes(e) || k(n).some(
    (a) => `${a}.${n.multiTenant.rootDomain}` === e
  ))
    return null;
  const r = await new w(n, t).findByHostname(e);
  if (r)
    return r;
  throw new Error("Tenant not found");
}, Ue = async (n, t, e) => {
  n.addHook(
    "preHandler",
    async (s, r) => {
      const a = s.headers.referer || s.headers.origin || s.hostname, { config: o, slonik: d } = s;
      try {
        const i = await Ne(o, d, A(a));
        i && (s.tenant = i, s.dbSchema = i[g(o).table.columns.slug]);
      } catch (i) {
        return n.log.error(i), r.status(404).send({ error: { message: "Tenant not found" } });
      }
    }
  ), e();
}, Fe = _(Ue), $e = async (n, t, e) => {
  n.log.info("Registering fastify-multi-tenant plugin"), await n.register(Fe);
  const { config: s } = n, r = { recipes: Pe };
  s.user.supertokens = j(r, s.user.supertokens), n.addHook("onReady", async () => {
    await de();
  }), e();
}, De = _($e);
De.updateContext = le;
const Le = async (n, t, e) => {
  try {
    const { config: s, slonik: r } = n, a = M(s.slonik), d = g(s).migrations.path;
    if (L(d)) {
      const c = await new w(s, r).all(["name", "slug"]), m = await V(a);
      for (const u of c)
        n.log.info(`Running migrations for tenant ${u.name}`), await W({ client: m }, d, u);
      await q(m, "public"), await m.end();
    } else
      n.log.warn(
        `Tenant migrations path '${d}' does not exists.`
      );
  } catch (s) {
    throw n.log.error("🔴 multi-tenant: Failed to run tenant migrations"), s;
  }
  e();
}, rt = _(Le), xe = {
  createTenant: async (n, t, e) => {
    if (e.tenant)
      return new p.ErrorWithProps(
        "Tenant app cannot be used to create tenant",
        void 0,
        403
      );
    const s = e.user?.id;
    if (s) {
      const r = t.data, a = g(e.config);
      return r[a.table.columns.ownerId] = s, await new w(
        e.config,
        e.database,
        e.dbSchema
      ).create(r).catch((d) => new p.ErrorWithProps(
        d.message,
        void 0,
        d.statusCode
      ));
    } else {
      e.app.log.error(
        "Could not able to get user id from mercurius context"
      );
      const r = new p.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return r.statusCode = 500, r;
    }
  }
}, ke = {
  allTenants: async (n, t, e) => {
    if (e.tenant)
      return new p.ErrorWithProps(
        "Tenant app cannot display all tenants",
        void 0,
        403
      );
    const s = e.user?.id;
    if (!s)
      return new p.ErrorWithProps(
        "Oops, Something went wrong",
        void 0,
        500
      );
    const r = new w(
      e.config,
      e.database,
      e.dbSchema
    ), { roles: a } = await S.getRolesForUser(s);
    return a.includes(I) && (r.ownerId = s), await r.all(JSON.parse(JSON.stringify(t.fields)));
  },
  tenant: async (n, t, e) => {
    if (e.tenant)
      return new p.ErrorWithProps(
        "Tenant app cannot retrieve tenant information",
        void 0,
        403
      );
    const s = e.user?.id;
    if (!s)
      return new p.ErrorWithProps(
        "Oops, Something went wrong",
        void 0,
        500
      );
    const r = new w(
      e.config,
      e.database,
      e.dbSchema
    ), { roles: a } = await S.getRolesForUser(s);
    return a.includes(I) && (r.ownerId = s), await r.findById(t.id);
  },
  tenants: async (n, t, e) => {
    if (e.tenant)
      return new p.ErrorWithProps(
        "Tenant app cannot display a list of tenants",
        void 0,
        403
      );
    const s = e.user?.id;
    if (!s)
      return new p.ErrorWithProps(
        "Oops, Something went wrong",
        void 0,
        500
      );
    const r = new w(
      e.config,
      e.database,
      e.dbSchema
    ), { roles: a } = await S.getRolesForUser(s);
    return a.includes(I) && (r.ownerId = s), await r.list(
      t.limit,
      t.offset,
      t.filters ? JSON.parse(JSON.stringify(t.filters)) : void 0,
      t.sort ? JSON.parse(JSON.stringify(t.sort)) : void 0
    );
  }
}, at = { Mutation: xe, Query: ke }, Me = async (n, t) => {
  if (n.tenant)
    throw {
      name: "GET_ALL_TENANTS_FAILED",
      message: "Tenant app cannot display all tenants",
      statusCode: 403
    };
  const e = n.session?.getUserId();
  if (!e)
    throw n.log.error("could not get user id from session"), new Error("Oops, Something went wrong");
  const s = new w(n.config, n.slonik, n.dbSchema), { roles: r } = await S.getRolesForUser(e);
  r.includes(I) && (s.ownerId = e);
  const { fields: a } = n.query, o = await s.all(JSON.parse(a));
  t.send(o);
}, qe = async (n, t) => {
  if (n.tenant)
    throw {
      name: "CREATE_TENANT_FAILED",
      message: "Tenant app cannot be used to create tenant",
      statusCode: 403
    };
  const e = n.session?.getUserId();
  if (e) {
    const s = n.body, r = g(n.config);
    s[r.table.columns.ownerId] = e;
    const o = await new w(n.config, n.slonik).create(s);
    t.send(o);
  } else
    throw n.log.error("could not get user id from session"), new Error("Oops, Something went wrong");
}, Ve = async (n, t) => {
  if (n.tenant)
    throw {
      name: "GET_TENANT_FAILED",
      message: "Tenant app cannot retrieve tenant information",
      statusCode: 403
    };
  const e = n.session?.getUserId();
  if (!e)
    throw n.log.error("could not get user id from session"), new Error("Oops, Something went wrong");
  const s = new w(n.config, n.slonik, n.dbSchema), { roles: r } = await S.getRolesForUser(e);
  r.includes(I) && (s.ownerId = e);
  const { id: a } = n.params, o = await s.findById(a);
  t.send(o);
}, We = async (n, t) => {
  if (n.tenant)
    throw {
      name: "LIST_TENANTS_FAILED",
      message: "Tenant app cannot display a list of tenants",
      statusCode: 403
    };
  const e = n.session?.getUserId();
  if (!e)
    throw n.log.error("could not get user id from session"), new Error("Oops, Something went wrong");
  const s = new w(n.config, n.slonik, n.dbSchema), { roles: r } = await S.getRolesForUser(e);
  r.includes(I) && (s.ownerId = e);
  const { limit: a, offset: o, filters: d, sort: i } = n.query, c = await s.list(
    a,
    o,
    d ? JSON.parse(d) : void 0,
    i ? JSON.parse(i) : void 0
  );
  t.send(c);
}, C = { all: Me, create: qe, tenant: Ve, tenants: We }, ot = async (n, t, e) => {
  n.get(
    "/tenants/all",
    {
      preHandler: n.verifySession()
    },
    C.all
  ), n.get(
    "/tenants",
    {
      preHandler: n.verifySession()
    },
    C.tenants
  ), n.get(
    "/tenants/:id(^\\d+)",
    {
      preHandler: n.verifySession()
    },
    C.tenant
  ), n.post(
    "/tenants",
    {
      preHandler: n.verifySession()
    },
    C.create
  ), e();
};
export {
  w as TenantService,
  De as default,
  rt as tenantMigrationPlugin,
  at as tenantResolver,
  ot as tenantRoutes,
  Pe as thirdPartyEmailPassword,
  st as validateTenantSchema
};

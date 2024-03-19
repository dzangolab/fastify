import "@dzangolab/fastify-config";
import I from "mercurius";
import U from "fastify-plugin";
import K from "lodash.merge";
import p from "supertokens-node/recipe/userroles";
import { getUserService as J, TENANT_ID as f, getOrigin as D, EMAIL_VERIFICATION_PATH as X, sendEmail as R, areRolesExist as L, verifyEmail as Y, ROLE_USER as k, RESET_PASSWORD_PATH as Q } from "@dzangolab/fastify-user";
import { wrapResponse as Z } from "supertokens-node/framework/fastify";
import ee from "supertokens-node/recipe/session";
import { formatDate as x, DefaultSqlFactory as te, createTableIdentifier as C, createFilterFragment as P, createSortFragment as ne, createLimitFragment as se, BaseService as re } from "@dzangolab/fastify-slonik";
import { deleteUser as F } from "supertokens-node";
import $ from "supertokens-node/recipe/emailverification";
import { getUserById as ae, getUserByThirdPartyInfo as oe } from "supertokens-node/recipe/thirdpartyemailpassword";
import E from "humps";
import { sql as l } from "slonik";
import { z as h } from "zod";
import { existsSync as M } from "node:fs";
import { migrate as ie } from "@dzangolab/postgres-migrations";
import * as de from "pg";
const y = "TENANT_OWNER", le = async () => {
  await p.createNewRoleOrAddPermissions(y, []);
}, m = (n) => {
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
}, b = (n, t, e) => {
  const s = m(n), a = e ? e[s.table.columns.slug] : "";
  return J(n, t, a);
}, ce = async (n, t, e) => {
  const { config: s, slonik: a, tenant: r } = t;
  n.tenant = r;
  const d = (await ee.getSession(t, Z(e), {
    sessionRequired: !1
  }))?.getUserId();
  if (d && !n.user) {
    const i = b(s, a, r);
    let c;
    try {
      c = await i.findById(d);
    } catch {
    }
    if (!c)
      throw new Error("Unable to find user");
    const { roles: g } = await p.getRolesForUser(f, d);
    n.user = c, n.roles = g;
  }
}, v = {
  addTenantPrefix: (n, t, e) => (e && (t = e[m(n).table.columns.id] + "_" + t), t),
  removeTenantPrefix: (n, t, e) => (e && e[m(n).table.columns.id] == t.slice(0, Math.max(0, Math.max(0, t.indexOf("_")))) && (t = t.slice(Math.max(0, t.indexOf("_") + 1))), t)
}, ue = (n, t) => {
  const e = t.config.appOrigin[0];
  return async (s) => {
    let a;
    try {
      const r = s.userContext._default.request.request;
      try {
        const i = r.headers.referer || r.headers.origin || r.hostname;
        a = D(i) || e;
      } catch {
        a = e;
      }
      const o = s.emailVerifyLink.replace(
        e + "/auth/verify-email",
        a + (t.config.user.supertokens.emailVerificationPath || X)
      );
      let d = s.user.email;
      r.tenant && (d = v.removeTenantPrefix(r.config, d, r.tenant)), R({
        fastify: t,
        subject: "Email Verification",
        templateName: "email-verification",
        to: d,
        templateData: {
          emailVerifyLink: o
        }
      });
    } catch (r) {
      r instanceof Error && t.log.error(r.message);
    }
  };
}, me = (n, t) => async (e) => {
  if (n.createNewSession === void 0)
    throw new Error("Should never come here");
  const s = e.userContext.tenant;
  if (s) {
    const i = e.userContext._default.request.request, c = m(i.config);
    e.accessTokenPayload = {
      ...e.accessTokenPayload,
      tenantId: s[c.table.columns.id]
    };
  }
  const a = await n.createNewSession(
    e
  ), r = a.getUserId();
  if ((await b(t.config, t.slonik, s).findById(r))?.disabled)
    throw await a.revokeSession(), {
      name: "SIGN_IN_FAILED",
      message: "user is disabled",
      statusCode: 401
    };
  return a;
}, ge = (n, t) => async (e) => {
  if (n.verifySession === void 0)
    throw new Error("Should never come here");
  const s = await n.verifySession(e);
  if (s) {
    const a = s.getUserId(), r = e.userContext._default.request.request, o = s.getAccessTokenPayload().tenantId;
    if (r.tenant) {
      const c = m(r.config);
      if (o != r.tenant[c.table.columns.id])
        throw {
          name: "SESSION_VERIFICATION_FAILED",
          message: "invalid session",
          statusCode: 401
        };
    }
    if ((await b(
      t.config,
      t.slonik,
      r.tenant
    ).findById(a))?.disabled)
      throw await s.revokeSession(), {
        name: "SESSION_VERIFICATION_FAILED",
        message: "user is disabled",
        statusCode: 401
      };
  }
  return s;
}, fe = (n, t) => async (e) => {
  if (n.refreshPOST === void 0)
    throw new Error("Should never come here");
  const s = await n.refreshPOST(e);
  if (s) {
    const a = e.userContext._default.request.request, r = s.getAccessTokenPayload().tenantId;
    if (a.tenant) {
      const o = m(a.config);
      if (r != a.tenant[o.table.columns.id])
        throw {
          name: "SESSION_VERIFICATION_FAILED",
          message: "invalid session",
          statusCode: 401
        };
    }
  }
  return s;
}, we = (n, t) => {
  const { config: e, log: s, slonik: a } = t;
  return async (r) => {
    r.email = v.addTenantPrefix(
      e,
      r.email,
      r.userContext.tenant
    );
    const o = await n.emailPasswordSignIn(
      r
    );
    if (o.status !== "OK")
      return o;
    const d = b(
      e,
      a,
      r.userContext.dbSchema
    ), i = await d.findById(o.user.id);
    return i ? (i.lastLoginAt = Date.now(), await d.update(i.id, {
      lastLoginAt: x(new Date(i.lastLoginAt))
    }).catch((g) => {
      s.error(
        `Unable to update lastLoginAt for userId ${o.user.id}`
      ), s.error(g);
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
}, pe = (n, t) => {
  const { config: e, log: s, slonik: a } = t;
  return async (r) => {
    const o = r.userContext.roles || [];
    if (!await L(o))
      throw s.error(`At least one role from ${o.join(", ")} does not exist.`), {
        name: "SIGN_UP_FAILED",
        message: "Something went wrong",
        statusCode: 500
      };
    const d = r.email;
    r.email = v.addTenantPrefix(
      e,
      d,
      r.userContext.tenant
    );
    const i = await n.emailPasswordSignUp(
      r
    );
    if (i.status === "OK") {
      const c = b(
        e,
        a,
        r.userContext.tenant
      );
      let g;
      try {
        if (g = await c.create({
          id: i.user.id,
          email: d
        }), !g)
          throw new Error("User not found");
      } catch (u) {
        throw s.error("Error while creating user"), s.error(u), await F(i.user.id), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      }
      g.roles = o, i.user = {
        ...i.user,
        ...g
      };
      for (const u of o) {
        const w = await p.addRoleToUser(
          f,
          i.user.id,
          u
        );
        w.status !== "OK" && s.error(w.status);
      }
      if (e.user.features?.signUp?.emailVerification)
        try {
          if (r.userContext.autoVerifyEmail)
            await Y(g.id);
          else {
            const u = await $.createEmailVerificationToken(
              f,
              i.user.id
            );
            u.status === "OK" && await $.sendEmail({
              tenantId: f,
              type: "EMAIL_VERIFICATION",
              user: {
                id: i.user.id,
                email: r.email
              },
              emailVerifyLink: `${e.appOrigin[0]}/auth/verify-email?token=${u.token}&rid=emailverification`,
              userContext: r.userContext
            });
          }
        } catch (u) {
          s.error(u);
        }
    }
    if (e.user.supertokens.sendUserAlreadyExistsWarning && i.status === "EMAIL_ALREADY_EXISTS_ERROR")
      try {
        R({
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
}, N = (n) => {
  let t;
  try {
    if (t = new URL(n).host, !t)
      throw new Error("Host is empty");
  } catch {
    t = n;
  }
  return t;
}, Se = (n, t) => async (e) => {
  const s = e.options.req.original, a = s.headers.referer || s.headers.origin || s.hostname, r = N(a), { admin: o, www: d } = m(s.config).reserved;
  if (e.userContext.roles = d.enabled && (d.slugs.some(
    (i) => `${i}.${s.config.multiTenant.rootDomain}` === r
  ) || d.domains.includes(r)) ? [y] : [s.config.user.role || k], o.enabled && (o.slugs.some(
    (i) => `${i}.${s.config.multiTenant.rootDomain}` === r
  ) || o.domains.includes(r)))
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
}, Te = (n, t, e) => (e && t.find((s) => {
  s.id === "email" && (s.value = e[m(n).table.columns.id] + "_" + s.value);
}), t), Ie = (n, t) => async (e) => {
  if (e.userContext.tenant = e.options.req.original.tenant, n.generatePasswordResetTokenPOST === void 0)
    throw new Error("Should never come here");
  return e.formFields = Te(
    t.config,
    e.formFields,
    e.userContext.tenant
  ), await n.generatePasswordResetTokenPOST(e);
}, ye = (n, t) => async (e) => {
  let s = await n.getUserById(e);
  return s && e.userContext && e.userContext.tenant && (s = {
    ...s,
    email: v.removeTenantPrefix(
      t.config,
      s.email,
      e.userContext.tenant
    )
  }), s;
}, Ee = (n, t) => async (e) => {
  const s = await n.resetPasswordUsingToken(e);
  if (s.status === "OK" && s.userId) {
    const a = await ae(s.userId, {
      tenant: e.userContext._default.request.request.tenant
    });
    a && R({
      fastify: t,
      subject: "Reset Password Notification",
      templateName: "reset-password-notification",
      to: a.email,
      templateData: {
        emailId: a.email
      }
    });
  }
  return s;
}, be = (n, t) => {
  const e = t.config.appOrigin[0];
  return async (s) => {
    const a = s.userContext._default.request.request, r = a.headers.referer || a.headers.origin || a.hostname, o = D(r) || e, d = s.passwordResetLink.replace(
      e + "/auth/reset-password",
      o + (t.config.user.supertokens.resetPasswordPath || Q)
    );
    R({
      fastify: t,
      subject: "Reset Password",
      templateName: "reset-password",
      to: v.removeTenantPrefix(
        a.config,
        s.user.email,
        s.userContext.tenant
      ),
      templateData: {
        passwordResetLink: d
      }
    });
  };
}, ve = (n, t) => {
  const { config: e, log: s } = t;
  return async (a) => {
    const r = a.userContext.roles || [], o = a.userContext.tenant;
    if (o) {
      const c = o[m(e).table.columns.id];
      a.thirdPartyUserId = c + "_" + a.thirdPartyUserId;
    }
    if (!await oe(
      a.tenantId,
      a.thirdPartyId,
      a.thirdPartyUserId,
      a.userContext
    ) && e.user.features?.signUp?.enabled === !1)
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404
      };
    const i = await n.thirdPartySignInUp(
      a
    );
    if (i.status === "OK" && i.createdNewUser) {
      if (!await L(r))
        throw await F(i.user.id), s.error(`At least one role from ${r.join(", ")} does not exist.`), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      for (const c of r) {
        const g = await p.addRoleToUser(
          f,
          i.user.id,
          c
        );
        g.status !== "OK" && s.error(g.status);
      }
    }
    return i;
  };
}, Ce = (n, t) => {
  const { config: e, log: s, slonik: a } = t;
  return async (r) => {
    const o = r.options.req.original, d = o.headers.referer || o.headers.origin || o.hostname, i = N(d), { admin: c, www: g } = m(o.config).reserved;
    if (r.userContext.roles = g.enabled && (g.slugs.some(
      (w) => `${w}.${o.config.multiTenant.rootDomain}` === i
    ) || g.domains.includes(i)) ? [y] : [o.config.user.role || k], c.enabled && (c.slugs.some(
      (w) => `${w}.${o.config.multiTenant.rootDomain}` === i
    ) || c.domains.includes(i)))
      throw {
        name: "SIGN_UP_FAILED",
        message: "Admin signUp is not allowed",
        statusCode: 403
      };
    if (r.userContext.tenant = o.tenant, n.thirdPartySignInUpPOST === void 0)
      throw new Error("Should never come here");
    const u = await n.thirdPartySignInUpPOST(r);
    if (u.status === "OK") {
      const w = b(
        e,
        a,
        r.userContext.tenant
      );
      let T;
      if (u.createdNewUser)
        try {
          if (T = await w.create({
            id: u.user.id,
            email: u.user.email
          }), !T)
            throw new Error("User not found");
          T.roles = r.userContext.roles;
        } catch (A) {
          throw s.error("Error while creating user"), s.error(A), await F(u.user.id), {
            name: "SIGN_UP_FAILED",
            message: "Something went wrong",
            statusCode: 500
          };
        }
      else {
        if (T = await w.findById(u.user.id), !T)
          return s.error(
            `User record not found for userId ${u.user.id}`
          ), {
            status: "GENERAL_ERROR",
            message: "Something went wrong"
          };
        T.lastLoginAt = Date.now(), await w.update(T.id, {
          lastLoginAt: x(new Date(T.lastLoginAt))
        }).catch((A) => {
          s.error(
            `Unable to update lastLoginAt for userId ${u.user.id}`
          ), s.error(A);
        });
      }
      return {
        ...u,
        user: {
          ...u.user,
          ...T
        }
      };
    }
    return u;
  };
}, Pe = {
  sendEmail: ue
}, Oe = {
  override: {
    apis: {
      refreshPOST: fe,
      verifySession: ge
    },
    functions: {
      createNewSession: me
    }
  }
}, Re = {
  override: {
    apis: {
      emailPasswordSignInPOST: he,
      emailPasswordSignUpPOST: Se,
      generatePasswordResetTokenPOST: Ie,
      thirdPartySignInUpPOST: Ce
    },
    functions: {
      emailPasswordSignIn: we,
      emailPasswordSignUp: pe,
      getUserById: ye,
      resetPasswordUsingToken: Ee,
      thirdPartySignInUp: ve
    }
  },
  sendEmail: be
}, Ae = {
  emailVerification: Pe,
  thirdPartyEmailPassword: Re,
  session: Oe
}, W = (n) => {
  const t = m(n).reserved;
  let e = [];
  for (const [, s] of Object.entries(t))
    s.enabled && (e = [...e, ...s.domains]);
  return e;
}, q = (n) => {
  const t = m(n).reserved;
  let e = [];
  for (const [, s] of Object.entries(t))
    s.enabled && (e = [...e, ...s.slugs]);
  return e;
};
class Ue extends te {
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
    const s = C(this.table, this.schema), a = l.identifier([this.getMappedField("domain")]), r = l.identifier([this.getMappedField("slug")]), o = this.config.multiTenant.rootDomain, d = t.includes("host") ? l.fragment`,
          CASE
            WHEN ${a} IS NOT NULL THEN ${a}
            ELSE CONCAT(${r}, ${"." + o}::TEXT)
          END AS host
        ` : l.fragment``;
    return l.type(h.any())`
      SELECT ${l.join(e, l.fragment`, `)}
        ${d}
      FROM ${this.getTableFragment()}
      ${P(this.filterWithOwnerId(), s)}
      ORDER BY ${l.identifier([
      E.decamelize(this.getMappedField("id"))
    ])} ASC;
    `;
  };
  getCountSql = (t) => {
    const e = C(this.table, this.schema), s = h.object({
      count: h.number()
    });
    return l.type(s)`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()}
      ${P(this.filterWithOwnerId(t), e)};
    `;
  };
  getCreateSql = (t) => {
    const e = [], s = [];
    for (const a in t) {
      const r = a, o = t[r];
      e.push(
        l.identifier([E.decamelize(this.getMappedField(r))])
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
    E.decamelize(this.getMappedField("domain"))
  ])} = ${t}
      OR (
        ${l.identifier([E.decamelize(this.getMappedField("slug"))])}
        || '.' ||
        ${e}
      ) = ${t};
    `;
  getFindByIdSql = (t) => {
    const e = {
      key: this.getMappedField("id"),
      operator: "eq",
      value: t
    }, s = C(this.table, this.schema);
    return l.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${P(this.filterWithOwnerId(e), s)}
    `;
  };
  getFindBySlugOrDomainSql = (t, e) => {
    const s = l.identifier([this.getMappedField("domain")]), a = l.identifier([this.getMappedField("slug")]), r = e ? l.fragment`
        OR ${s} = ${e}
      ` : l.fragment``;
    return l.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE
      ${a} = ${t}
      ${r};
    `;
  };
  getListSql = (t, e, s, a) => {
    const r = C(this.table, this.schema);
    return l.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${P(this.filterWithOwnerId(s), r)}
      ${ne(r, this.getSortInput(a))}
      ${se(t, e)};
    `;
  };
  getAliasedField = (t) => {
    const e = this.getMappedField(t);
    return e === t ? l.identifier([E.decamelize(t)]) : l.join(
      [l.identifier([E.decamelize(e)]), l.identifier([t])],
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
const B = (n) => {
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
}, H = async (n, t) => {
  await n.query(
    `
      CREATE SCHEMA IF NOT EXISTS ${t};
      SET search_path TO ${t};
    `
  );
}, V = async (n) => {
  const t = new de.Client(n);
  return await t.connect(), t;
}, j = async (n, t, e) => {
  if (!M(t))
    return !1;
  const s = "client" in n ? n.client : (
    // DU [2023-JAN-06] This smells
    await V(n)
  );
  return await H(s, e.slug), await ie({ client: s }, t), "client" in n || await s.end(), !0;
}, _ = h.optional(
  h.string().max(255).regex(/^([\da-z]([\da-z-]{0,61}[\da-z])?\.)+[a-z]{2,}$/)
), z = h.string().regex(/^(?!.*-+$)[a-z][\da-z-]{0,61}([\da-z])?$/), G = (n, t) => {
  const e = m(n).table.columns, s = {
    slug: t[e.slug],
    domain: t[e.domain]
  }, r = h.object({
    slug: z,
    domain: _
  }).safeParse(s);
  if (!r.success)
    throw {
      message: r.error.issues[0].message,
      issues: r.error.issues,
      statusCode: 422
    };
}, Fe = (n, t) => {
  const e = m(n).table.columns, s = {
    domain: t[e.domain]
  }, r = h.object({
    domain: _
  }).safeParse(s);
  if (!r.success)
    throw {
      message: r.error.issues[0].message,
      issues: r.error.issues,
      statusCode: 422
    };
}, it = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  domainSchema: _,
  slugSchema: z,
  validateTenantInput: G,
  validateTenantUpdate: Fe
}, Symbol.toStringTag, { value: "Module" }));
class S extends re {
  _ownerId = void 0;
  all = async (t) => {
    const e = this.factory.getAllWithAliasesSql(t);
    return await this.database.connect((a) => a.any(e));
  };
  create = async (t) => {
    const e = m(this.config), { slug: s, domain: a } = e.table.columns;
    if (t[a] === "" && delete t[a], G(this.config, t), q(this.config).includes(t[s]))
      throw {
        name: "CREATE_TENANT_FAILED",
        message: `The requested ${s} "${t[s]}" is reserved and cannot be used`,
        statusCode: 422
      };
    if (W(this.config).includes(t[a]))
      throw {
        name: "CREATE_TENANT_FAILED",
        message: `The requested ${a} "${t[a]}" is reserved and cannot be used`,
        statusCode: 422
      };
    await this.validateSlugOrDomain(
      t[s],
      t[a]
    );
    const r = this.factory.getCreateSql(t), o = await this.database.connect(async (d) => d.query(r).then((i) => i.rows[0]));
    return o ? this.postCreate(o) : void 0;
  };
  findByHostname = async (t) => {
    const e = this.factory.getFindByHostnameSql(
      t,
      this.config.multiTenant.rootDomain
    );
    return await this.database.connect(async (a) => a.maybeOne(e));
  };
  validateSlugOrDomain = async (t, e) => {
    const s = this.factory.getFindBySlugOrDomainSql(t, e);
    if ((await this.database.connect(async (r) => r.any(s))).length > 0) {
      const r = m(this.config), { slug: o, domain: d } = r.table.columns;
      throw {
        name: "FIELD_VALIDATION_FAILED",
        message: `The specified ${o} "${t}" or ${d} "${e}" already exits`,
        statusCode: 422
      };
    }
  };
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new Ue(this)), this._factory;
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
    const e = m(this.config);
    return await j(
      B(this.config.slonik),
      e.migrations.path,
      t
    ), t;
  };
}
const Ne = async (n, t, e) => {
  if (W(n).includes(e) || q(n).some(
    (r) => `${r}.${n.multiTenant.rootDomain}` === e
  ))
    return null;
  const a = await new S(n, t).findByHostname(e);
  if (a)
    return a;
  throw new Error("Tenant not found");
}, _e = async (n, t, e) => {
  n.addHook(
    "preHandler",
    async (s, a) => {
      const r = s.headers.referer || s.headers.origin || s.hostname, { config: o, slonik: d } = s;
      try {
        const i = await Ne(o, d, N(r));
        i && (s.tenant = i, s.dbSchema = i[m(o).table.columns.slug]);
      } catch (i) {
        return n.log.error(i), a.send({ error: { message: "Tenant not found" } });
      }
    }
  ), e();
}, $e = U(_e), De = async (n, t, e) => {
  n.log.info("Registering fastify-multi-tenant plugin"), await n.register($e);
  const { config: s } = n, a = { recipes: Ae };
  s.user.supertokens = K(a, s.user.supertokens), n.addHook("onReady", async () => {
    await le();
  }), e();
}, Le = U(De);
Le.updateContext = ce;
const ke = async (n, t, e) => {
  try {
    const { config: s, slonik: a } = n, r = B(s.slonik), d = m(s).migrations.path;
    if (M(d)) {
      const c = await new S(s, a).all(["name", "slug"]), g = await V(r);
      for (const u of c)
        n.log.info(`Running migrations for tenant ${u.name}`), await j({ client: g }, d, u);
      await H(g, "public"), await g.end();
    } else
      n.log.warn(
        `Tenant migrations path '${d}' does not exists.`
      );
  } catch (s) {
    throw n.log.error("🔴 multi-tenant: Failed to run tenant migrations"), s;
  }
  e();
}, dt = U(ke), xe = {
  createTenant: async (n, t, e) => {
    if (e.tenant)
      return new I.ErrorWithProps(
        "Tenant app cannot be used to create tenant",
        void 0,
        403
      );
    const s = e.user?.id;
    if (s) {
      const a = t.data, r = m(e.config);
      return a[r.table.columns.ownerId] = s, await new S(
        e.config,
        e.database,
        e.dbSchema
      ).create(a).catch((d) => new I.ErrorWithProps(
        d.message,
        void 0,
        d.statusCode
      ));
    } else {
      e.app.log.error(
        "Could not able to get user id from mercurius context"
      );
      const a = new I.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return a.statusCode = 500, a;
    }
  }
}, Me = {
  allTenants: async (n, t, e) => {
    if (e.tenant)
      return new I.ErrorWithProps(
        "Tenant app cannot display all tenants",
        void 0,
        403
      );
    const s = e.user?.id;
    if (!s)
      return new I.ErrorWithProps(
        "Oops, Something went wrong",
        void 0,
        500
      );
    const a = new S(
      e.config,
      e.database,
      e.dbSchema
    ), { roles: r } = await p.getRolesForUser(f, s);
    return r.includes(y) && (a.ownerId = s), await a.all(JSON.parse(JSON.stringify(t.fields)));
  },
  tenant: async (n, t, e) => {
    if (e.tenant)
      return new I.ErrorWithProps(
        "Tenant app cannot retrieve tenant information",
        void 0,
        403
      );
    const s = e.user?.id;
    if (!s)
      return new I.ErrorWithProps(
        "Oops, Something went wrong",
        void 0,
        500
      );
    const a = new S(
      e.config,
      e.database,
      e.dbSchema
    ), { roles: r } = await p.getRolesForUser(f, s);
    return r.includes(y) && (a.ownerId = s), await a.findById(t.id);
  },
  tenants: async (n, t, e) => {
    if (e.tenant)
      return new I.ErrorWithProps(
        "Tenant app cannot display a list of tenants",
        void 0,
        403
      );
    const s = e.user?.id;
    if (!s)
      return new I.ErrorWithProps(
        "Oops, Something went wrong",
        void 0,
        500
      );
    const a = new S(
      e.config,
      e.database,
      e.dbSchema
    ), { roles: r } = await p.getRolesForUser(f, s);
    return r.includes(y) && (a.ownerId = s), await a.list(
      t.limit,
      t.offset,
      t.filters ? JSON.parse(JSON.stringify(t.filters)) : void 0,
      t.sort ? JSON.parse(JSON.stringify(t.sort)) : void 0
    );
  }
}, lt = { Mutation: xe, Query: Me }, We = async (n, t) => {
  if (n.tenant)
    throw {
      name: "GET_ALL_TENANTS_FAILED",
      message: "Tenant app cannot display all tenants",
      statusCode: 403
    };
  const e = n.session?.getUserId();
  if (!e)
    throw n.log.error("could not get user id from session"), new Error("Oops, Something went wrong");
  const s = new S(n.config, n.slonik, n.dbSchema), { roles: a } = await p.getRolesForUser(f, e);
  a.includes(y) && (s.ownerId = e);
  const { fields: r } = n.query, o = await s.all(JSON.parse(r));
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
    const s = n.body, a = m(n.config);
    s[a.table.columns.ownerId] = e;
    const o = await new S(n.config, n.slonik).create(s);
    t.send(o);
  } else
    throw n.log.error("could not get user id from session"), new Error("Oops, Something went wrong");
}, Be = async (n, t) => {
  if (n.tenant)
    throw {
      name: "GET_TENANT_FAILED",
      message: "Tenant app cannot retrieve tenant information",
      statusCode: 403
    };
  const e = n.session?.getUserId();
  if (!e)
    throw n.log.error("could not get user id from session"), new Error("Oops, Something went wrong");
  const s = new S(n.config, n.slonik, n.dbSchema), { roles: a } = await p.getRolesForUser(f, e);
  a.includes(y) && (s.ownerId = e);
  const { id: r } = n.params, o = await s.findById(r);
  t.send(o);
}, He = async (n, t) => {
  if (n.tenant)
    throw {
      name: "LIST_TENANTS_FAILED",
      message: "Tenant app cannot display a list of tenants",
      statusCode: 403
    };
  const e = n.session?.getUserId();
  if (!e)
    throw n.log.error("could not get user id from session"), new Error("Oops, Something went wrong");
  const s = new S(n.config, n.slonik, n.dbSchema), { roles: a } = await p.getRolesForUser(f, e);
  a.includes(y) && (s.ownerId = e);
  const { limit: r, offset: o, filters: d, sort: i } = n.query, c = await s.list(
    r,
    o,
    d ? JSON.parse(d) : void 0,
    i ? JSON.parse(i) : void 0
  );
  t.send(c);
}, O = { all: We, create: qe, tenant: Be, tenants: He }, ct = async (n, t, e) => {
  n.get(
    "/tenants/all",
    {
      preHandler: n.verifySession()
    },
    O.all
  ), n.get(
    "/tenants",
    {
      preHandler: n.verifySession()
    },
    O.tenants
  ), n.get(
    "/tenants/:id(^\\d+)",
    {
      preHandler: n.verifySession()
    },
    O.tenant
  ), n.post(
    "/tenants",
    {
      preHandler: n.verifySession()
    },
    O.create
  ), e();
};
export {
  S as TenantService,
  Le as default,
  dt as tenantMigrationPlugin,
  lt as tenantResolver,
  ct as tenantRoutes,
  Ae as thirdPartyEmailPassword,
  it as validateTenantSchema
};

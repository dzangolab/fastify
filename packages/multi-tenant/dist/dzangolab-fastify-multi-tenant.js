import "@dzangolab/fastify-config";
import T from "mercurius";
import _ from "fastify-plugin";
import K from "lodash.merge";
import S from "supertokens-node/recipe/userroles";
import { getUserService as J, TENANT_ID as f, getOrigin as D, EMAIL_VERIFICATION_PATH as X, sendEmail as P, areRolesExist as L, verifyEmail as Y, ROLE_USER as k, RESET_PASSWORD_PATH as Q } from "@dzangolab/fastify-user";
import { wrapResponse as Z } from "supertokens-node/framework/fastify";
import ee from "supertokens-node/recipe/session";
import { formatDate as x, DefaultSqlFactory as te, createTableIdentifier as R, createFilterFragment as O, createSortFragment as ne, createLimitFragment as se, BaseService as re } from "@dzangolab/fastify-slonik";
import { deleteUser as U } from "supertokens-node";
import $ from "supertokens-node/recipe/emailverification";
import { getUserById as ae, getUserByThirdPartyInfo as oe } from "supertokens-node/recipe/thirdpartyemailpassword";
import y from "humps";
import { sql as l } from "slonik";
import { z as h } from "zod";
import { existsSync as M } from "node:fs";
import { migrate as ie } from "@dzangolab/postgres-migrations";
import * as de from "pg";
const E = "TENANT_OWNER", le = async () => {
  await S.createNewRoleOrAddPermissions(E, []);
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
}, v = (n, t, e) => {
  const s = m(n), r = e ? e[s.table.columns.slug] : "";
  return J(n, t, r);
}, ce = async (n, t, e) => {
  const { config: s, slonik: r, tenant: a } = t;
  n.tenant = a;
  const d = (await ee.getSession(t, Z(e), {
    sessionRequired: !1
  }))?.getUserId();
  if (d && !n.user) {
    const i = v(s, r, a);
    let c;
    try {
      c = await i.findById(d);
    } catch {
    }
    if (!c)
      throw new Error("Unable to find user");
    const { roles: g } = await S.getRolesForUser(f, d);
    n.user = c, n.roles = g;
  }
}, b = {
  addTenantPrefix: (n, t, e) => (e && (t = e[m(n).table.columns.id] + "_" + t), t),
  removeTenantPrefix: (n, t, e) => (e && e[m(n).table.columns.id] == t.slice(0, Math.max(0, Math.max(0, t.indexOf("_")))) && (t = t.slice(Math.max(0, t.indexOf("_") + 1))), t)
}, ue = (n, t) => {
  const e = t.config.appOrigin[0];
  return async (s) => {
    let r;
    try {
      const a = s.userContext._default.request.request;
      try {
        const i = a.headers.referer || a.headers.origin || a.hostname;
        r = D(i) || e;
      } catch {
        r = e;
      }
      const o = s.emailVerifyLink.replace(
        e + "/auth/verify-email",
        r + (t.config.user.supertokens.emailVerificationPath || X)
      );
      let d = s.user.email;
      a.tenant && (d = b.removeTenantPrefix(a.config, d, a.tenant)), P({
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
  const r = await n.createNewSession(
    e
  ), a = r.getUserId();
  if ((await v(t.config, t.slonik, s).findById(a))?.disabled)
    throw await r.revokeSession(), {
      name: "SIGN_IN_FAILED",
      message: "user is disabled",
      statusCode: 401
    };
  return r;
}, ge = (n, t) => async (e) => {
  if (n.verifySession === void 0)
    throw new Error("Should never come here");
  const s = await n.verifySession(e);
  if (s) {
    const r = s.getUserId(), a = e.userContext._default.request.request, o = s.getAccessTokenPayload().tenantId;
    if (a.tenant) {
      const c = m(a.config);
      if (o != a.tenant[c.table.columns.id])
        throw {
          name: "SESSION_VERIFICATION_FAILED",
          message: "invalid session",
          statusCode: 401
        };
    }
    if ((await v(
      t.config,
      t.slonik,
      a.tenant
    ).findById(r))?.disabled)
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
    const r = e.userContext._default.request.request, a = s.getAccessTokenPayload().tenantId;
    if (r.tenant) {
      const o = m(r.config);
      if (a != r.tenant[o.table.columns.id])
        throw {
          name: "SESSION_VERIFICATION_FAILED",
          message: "invalid session",
          statusCode: 401
        };
    }
  }
  return s;
}, we = (n, t) => {
  const { config: e, log: s, slonik: r } = t;
  return async (a) => {
    a.email = b.addTenantPrefix(
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
      a.userContext.dbSchema
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
}, Se = (n, t) => {
  const { config: e, log: s, slonik: r } = t;
  return async (a) => {
    const o = a.userContext.roles || [];
    if (!await L(o))
      throw s.error(`At least one role from ${o.join(", ")} does not exist.`), {
        name: "SIGN_UP_FAILED",
        message: "Something went wrong",
        statusCode: 500
      };
    const d = a.email;
    a.email = b.addTenantPrefix(
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
      let g;
      try {
        if (g = await c.create({
          id: i.user.id,
          email: d
        }), !g)
          throw new Error("User not found");
      } catch (u) {
        throw s.error("Error while creating user"), s.error(u), await U(i.user.id), {
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
        const w = await S.addRoleToUser(
          f,
          i.user.id,
          u
        );
        w.status !== "OK" && s.error(w.status);
      }
      if (e.user.features?.signUp?.emailVerification)
        try {
          if (a.userContext.autoVerifyEmail)
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
        P({
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
}, pe = (n, t) => async (e) => {
  const s = e.options.req.original, r = s.headers.referer || s.headers.origin || s.hostname, a = N(r), { admin: o, www: d } = m(s.config).reserved;
  if (e.userContext.roles = d.enabled && (d.slugs.some(
    (i) => `${i}.${s.config.multiTenant.rootDomain}` === a
  ) || d.domains.includes(a)) ? [E] : [s.config.user.role || k], o.enabled && (o.slugs.some(
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
}, Ie = (n, t, e) => (e && t.find((s) => {
  s.id === "email" && (s.value = e[m(n).table.columns.id] + "_" + s.value);
}), t), Te = (n, t) => async (e) => {
  if (e.userContext.tenant = e.options.req.original.tenant, n.generatePasswordResetTokenPOST === void 0)
    throw new Error("Should never come here");
  return e.formFields = Ie(
    t.config,
    e.formFields,
    e.userContext.tenant
  ), await n.generatePasswordResetTokenPOST(e);
}, Ee = (n, t) => async (e) => {
  let s = await n.getUserById(e);
  return s && e.userContext && e.userContext.tenant && (s = {
    ...s,
    email: b.removeTenantPrefix(
      t.config,
      s.email,
      e.userContext.tenant
    )
  }), s;
}, ye = (n, t) => async (e) => {
  const s = await n.resetPasswordUsingToken(e);
  if (s.status === "OK" && s.userId) {
    const r = await ae(s.userId, {
      tenant: e.userContext._default.request.request.tenant
    });
    r && P({
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
}, ve = (n, t) => {
  const e = t.config.appOrigin[0];
  return async (s) => {
    const r = s.userContext._default.request.request, a = r.headers.referer || r.headers.origin || r.hostname, o = D(a) || e, d = s.passwordResetLink.replace(
      e + "/auth/reset-password",
      o + (t.config.user.supertokens.resetPasswordPath || Q)
    );
    P({
      fastify: t,
      subject: "Reset Password",
      templateName: "reset-password",
      to: b.removeTenantPrefix(
        r.config,
        s.user.email,
        s.userContext.tenant
      ),
      templateData: {
        passwordResetLink: d
      }
    });
  };
}, be = (n, t) => {
  const { config: e, log: s } = t;
  return async (r) => {
    const a = r.userContext.roles || [], o = r.userContext.tenant;
    if (o) {
      const c = o[m(e).table.columns.id];
      r.thirdPartyUserId = c + "_" + r.thirdPartyUserId;
    }
    if (!await oe(
      r.tenantId,
      r.thirdPartyId,
      r.thirdPartyUserId,
      r.userContext
    ) && e.user.features?.signUp?.enabled === !1)
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404
      };
    const i = await n.thirdPartySignInUp(
      r
    );
    if (i.status === "OK" && i.createdNewUser) {
      if (!await L(a))
        throw await U(i.user.id), s.error(`At least one role from ${a.join(", ")} does not exist.`), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      for (const c of a) {
        const g = await S.addRoleToUser(
          f,
          i.user.id,
          c
        );
        g.status !== "OK" && s.error(g.status);
      }
    }
    return i;
  };
}, Re = (n, t) => {
  const { config: e, log: s, slonik: r } = t;
  return async (a) => {
    const o = a.options.req.original, d = o.headers.referer || o.headers.origin || o.hostname, i = N(d), { admin: c, www: g } = m(o.config).reserved;
    if (a.userContext.roles = g.enabled && (g.slugs.some(
      (w) => `${w}.${o.config.multiTenant.rootDomain}` === i
    ) || g.domains.includes(i)) ? [E] : [o.config.user.role || k], c.enabled && (c.slugs.some(
      (w) => `${w}.${o.config.multiTenant.rootDomain}` === i
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
      const w = v(
        e,
        r,
        a.userContext.tenant
      );
      let I;
      if (u.createdNewUser)
        try {
          if (I = await w.create({
            id: u.user.id,
            email: u.user.email
          }), !I)
            throw new Error("User not found");
          I.roles = a.userContext.roles;
        } catch (A) {
          throw s.error("Error while creating user"), s.error(A), await U(u.user.id), {
            name: "SIGN_UP_FAILED",
            message: "Something went wrong",
            statusCode: 500
          };
        }
      else {
        if (I = await w.findById(u.user.id), !I)
          return s.error(
            `User record not found for userId ${u.user.id}`
          ), {
            status: "GENERAL_ERROR",
            message: "Something went wrong"
          };
        I.lastLoginAt = Date.now(), await w.update(I.id, {
          lastLoginAt: x(new Date(I.lastLoginAt))
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
          ...I
        }
      };
    }
    return u;
  };
}, Oe = {
  sendEmail: ue
}, Ce = {
  override: {
    apis: {
      refreshPOST: fe,
      verifySession: ge
    },
    functions: {
      createNewSession: me
    }
  }
}, Pe = {
  override: {
    apis: {
      emailPasswordSignInPOST: he,
      emailPasswordSignUpPOST: pe,
      generatePasswordResetTokenPOST: Te,
      thirdPartySignInUpPOST: Re
    },
    functions: {
      emailPasswordSignIn: we,
      emailPasswordSignUp: Se,
      getUserById: Ee,
      resetPasswordUsingToken: ye,
      thirdPartySignInUp: be
    }
  },
  sendEmail: ve
}, Ae = {
  emailVerification: Oe,
  thirdPartyEmailPassword: Pe,
  session: Ce
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
class _e extends te {
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
    const s = R(this.table, this.schema), r = l.identifier([this.getMappedField("domain")]), a = l.identifier([this.getMappedField("slug")]), o = this.config.multiTenant.rootDomain, d = t.includes("host") ? l.fragment`,
          CASE
            WHEN ${r} IS NOT NULL THEN ${r}
            ELSE CONCAT(${a}, ${"." + o}::TEXT)
          END AS host
        ` : l.fragment``;
    return l.type(h.any())`
      SELECT ${l.join(e, l.fragment`, `)}
        ${d}
      FROM ${this.getTableFragment()}
      ${O(this.filterWithOwnerId(), s)}
      ORDER BY ${l.identifier([
      y.decamelize(this.getMappedField("id"))
    ])} ASC;
    `;
  };
  getCountSql = (t) => {
    const e = R(this.table, this.schema), s = h.object({
      count: h.number()
    });
    return l.type(s)`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()}
      ${O(this.filterWithOwnerId(t), e)};
    `;
  };
  getCreateSql = (t) => {
    const e = [], s = [];
    for (const r in t) {
      const a = r, o = t[a];
      e.push(
        l.identifier([y.decamelize(this.getMappedField(a))])
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
    y.decamelize(this.getMappedField("domain"))
  ])} = ${t}
      OR (
        ${l.identifier([y.decamelize(this.getMappedField("slug"))])}
        || '.' ||
        ${e}
      ) = ${t};
    `;
  getFindByIdSql = (t) => {
    const e = {
      key: this.getMappedField("id"),
      operator: "eq",
      value: t
    }, s = R(this.table, this.schema);
    return l.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${O(this.filterWithOwnerId(e), s)}
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
    const a = R(this.table, this.schema);
    return l.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${O(this.filterWithOwnerId(s), a)}
      ${ne(a, this.getSortInput(r))}
      ${se(t, e)};
    `;
  };
  getAliasedField = (t) => {
    const e = this.getMappedField(t);
    return e === t ? l.identifier([y.decamelize(t)]) : l.join(
      [l.identifier([y.decamelize(e)]), l.identifier([t])],
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
}, V = async (n, t) => {
  await n.query(
    `
      CREATE SCHEMA IF NOT EXISTS ${t};
      SET search_path TO ${t};
    `
  );
}, H = async (n) => {
  const t = new de.Client(n);
  return await t.connect(), t;
}, j = async (n, t, e) => {
  if (!M(t))
    return !1;
  const s = "client" in n ? n.client : (
    // DU [2023-JAN-06] This smells
    await H(n)
  );
  return await V(s, e.slug), await ie({ client: s }, t), "client" in n || await s.end(), !0;
}, F = h.optional(
  h.string().max(255).regex(/^([\da-z]([\da-z-]{0,61}[\da-z])?\.)+[a-z]{2,}$/)
), G = h.string().regex(/^(?!.*-+$)[a-z][\da-z-]{0,61}([\da-z])?$/), z = (n, t) => {
  const e = m(n).table.columns, s = {
    slug: t[e.slug],
    domain: t[e.domain]
  }, a = h.object({
    slug: G,
    domain: F
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
}, Ue = (n, t) => {
  const e = m(n).table.columns, s = {
    domain: t[e.domain]
  };
  if (!h.object({
    domain: F
  }).safeParse(s).success)
    throw {
      name: "ERROR_INVALID_DOMAIN",
      message: "Invalid domain",
      statusCode: 422
    };
}, it = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  domainSchema: F,
  slugSchema: G,
  validateTenantInput: z,
  validateTenantUpdate: Ue
}, Symbol.toStringTag, { value: "Module" }));
class p extends re {
  _ownerId = void 0;
  all = async (t) => {
    const e = this.factory.getAllWithAliasesSql(t);
    return await this.database.connect((r) => r.any(e));
  };
  create = async (t) => {
    const e = m(this.config), { slug: s, domain: r } = e.table.columns;
    if (t[r] === "" && delete t[r], z(this.config, t), q(this.config).includes(t[s]))
      throw {
        name: "ERROR_RESERVED_SLUG",
        message: `The requested ${s} "${t[s]}" is reserved and cannot be used`,
        statusCode: 422
      };
    if (W(this.config).includes(t[r]))
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
      const a = m(this.config), { slug: o, domain: d } = a.table.columns;
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
    (a) => `${a}.${n.multiTenant.rootDomain}` === e
  ))
    return null;
  const r = await new p(n, t).findByHostname(e);
  if (r)
    return r;
  throw new Error("Tenant not found");
}, Fe = async (n, t, e) => {
  n.addHook(
    "preHandler",
    async (s, r) => {
      const a = s.headers.referer || s.headers.origin || s.hostname, { config: o, slonik: d } = s;
      try {
        const i = await Ne(o, d, N(a));
        i && (s.tenant = i, s.dbSchema = i[m(o).table.columns.slug]);
      } catch (i) {
        return n.log.error(i), r.send({ error: { message: "Tenant not found" } });
      }
    }
  ), e();
}, $e = _(Fe), De = async (n, t, e) => {
  n.log.info("Registering fastify-multi-tenant plugin"), await n.register($e);
  const { config: s } = n, r = { recipes: Ae };
  s.user.supertokens = K(r, s.user.supertokens), n.addHook("onReady", async () => {
    await le();
  }), e();
}, Le = _(De);
Le.updateContext = ce;
const ke = async (n, t, e) => {
  try {
    const { config: s, slonik: r } = n, a = B(s.slonik), d = m(s).migrations.path;
    if (M(d)) {
      const c = await new p(s, r).all(["name", "slug"]), g = await H(a);
      for (const u of c)
        n.log.info(`Running migrations for tenant ${u.name}`), await j({ client: g }, d, u);
      await V(g, "public"), await g.end();
    } else
      n.log.warn(
        `Tenant migrations path '${d}' does not exists.`
      );
  } catch (s) {
    throw n.log.error("🔴 multi-tenant: Failed to run tenant migrations"), s;
  }
  e();
}, dt = _(ke), xe = {
  createTenant: async (n, t, e) => {
    if (e.tenant)
      return new T.ErrorWithProps(
        "Tenant app cannot be used to create tenant",
        void 0,
        403
      );
    const s = e.user?.id;
    if (s) {
      const r = t.data, a = m(e.config);
      return r[a.table.columns.ownerId] = s, await new p(
        e.config,
        e.database,
        e.dbSchema
      ).create(r).catch((d) => new T.ErrorWithProps(
        d.message,
        void 0,
        d.statusCode
      ));
    } else {
      e.app.log.error(
        "Could not able to get user id from mercurius context"
      );
      const r = new T.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return r.statusCode = 500, r;
    }
  }
}, Me = {
  allTenants: async (n, t, e) => {
    if (e.tenant)
      return new T.ErrorWithProps(
        "Tenant app cannot display all tenants",
        void 0,
        403
      );
    const s = e.user?.id;
    if (!s)
      return new T.ErrorWithProps(
        "Oops, Something went wrong",
        void 0,
        500
      );
    const r = new p(
      e.config,
      e.database,
      e.dbSchema
    ), { roles: a } = await S.getRolesForUser(f, s);
    return a.includes(E) && (r.ownerId = s), await r.all(JSON.parse(JSON.stringify(t.fields)));
  },
  tenant: async (n, t, e) => {
    if (e.tenant)
      return new T.ErrorWithProps(
        "Tenant app cannot retrieve tenant information",
        void 0,
        403
      );
    const s = e.user?.id;
    if (!s)
      return new T.ErrorWithProps(
        "Oops, Something went wrong",
        void 0,
        500
      );
    const r = new p(
      e.config,
      e.database,
      e.dbSchema
    ), { roles: a } = await S.getRolesForUser(f, s);
    return a.includes(E) && (r.ownerId = s), await r.findById(t.id);
  },
  tenants: async (n, t, e) => {
    if (e.tenant)
      return new T.ErrorWithProps(
        "Tenant app cannot display a list of tenants",
        void 0,
        403
      );
    const s = e.user?.id;
    if (!s)
      return new T.ErrorWithProps(
        "Oops, Something went wrong",
        void 0,
        500
      );
    const r = new p(
      e.config,
      e.database,
      e.dbSchema
    ), { roles: a } = await S.getRolesForUser(f, s);
    return a.includes(E) && (r.ownerId = s), await r.list(
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
  const s = new p(n.config, n.slonik, n.dbSchema), { roles: r } = await S.getRolesForUser(f, e);
  r.includes(E) && (s.ownerId = e);
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
    const s = n.body, r = m(n.config);
    s[r.table.columns.ownerId] = e;
    const o = await new p(n.config, n.slonik).create(s);
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
  const s = new p(n.config, n.slonik, n.dbSchema), { roles: r } = await S.getRolesForUser(f, e);
  r.includes(E) && (s.ownerId = e);
  const { id: a } = n.params, o = await s.findById(a);
  t.send(o);
}, Ve = async (n, t) => {
  if (n.tenant)
    throw {
      name: "LIST_TENANTS_FAILED",
      message: "Tenant app cannot display a list of tenants",
      statusCode: 403
    };
  const e = n.session?.getUserId();
  if (!e)
    throw n.log.error("could not get user id from session"), new Error("Oops, Something went wrong");
  const s = new p(n.config, n.slonik, n.dbSchema), { roles: r } = await S.getRolesForUser(f, e);
  r.includes(E) && (s.ownerId = e);
  const { limit: a, offset: o, filters: d, sort: i } = n.query, c = await s.list(
    a,
    o,
    d ? JSON.parse(d) : void 0,
    i ? JSON.parse(i) : void 0
  );
  t.send(c);
}, C = { all: We, create: qe, tenant: Be, tenants: Ve }, ct = async (n, t, e) => {
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
  p as TenantService,
  Le as default,
  dt as tenantMigrationPlugin,
  lt as tenantResolver,
  ct as tenantRoutes,
  Ae as thirdPartyEmailPassword,
  it as validateTenantSchema
};

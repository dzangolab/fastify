import "@dzangolab/fastify-config";
import "mercurius";
import p from "fastify-plugin";
import $ from "lodash.merge";
import { wrapResponse as D } from "supertokens-node/framework/fastify";
import _ from "supertokens-node/recipe/session";
import S from "supertokens-node/recipe/userroles";
import { UserService as T, formatDate as E, isRoleExists as U } from "@dzangolab/fastify-user";
import { existsSync as R } from "node:fs";
import * as F from "pg";
import { migrate as L } from "@dzangolab/postgres-migrations";
import { DefaultSqlFactory as N, BaseService as k } from "@dzangolab/fastify-slonik";
import w from "humps";
import { sql as c } from "slonik";
import { z as f } from "zod";
import { deleteUser as y } from "supertokens-node";
import "@dzangolab/fastify-mailer";
import { getUserByThirdPartyInfo as M } from "supertokens-node/recipe/thirdpartyemailpassword";
const m = (t) => {
  const e = t.slonik?.migrations?.path || "migrations";
  return {
    migrations: {
      path: t.multiTenant?.migrations?.path || `${e}/tenants`
    },
    reserved: {
      domains: t.multiTenant?.reserved?.domains || [],
      slugs: t.multiTenant?.reserved?.slugs || []
    },
    table: {
      name: t.multiTenant?.table?.name || "tenants",
      columns: {
        id: t.multiTenant?.table?.columns?.id || "id",
        name: t.multiTenant?.table?.columns?.name || "name",
        slug: t.multiTenant?.table?.columns?.slug || "slug",
        domain: t.multiTenant?.table?.columns?.domain || "domain"
      }
    }
  };
}, P = (t, e, r) => {
  const n = m(t), a = r ? r[n.table.columns.slug] : "";
  return new T(t, e, a);
}, q = async (t, e, r) => {
  const { config: n, slonik: a, tenant: i } = e;
  t.tenant = i;
  const l = (await _.getSession(e, D(r), {
    sessionRequired: !1
  }))?.getUserId();
  if (l && !t.user) {
    const s = P(n, a, i);
    let d;
    try {
      d = await s.findById(l);
    } catch {
    }
    if (!d)
      throw new Error("Unable to find user");
    const { roles: u } = await S.getRolesForUser(l);
    t.user = d, t.roles = u;
  }
}, b = async (t, e) => {
  await t.query(
    `
      CREATE SCHEMA IF NOT EXISTS ${e};
      SET search_path TO ${e};
    `
  );
}, I = (t) => ({
  database: t.db.databaseName,
  user: t.db.username,
  password: t.db.password,
  host: t.db.host,
  port: t.db.port
}), C = async (t) => {
  const e = new F.Client(t);
  return await e.connect(), e;
}, v = async (t, e, r) => {
  if (!R(e))
    return !1;
  const n = "client" in t ? t.client : (
    // DU [2023-JAN-06] This smells
    await C(t)
  );
  return await b(n, r.slug), await L({ client: n }, e), "client" in t || await n.end(), !0;
};
class B extends N {
  /* eslint-enabled */
  fieldMappings = new Map(
    Object.entries({
      domain: "domain",
      id: "id",
      name: "name",
      slug: "slug"
    })
  );
  constructor(e) {
    super(e), this.init();
  }
  getAllWithAliasesSql = (e) => {
    const r = [];
    for (const n of e)
      r.push(c.fragment`${this.getAliasedField(n)}`);
    return c.type(f.any())`
      SELECT ${c.join(r, c.fragment`, `)}
      FROM ${this.getTableFragment()}
      ORDER BY ${c.identifier([
      w.decamelize(this.getMappedField("id"))
    ])} ASC;
    `;
  };
  getCreateSql = (e) => {
    const r = [], n = [];
    for (const a in e) {
      const i = a, o = e[i];
      r.push(
        c.identifier([w.decamelize(this.getMappedField(i))])
      ), n.push(o);
    }
    return c.type(f.any())`
      INSERT INTO ${this.getTableFragment()}
        (${c.join(r, c.fragment`, `)})
      VALUES (${c.join(n, c.fragment`, `)})
      RETURNING *;
    `;
  };
  getFindByHostnameSql = (e, r) => c.type(f.any())`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE ${c.identifier([
    w.decamelize(this.getMappedField("domain"))
  ])} = ${e}
      OR (
        ${c.identifier([w.decamelize(this.getMappedField("slug"))])}
        || '.' ||
        ${r}
      ) = ${e};
    `;
  getAliasedField = (e) => {
    const r = this.getMappedField(e);
    return r === e ? c.identifier([e]) : c.join(
      [c.identifier([r]), c.identifier([e])],
      c.fragment` AS `
    );
  };
  getMappedField = (e) => this.fieldMappings.has(e) ? this.fieldMappings.get(e) : e;
  init() {
    const e = this.config.multiTenant?.table?.columns;
    if (e)
      for (const r in e) {
        const n = r;
        this.fieldMappings.set(n, e[n]);
      }
  }
}
class O extends k {
  all = async (e) => {
    const r = this.factory.getAllWithAliasesSql(e);
    return await this.database.connect((a) => a.any(r));
  };
  findByHostname = async (e) => {
    const r = this.factory.getFindByHostnameSql(
      e,
      this.config.multiTenant.rootDomain
    );
    return await this.database.connect(async (a) => a.maybeOne(r));
  };
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new B(this)), this._factory;
  }
  get table() {
    return this.config.multiTenant?.table?.name || "tenants";
  }
  postCreate = async (e) => {
    const r = m(this.config);
    return await v(
      I(this.config.slonik),
      r.migrations.path,
      e
    ), e;
  };
}
const H = async (t, e, r) => {
  try {
    const { config: n, slonik: a } = t, i = I(n.slonik), l = m(n).migrations.path;
    if (R(l)) {
      const d = await new O(n, a).all(["name", "slug"]), u = await C(i);
      for (const g of d)
        t.log.info(`Running migrations for tenant ${g.name}`), await v({ client: u }, l, g);
      await b(u, n.slonik.db.schema || "public"), await u.end();
    } else
      t.log.warn(
        `Tenant migrations path '${l}' does not exists.`
      );
  } catch (n) {
    throw t.log.error("🔴 multi-tenant: Failed to run tenant migrations"), n;
  }
  r();
}, G = p(H), h = {
  addTenantPrefix: (t, e, r) => (r && (e = r[m(t).table.columns.id] + "_" + e), e),
  removeTenantPrefix: (t, e) => (e && (t = t.slice(Math.max(0, t.indexOf("_") + 1))), t)
}, K = (t, e) => {
  const { config: r, log: n, slonik: a } = e;
  return async (i) => {
    i.email = h.addTenantPrefix(
      r,
      i.email,
      i.userContext.tenant
    );
    const o = await t.emailPasswordSignIn(
      i
    );
    if (o.status !== "OK")
      return o;
    const l = new T(r, a, i.userContext.dbSchema), s = await l.findById(o.user.id);
    return s ? (s.lastLoginAt = Date.now(), await l.update(s.id, {
      lastLoginAt: E(new Date(s.lastLoginAt))
    }).catch((u) => {
      n.error(
        `Unable to update lastLoginAt for userId ${o.user.id}`
      ), n.error(u);
    }), {
      status: "OK",
      user: {
        ...o.user,
        ...s
      }
    }) : (n.error(`User record not found for userId ${o.user.id}`), { status: "WRONG_CREDENTIALS_ERROR" });
  };
}, j = (t, e) => async (r) => {
  if (r.userContext.tenant = r.options.req.original.tenant, r.userContext.dbSchema = r.options.req.original.dbSchema, t.emailPasswordSignInPOST === void 0)
    throw new Error("Should never come here");
  return await t.emailPasswordSignInPOST(r);
}, x = async ({
  fastify: t,
  subject: e,
  templateData: r = {},
  templateName: n,
  to: a
}) => {
  const { config: i, mailer: o, log: l } = t;
  return o.sendMail({
    subject: e,
    templateName: n,
    to: a,
    templateData: {
      appName: i.appName,
      ...r
    }
  }).catch((s) => {
    throw l.error(s.stack), {
      name: "SEND_EMAIL",
      message: s.message,
      statusCode: 500
    };
  });
}, z = (t, e) => {
  const { config: r, log: n, slonik: a } = e;
  return async (i) => {
    if (r.user.features?.signUp === !1)
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404
      };
    const o = r.user.role || "USER";
    if (!await U(o))
      throw n.error(`Role "${o}" does not exist`), {
        name: "SIGN_UP_FAILED",
        message: "Something went wrong",
        statusCode: 500
      };
    const l = i.email;
    i.email = h.addTenantPrefix(
      r,
      l,
      i.userContext.tenant
    );
    const s = await t.emailPasswordSignUp(
      i
    );
    if (s.status === "OK") {
      const d = P(
        r,
        a,
        i.userContext.tenant
      );
      let u;
      try {
        if (u = await d.create({
          id: s.user.id,
          email: l
        }), !u)
          throw new Error("User not found");
      } catch (A) {
        throw n.error("Error while creating user"), n.error(A), await y(s.user.id), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      }
      u.roles = [r.user.role || "USER"], s.user = {
        ...s.user,
        ...u
      };
      const g = await S.addRoleToUser(
        s.user.id,
        o
      );
      g.status !== "OK" && n.error(g.status);
    }
    if (r.user.supertokens.sendUserAlreadyExistsWarning && s.status === "EMAIL_ALREADY_EXISTS_ERROR")
      try {
        await x({
          fastify: e,
          subject: "Duplicate Email Registration",
          templateData: {
            emailId: l
          },
          templateName: "duplicate-email-warning",
          to: l
        });
      } catch (d) {
        n.error(d);
      }
    return s;
  };
}, W = (t, e) => async (r) => {
  if (r.userContext.tenant = r.options.req.original.tenant, t.emailPasswordSignUpPOST === void 0)
    throw new Error("Should never come here");
  return await t.emailPasswordSignUpPOST(r);
}, X = (t, e, r) => (r && e.find((n) => {
  n.id === "email" && (n.value = r[m(t).table.columns.id] + "_" + n.value);
}), e), Y = (t, e) => async (r) => {
  if (r.userContext.tenant = r.options.req.original.tenant, t.generatePasswordResetTokenPOST === void 0)
    throw new Error("Should never come here");
  return r.formFields = X(
    e.config,
    r.formFields,
    r.userContext.tenant
  ), await t.generatePasswordResetTokenPOST(r);
}, V = (t) => async (e) => {
  let r = await t.getUserById(e);
  return r && e.userContext.tenant && (r = {
    ...r,
    email: h.removeTenantPrefix(r.email, e.userContext.tenant)
  }), r;
}, J = (t) => {
  let e;
  try {
    if (e = new URL(t).origin, !e || e === "null")
      throw new Error("Origin is empty");
  } catch {
    e = "";
  }
  return e;
}, Q = (t, e) => {
  const r = e.config.appOrigin[0], n = "/reset-password";
  return async (a) => {
    const i = a.userContext._default.request.request, o = i.headers.referer || i.headers.origin || i.hostname, l = J(o) || r, s = a.passwordResetLink.replace(
      r + "/auth/reset-password",
      l + (e.config.user.supertokens.resetPasswordPath || n)
    );
    await x({
      fastify: e,
      subject: "Reset Password",
      templateName: "reset-password",
      to: h.removeTenantPrefix(a.user.email, a.userContext.tenant),
      templateData: {
        passwordResetLink: s
      }
    });
  };
}, Z = (t, e) => {
  const { config: r, log: n } = e;
  return async (a) => {
    const i = a.userContext.tenant;
    if (i) {
      const s = i[m(r).table.columns.id];
      a.thirdPartyUserId = s + "_" + a.thirdPartyUserId;
    }
    if (!await M(
      a.thirdPartyId,
      a.thirdPartyUserId,
      a.userContext
    ) && r.user.features?.signUp === !1)
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404
      };
    const l = await t.thirdPartySignInUp(
      a
    );
    if (l.status === "OK" && l.createdNewUser) {
      const s = r.user.role || "USER";
      if (!await U(s))
        throw await y(l.user.id), n.error(`Role "${s}" does not exist`), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      const d = await S.addRoleToUser(
        l.user.id,
        s
      );
      d.status !== "OK" && n.error(d.status);
    }
    return l;
  };
}, ee = (t, e) => {
  const { config: r, log: n, slonik: a } = e;
  return async (i) => {
    if (i.userContext.tenant = i.options.req.original.tenant, t.thirdPartySignInUpPOST === void 0)
      throw new Error("Should never come here");
    const o = await t.thirdPartySignInUpPOST(i);
    if (o.status === "OK") {
      const l = P(
        r,
        a,
        i.userContext.tenant
      );
      let s;
      if (o.createdNewUser)
        try {
          if (s = await l.create({
            id: o.user.id,
            email: o.user.email
          }), !s)
            throw new Error("User not found");
          s.roles = [r.user.role || "USER"];
        } catch (d) {
          throw n.error("Error while creating user"), n.error(d), await y(o.user.id), {
            name: "SIGN_UP_FAILED",
            message: "Something went wrong",
            statusCode: 500
          };
        }
      else {
        if (s = await l.findById(o.user.id), !s)
          return n.error(
            `User record not found for userId ${o.user.id}`
          ), {
            status: "GENERAL_ERROR",
            message: "Something went wrong"
          };
        s.lastLoginAt = Date.now(), await l.update(s.id, {
          lastLoginAt: E(new Date(s.lastLoginAt))
        }).catch((d) => {
          n.error(
            `Unable to update lastLoginAt for userId ${o.user.id}`
          ), n.error(d);
        });
      }
      return {
        status: "OK",
        createdNewUser: o.createdNewUser,
        user: {
          ...o.user,
          ...s
        },
        session: o.session,
        authCodeResponse: o.authCodeResponse
      };
    }
    return o;
  };
}, te = {
  override: {
    apis: {
      emailPasswordSignInPOST: j,
      emailPasswordSignUpPOST: W,
      generatePasswordResetTokenPOST: Y,
      thirdPartySignInUpPOST: ee
    },
    functions: {
      emailPasswordSignIn: K,
      emailPasswordSignUp: z,
      getUserById: V,
      thirdPartySignInUp: Z
    }
  },
  sendEmail: Q
}, re = async (t, e, r) => {
  const n = t.multiTenant?.reserved?.slugs, a = t.multiTenant?.reserved?.domains;
  if (a && a.includes(r) || n && n.some(
    (l) => `${l}.${t.multiTenant.rootDomain}` === r
  ))
    return null;
  const o = await new O(t, e).findByHostname(r);
  if (o)
    return o;
  throw new Error("Tenant not found");
}, ne = (t) => {
  let e;
  try {
    if (e = new URL(t).host, !e)
      throw new Error("Host is empty");
  } catch {
    e = t;
  }
  return e;
}, se = async (t, e, r) => {
  t.addHook(
    "preHandler",
    async (n, a) => {
      const i = n.headers.referer || n.headers.origin || n.hostname, { config: o, slonik: l } = n;
      try {
        const s = await re(o, l, ne(i));
        s && (n.tenant = s, n.dbSchema = s[m(o).table.columns.slug]);
      } catch (s) {
        return t.log.error(s), a.send({ error: { message: "Tenant not found" } });
      }
    }
  ), r();
}, ae = p(se), oe = async (t, e, r) => {
  t.log.info("Registering fastify-multi-tenant plugin"), await t.register(G), await t.register(ae);
  const { config: n } = t, a = {
    recipes: {
      thirdPartyEmailPassword: te
    }
  };
  n.user.supertokens = $(a, n.user.supertokens), r();
}, ie = p(oe);
ie.updateContext = q;
export {
  O as TenantService,
  ie as default,
  te as thirdPartyEmailPassword
};

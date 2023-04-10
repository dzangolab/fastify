import "@dzangolab/fastify-config";
import "mercurius";
import g from "fastify-plugin";
import { existsSync as h } from "node:fs";
import * as F from "pg";
import { migrate as v } from "@dzangolab/postgres-migrations";
import { DefaultSqlFactory as E, BaseService as M } from "@dzangolab/fastify-slonik";
import m from "humps";
import { sql as i } from "slonik";
import { z as d } from "zod";
const R = async (n, t) => {
  t.config.mercurius.enabled && (n.tenant = t.tenant);
}, f = async (n, t) => {
  await n.query(
    `
      CREATE SCHEMA IF NOT EXISTS ${t};
      SET search_path TO ${t};
    `
  );
}, y = (n) => ({
  database: n.db.databaseName,
  user: n.db.username,
  password: n.db.password,
  host: n.db.host,
  port: n.db.port
}), T = async (n) => {
  const t = new F.Client(n);
  return await t.connect(), t;
}, w = (n) => {
  const t = n.slonik?.migrations?.path || "migrations";
  return {
    migrations: {
      path: n.multiTenant?.migrations?.path || `${t}/tenants`
    },
    reserved: {
      domains: n.multiTenant?.reserved?.domains || [],
      slugs: n.multiTenant?.reserved?.slugs || []
    },
    table: {
      name: n.multiTenant?.table?.name || "tenants",
      columns: {
        id: n.multiTenant?.table?.columns?.id || "id",
        name: n.multiTenant?.table?.columns?.name || "name",
        slug: n.multiTenant?.table?.columns?.slug || "slug",
        domain: n.multiTenant?.table?.columns?.domain || "domain"
      }
    }
  };
}, b = async (n, t, e) => {
  if (!h(t))
    return !1;
  const a = "client" in n ? n.client : (
    // DU [2023-JAN-06] This smells
    await T(n)
  );
  return await f(a, e.slug), await v({ client: a }, t), "client" in n || await a.end(), !0;
};
class A extends E {
  /* eslint-enabled */
  fieldMappings = new Map(
    Object.entries({
      domain: "domain",
      id: "id",
      name: "name",
      slug: "slug"
    })
  );
  constructor(t) {
    super(t), this.init();
  }
  getAllWithAliasesSql = (t) => {
    const e = [];
    for (const a of t)
      e.push(i.fragment`${this.getAliasedField(a)}`);
    return i.type(d.any())`
      SELECT ${i.join(e, i.fragment`, `)}
      FROM ${this.getTableFragment()}
      ORDER BY ${i.identifier([
      m.decamelize(this.getMappedField("id"))
    ])} ASC;
    `;
  };
  getCreateSql = (t) => {
    const e = [], a = [];
    for (const s in t) {
      const r = s, o = t[r];
      e.push(
        i.identifier([m.decamelize(this.getMappedField(r))])
      ), a.push(o);
    }
    return i.type(d.any())`
      INSERT INTO ${this.getTableFragment()}
        (${i.join(e, i.fragment`, `)})
      VALUES (${i.join(a, i.fragment`, `)})
      RETURNING *;
    `;
  };
  getFindByHostnameSql = (t, e) => i.type(d.any())`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE ${i.identifier([
    m.decamelize(this.getMappedField("domain"))
  ])} = ${t}
      OR (
        ${i.identifier([m.decamelize(this.getMappedField("slug"))])}
        || '.' ||
        ${e}
      ) = ${t};
    `;
  getAliasedField = (t) => {
    const e = this.getMappedField(t);
    return e === t ? i.identifier([t]) : i.join(
      [i.identifier([e]), i.identifier([t])],
      i.fragment` AS `
    );
  };
  getMappedField = (t) => this.fieldMappings.has(t) ? this.fieldMappings.get(t) : t;
  init() {
    const t = this.config.multiTenant?.table?.columns;
    if (t)
      for (const e in t) {
        const a = e;
        this.fieldMappings.set(a, t[a]);
      }
  }
}
class S extends M {
  all = async (t) => {
    const e = this.factory.getAllWithAliasesSql(t);
    return await this.database.connect((s) => s.any(e));
  };
  findByHostname = async (t) => {
    const e = this.factory.getFindByHostnameSql(
      t,
      this.config.multiTenant.rootDomain
    );
    return await this.database.connect(async (s) => s.maybeOne(e));
  };
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new A(this)), this._factory;
  }
  get table() {
    return this.config.multiTenant?.table?.name || "tenants";
  }
  postCreate = async (t) => {
    const e = w(this.config);
    return await b(
      y(this.config.slonik),
      e.migrations.path,
      t
    ), t;
  };
}
const H = async (n, t, e) => {
  try {
    const { config: a, slonik: s } = n, r = y(a.slonik), l = w(a).migrations.path;
    if (h(l)) {
      const $ = await new S(a, s).all(["name", "slug"]), u = await T(r);
      for (const p of $)
        n.log.info(`Running migrations for tenant ${p.name}`), await b({ client: u }, l, p);
      await f(u, "public"), await u.end();
    } else
      n.log.warn(
        `Tenant migrations path '${l}' does not exists.`
      );
  } catch (a) {
    throw n.log.error("🔴 multi-tenant: Failed to run tenant migrations"), a;
  }
  e();
}, C = g(H), O = async (n, t, e) => {
  const a = n.multiTenant?.reserved?.slugs, s = n.multiTenant?.reserved?.domains;
  if (s && s.includes(e) || a && a.some(
    (l) => `${l}.${n.multiTenant.rootDomain}` === e
  ))
    return null;
  const o = await new S(n, t).findByHostname(e);
  if (o)
    return o;
  throw new Error("Tenant not found");
}, q = (n) => {
  let t;
  try {
    if (t = new URL(n).host, !t)
      throw new Error("Host is empty");
  } catch {
    t = n;
  }
  return t;
}, x = async (n, t, e) => {
  n.addHook(
    "preHandler",
    async (a, s) => {
      const r = a.headers.referer || a.headers.origin || a.hostname, { config: o, slonik: l } = a;
      try {
        const c = await O(o, l, q(r));
        c && (a.tenant = c);
      } catch (c) {
        return n.log.error(c), s.send({ error: { message: "Tenant not found" } });
      }
    }
  ), e();
}, D = g(x), P = async (n, t, e) => {
  n.log.info("Registering fastify-multi-tenant plugin"), await n.register(C), await n.register(D), e();
}, z = g(P);
z.updateContext = R;
export {
  S as TenantService,
  z as default
};

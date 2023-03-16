import "@dzangolab/fastify-config";
import "mercurius";
import b from "fastify-plugin";
import { existsSync as E } from "node:fs";
import * as H from "pg";
import { migrate as D } from "@dzangolab/postgres-migrations";
import { DefaultSqlFactory as q, BaseService as B } from "@dzangolab/fastify-slonik";
import { sql as s } from "slonik";
const P = async (e, t) => {
  t.config.mercurius.enabled && (e.tenant = t.tenant);
}, F = async (e, t) => {
  await e.query(
    `
      CREATE SCHEMA IF NOT EXISTS ${t};
      SET search_path TO ${t};
    `
  );
}, z = (e) => ({
  database: e.db.databaseName,
  user: e.db.username,
  password: e.db.password,
  host: e.db.host,
  port: e.db.port
}), M = async (e) => {
  const t = new H.Client(e);
  return await t.connect(), t;
}, R = (e) => {
  const t = e.slonik?.migrations?.path || "migrations";
  return {
    migrations: {
      path: e.multiTenant?.migrations?.path || `${t}/tenants`
    },
    reserved: {
      domains: e.multiTenant?.reserved?.domains || [],
      slugs: e.multiTenant?.reserved?.slugs || []
    },
    table: {
      name: e.multiTenant?.table?.name || "tenants",
      columns: {
        id: e.multiTenant?.table?.columns?.id || "id",
        name: e.multiTenant?.table?.columns?.name || "name",
        slug: e.multiTenant?.table?.columns?.slug || "slug",
        domain: e.multiTenant?.table?.columns?.domain || "domain"
      }
    }
  };
}, _ = async (e, t, a) => {
  if (!E(t))
    return !1;
  const r = "client" in e ? e.client : (
    // DU [2023-JAN-06] This smells
    await M(e)
  );
  return await F(r, a.slug), await D({ client: r }, t), "client" in e || await r.end(), !0;
};
var N = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, f = {}, K = {
  get exports() {
    return f;
  },
  set exports(e) {
    f = e;
  }
};
(function(e) {
  (function(t) {
    var a = function(n, i, u) {
      if (!w(i) || y(i) || A(i) || O(i) || p(i))
        return i;
      var d, h = 0, $ = 0;
      if (g(i))
        for (d = [], $ = i.length; h < $; h++)
          d.push(a(n, i[h], u));
      else {
        d = {};
        for (var T in i)
          Object.prototype.hasOwnProperty.call(i, T) && (d[n(T, u)] = a(n, i[T], u));
      }
      return d;
    }, r = function(n, i) {
      i = i || {};
      var u = i.separator || "_", d = i.split || /(?=[A-Z])/;
      return n.split(d).join(u);
    }, o = function(n) {
      return C(n) ? n : (n = n.replace(/[\-_\s]+(.)?/g, function(i, u) {
        return u ? u.toUpperCase() : "";
      }), n.substr(0, 1).toLowerCase() + n.substr(1));
    }, m = function(n) {
      var i = o(n);
      return i.substr(0, 1).toUpperCase() + i.substr(1);
    }, c = function(n, i) {
      return r(n, i).toLowerCase();
    }, l = Object.prototype.toString, p = function(n) {
      return typeof n == "function";
    }, w = function(n) {
      return n === Object(n);
    }, g = function(n) {
      return l.call(n) == "[object Array]";
    }, y = function(n) {
      return l.call(n) == "[object Date]";
    }, A = function(n) {
      return l.call(n) == "[object RegExp]";
    }, O = function(n) {
      return l.call(n) == "[object Boolean]";
    }, C = function(n) {
      return n = n - 0, n === n;
    }, v = function(n, i) {
      var u = i && "process" in i ? i.process : i;
      return typeof u != "function" ? n : function(d, h) {
        return u(d, n, h);
      };
    }, S = {
      camelize: o,
      decamelize: c,
      pascalize: m,
      depascalize: c,
      camelizeKeys: function(n, i) {
        return a(v(o, i), n);
      },
      decamelizeKeys: function(n, i) {
        return a(v(c, i), n, i);
      },
      pascalizeKeys: function(n, i) {
        return a(v(m, i), n);
      },
      depascalizeKeys: function() {
        return this.decamelizeKeys.apply(this, arguments);
      }
    };
    e.exports ? e.exports = S : t.humps = S;
  })(N);
})(K);
class L extends q {
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
    const a = [];
    for (const r of t)
      a.push(s`${this.getAliasedField(r)}`);
    return s`
      SELECT ${s.join(a, s`, `)}
      FROM ${this.getTableFragment()}
      ORDER BY ${s.identifier([
      f.decamelize(this.getMappedField("id"))
    ])} ASC;
    `;
  };
  getCreateSql = (t) => {
    const a = [], r = [];
    for (const o in t) {
      const m = o, c = t[m];
      a.push(
        s.identifier([f.decamelize(this.getMappedField(m))])
      ), r.push(c);
    }
    return s`
      INSERT INTO ${this.getTableFragment()}
        (${s.join(a, s`, `)})
      VALUES (${s.join(r, s`, `)})
      RETURNING *;
    `;
  };
  getFindByHostnameSql = (t, a) => s`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE ${s.identifier([
    f.decamelize(this.getMappedField("domain"))
  ])} = ${t}
      OR (
        ${s.identifier([f.decamelize(this.getMappedField("slug"))])}
        || '.' ||
        ${a}
      ) = ${t};
    `;
  getAliasedField = (t) => {
    const a = this.getMappedField(t);
    return a === t ? s.identifier([t]) : s.join(
      [s.identifier([a]), s.identifier([t])],
      s` AS `
    );
  };
  getMappedField = (t) => this.fieldMappings.has(t) ? this.fieldMappings.get(t) : t;
  init() {
    const t = this.config.multiTenant?.table?.columns;
    if (t)
      for (const a in t) {
        const r = a;
        this.fieldMappings.set(r, t[r]);
      }
  }
}
class x extends B {
  all = async (t) => {
    const a = this.factory.getAllWithAliasesSql(t);
    return await this.database.connect((o) => o.any(a));
  };
  findByHostname = async (t) => {
    const a = this.factory.getFindByHostnameSql(
      t,
      this.config.multiTenant.rootDomain
    );
    return await this.database.connect(async (o) => o.maybeOne(a));
  };
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new L(this)), this._factory;
  }
  get table() {
    return this.config.multiTenant?.table?.name || "tenants";
  }
  postCreate = async (t) => {
    const a = R(this.config);
    return await _(
      z(this.config.slonik),
      a.migrations.path,
      t
    ), t;
  };
}
const I = async (e, t, a) => {
  try {
    const { config: r, slonik: o } = e, m = z(r.slonik), l = R(r).migrations.path;
    if (E(l)) {
      const w = await new x(r, o).all(["name", "slug"]), g = await M(m);
      for (const y of w)
        e.log.info(`Running migrations for tenant ${y.name}`), await _({ client: g }, l, y);
      await F(g, "public"), await g.end();
    } else
      e.log.warn(
        `Tenant migrations path '${l}' does not exists.`
      );
  } catch (r) {
    throw e.log.error("🔴 multi-tenant: Failed to run tenant migrations"), r;
  }
  a();
}, U = b(I), W = async (e, t, a) => {
  const r = e.multiTenant?.reserved?.slugs, o = e.multiTenant?.reserved?.domains;
  if (o && o.includes(a) || r && r.some(
    (l) => `${l}.${e.multiTenant.rootDomain}` === a
  ))
    return null;
  const c = await new x(e, t).findByHostname(a);
  if (c)
    return c;
  throw new Error("Tenant not found");
}, k = (e) => {
  let t;
  try {
    if (t = new URL(e).host, !t)
      throw new Error("Host is empty");
  } catch {
    t = e;
  }
  return t;
}, G = async (e, t, a) => {
  e.addHook(
    "preHandler",
    async (r, o) => {
      const m = r.headers.referer || r.headers.origin || r.hostname, { config: c, slonik: l } = r;
      try {
        const p = await W(c, l, k(m));
        p && (r.tenant = p);
      } catch (p) {
        return e.log.error(p), o.send({ error: { message: "Tenant not found" } });
      }
    }
  ), a();
}, V = b(G), X = async (e, t, a) => {
  e.log.info("Registering fastify-multi-tenant plugin"), await e.register(U), await e.register(V), a();
}, Y = b(X);
Y.updateContext = P;
export {
  x as TenantService,
  Y as default
};

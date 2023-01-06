import g from "fastify-plugin";
import { createPool as R, sql as t, stringifyDsn as y } from "slonik";
import { migrate as m } from "postgres-migrations";
import * as D from "pg";
var $ = async (e, a) => {
  const { connectionString: i } = a;
  let n;
  try {
    n = await R(i);
  } catch (o) {
    throw e.log.error("🔴 Error happened while connecting to Postgres DB"), new Error(o);
  }
  try {
    await n.connect(async () => {
      e.log.info("✅ Connected to Postgres DB");
    });
  } catch {
    e.log.error("🔴 Error happened while connecting to Postgres DB");
  }
  const r = {
    connect: n.connect.bind(n),
    pool: n,
    query: n.query.bind(n)
  };
  !e.hasDecorator("slonik") && !e.hasDecorator("sql") && (e.decorate("slonik", r), e.decorate("sql", t)), !e.hasRequestDecorator("slonik") && !e.hasRequestDecorator("sql") && (e.decorateRequest("slonik", null), e.decorateRequest("sql", null), e.addHook("onRequest", async (o) => {
    o.slonik = r, o.sql = t;
  }));
};
g($, {
  fastify: "4.x",
  name: "fastify-slonik"
});
var S = g($, {
  fastify: "4.x",
  name: "fastify-slonik"
});
const h = async (e, a) => {
  await e.query(`CREATE SCHEMA IF NOT EXISTS ${a};`), await e.query(`SET search_path TO ${a};`);
}, w = async (e) => {
  const a = new D.Client(e);
  return await a.connect(), a;
}, E = async (e, a, i) => {
  let n;
  "client" in e ? n = e.client : n = await w(e), i && await h(n, i), await m({ client: n }, a), "client" in e || await n.end();
}, T = (e, a) => {
  const i = e.key, n = e.operator || "eq", r = e.not || !1;
  let o = e.value;
  const s = t.identifier([a, i]);
  let c;
  switch (n) {
    case "ct":
    case "sw":
    case "ew": {
      o = {
        ct: `%${o}%`,
        ew: `%${o}`,
        sw: `${o}%`
      }[n], c = r ? t`NOT ILIKE` : t`ILIKE`;
      break;
    }
    case "eq":
    default: {
      c = r ? t`!=` : t`=`;
      break;
    }
    case "gt": {
      c = r ? t`<` : t`>`;
      break;
    }
    case "gte": {
      c = r ? t`<` : t`>=`;
      break;
    }
    case "lte": {
      c = r ? t`>` : t`<=`;
      break;
    }
    case "lt": {
      c = r ? t`>` : t`<`;
      break;
    }
    case "in": {
      c = r ? t`NOT IN` : t`IN`, o = t`(${t.join(o.split(","), t`, `)})`;
      break;
    }
    case "bt": {
      c = r ? t`NOT BETWEEN` : t`BETWEEN`, o = t`${t.join(o.split(","), t` AND `)}`;
      break;
    }
  }
  return t`${s} ${c} ${o}`;
}, F = (e, a, i = !1) => {
  const n = [], r = [];
  let o;
  const s = (c, u, p = !1) => {
    if (c.AND)
      for (const l of c.AND)
        s(l, u);
    else if (c.OR)
      for (const l of c.OR)
        s(l, u, !0);
    else {
      const l = T(c, u);
      p ? r.push(l) : n.push(l);
    }
  };
  return s(e, a, i), n.length > 0 && r.length > 0 ? o = t.join(
    [
      t`(${t.join(n, t` AND `)})`,
      t`(${t.join(r, t` OR `)})`
    ],
    t`${e.AND ? t` AND ` : t` OR `}`
  ) : n.length > 0 ? o = t.join(n, t` AND `) : r.length > 0 && (o = t.join(r, t` OR `)), o ? t`WHERE ${o}` : t``;
}, k = (e, a) => {
  let i = t`LIMIT ${e}`;
  return a && (i = t`LIMIT ${e} OFFSET ${a}`), i;
}, d = (e) => t`${t.identifier([e])}`, W = (e) => t`WHERE id = ${e}`, O = (e, a) => e ? F(e, a) : t``, I = (e, a) => {
  if (a && a.length > 0) {
    const i = [];
    for (const n of a) {
      const r = n.direction === "ASC" ? t`ASC` : t`DESC`;
      i.push(
        t`${t.identifier([e, n.key])} ${r}`
      );
    }
    return t`ORDER BY ${t.join(i, t`,`)}`;
  }
  return t`ORDER BY id ASC`;
}, N = (e, a, i) => ({
  all: (n) => {
    const r = [];
    for (const o of n)
      r.push(e`${e.identifier([o])}`);
    return e`
        SELECT ${e.join(r, e`, `)}
        FROM ${d(a)}
        ORDER BY id ASC
      `;
  },
  create: (n) => {
    const r = [], o = [];
    for (const c in n) {
      const u = c, p = n[u];
      r.push(u), o.push(p);
    }
    const s = r.map((c) => e.identifier([c]));
    return e`
        INSERT INTO ${d(a)}
        (${e.join(s, e`, `)}, created_at, updated_at)
        VALUES (${e.join(o, e`, `)}, NOW(), NOW())
        RETURNING *;
      `;
  },
  delete: (n) => e`
        DELETE FROM ${d(a)}
        WHERE id = ${n}
        RETURNING *;
      `,
  findById: (n) => e`
        SELECT *
        FROM ${d(a)}
        WHERE id = ${n}
      `,
  list: (n, r, o, s) => e`
        SELECT *
        FROM ${d(a)}
        ${O(o, a)}
        ${I(a, s)}
        ${k(
    Math.min(
      n ?? i.pagination.default_limit,
      i?.pagination.max_limit
    ),
    r
  )};
      `,
  update: (n, r) => {
    const o = [];
    for (const s in r) {
      const c = r[s];
      o.push(e`${e.identifier([s])} = ${c}`);
    }
    return e`
        UPDATE ${d(a)}
        SET ${e.join(o, e`, `)}
        WHERE id = ${n}
        RETURNING *;
      `;
  }
}), b = "tenants", f = (e, a, i) => {
  const n = N(i, b, e);
  return {
    all: async () => {
      const r = n.all(["id", "name", "slug"]);
      return await a.connect((s) => s.any(r));
    },
    create: async (r) => {
      const o = n.create(r);
      return await a.connect(async (s) => s.query(o).then((c) => c.rows[0]));
    },
    delete: async (r) => {
      const o = n.delete(r);
      return await a.connect((c) => c.one(o));
    },
    findById: async (r) => {
      const o = n.findById(r);
      return await a.connect((c) => c.maybeOne(o));
    },
    update: async (r, o) => {
      const s = n.update(r, o);
      return await a.connect((c) => c.query(s).then((u) => u.rows[0]));
    }
  };
}, A = (e) => ({
  database: e.db.databaseName,
  user: e.db.username,
  password: e.db.password,
  host: e.db.host,
  port: e.db.port,
  ensureDatabaseExists: !0,
  defaultDatabase: "postgres"
}), v = async (e, a, i) => {
  try {
    e.log.info("Running database migrations");
    const n = A(
      e.config.slonik
    ), r = await w(n), o = e.config.slonik.migrations.path;
    await E({ client: r }, o);
    const c = await f(e.config, e.slonik, t).all();
    for (const u of c.values())
      e.log.info(`Running migrations for tenant ${u.name}`), await E({ client: r }, o + "/tenants", u.slug);
    await h(r, "public"), await r.end();
  } catch (n) {
    throw e.log.error("🔴 Failed to run the migrations"), n;
  }
  i();
}, j = g(v), B = async (e, a, i) => {
  const n = e.config.slonik;
  try {
    e.log.info("Registering fastify-slonik plugin"), await e.register(S, {
      connectionString: y(n.db)
    });
  } catch (r) {
    throw e.log.error("🔴 Failed to connect, check your connection string"), r;
  }
  await e.register(j), i();
}, q = g(B);
export {
  N as SqlFactory,
  f as TenantService,
  k as createLimitFragment,
  d as createTableFragment,
  W as createWhereIdFragment,
  q as default,
  A as getMigrateDatabaseConfig,
  j as migratePlugin
};

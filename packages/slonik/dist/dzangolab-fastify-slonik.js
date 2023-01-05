import p from "fastify-plugin";
import { createPool as $, sql as t, stringifyDsn as y } from "slonik";
import * as R from "pg";
import { migrate as w } from "postgres-migrations";
var h = async (n, e) => {
  const { connectionString: s } = e;
  let o;
  try {
    o = await $(s);
  } catch (a) {
    throw n.log.error("🔴 Error happened while connecting to Postgres DB"), new Error(a);
  }
  try {
    await o.connect(async () => {
      n.log.info("✅ Connected to Postgres DB");
    });
  } catch {
    n.log.error("🔴 Error happened while connecting to Postgres DB");
  }
  const r = {
    connect: o.connect.bind(o),
    pool: o,
    query: o.query.bind(o)
  };
  !n.hasDecorator("slonik") && !n.hasDecorator("sql") && (n.decorate("slonik", r), n.decorate("sql", t)), !n.hasRequestDecorator("slonik") && !n.hasRequestDecorator("sql") && (n.decorateRequest("slonik", null), n.decorateRequest("sql", null), n.addHook("onRequest", async (a) => {
    a.slonik = r, a.sql = t;
  }));
};
p(h, {
  fastify: "4.x",
  name: "fastify-slonik"
});
var k = p(h, {
  fastify: "4.x",
  name: "fastify-slonik"
});
const f = (n, e) => {
  const s = n.key, o = n.operator || "eq", r = n.not || !1;
  let a = n.value;
  const i = t.identifier([e, s]);
  let c;
  switch (o) {
    case "ct":
    case "sw":
    case "ew": {
      a = {
        ct: `%${a}%`,
        ew: `%${a}`,
        sw: `${a}%`
      }[o], c = r ? t`NOT ILIKE` : t`ILIKE`;
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
      c = r ? t`NOT IN` : t`IN`, a = t`(${t.join(a.split(","), t`, `)})`;
      break;
    }
    case "bt": {
      c = r ? t`NOT BETWEEN` : t`BETWEEN`, a = t`${t.join(a.split(","), t` AND `)}`;
      break;
    }
  }
  return t`${i} ${c} ${a}`;
}, S = (n, e, s = !1) => {
  const o = [], r = [];
  let a;
  const i = (c, u, g = !1) => {
    if (c.AND)
      for (const l of c.AND)
        i(l, u);
    else if (c.OR)
      for (const l of c.OR)
        i(l, u, !0);
    else {
      const l = f(c, u);
      g ? r.push(l) : o.push(l);
    }
  };
  return i(n, e, s), o.length > 0 && r.length > 0 ? a = t.join(
    [
      t`(${t.join(o, t` AND `)})`,
      t`(${t.join(r, t` OR `)})`
    ],
    t`${n.AND ? t` AND ` : t` OR `}`
  ) : o.length > 0 ? a = t.join(o, t` AND `) : r.length > 0 && (a = t.join(r, t` OR `)), a ? t`WHERE ${a}` : t``;
}, T = (n, e) => {
  let s = t`LIMIT ${n}`;
  return e && (s = t`LIMIT ${n} OFFSET ${e}`), s;
}, d = (n) => t`${t.identifier([n])}`, L = (n) => t`WHERE id = ${n}`, D = (n, e) => n ? S(n, e) : t``, m = (n, e) => {
  if (e && e.length > 0) {
    const s = [];
    for (const o of e) {
      const r = o.direction === "ASC" ? t`ASC` : t`DESC`;
      s.push(
        t`${t.identifier([n, o.key])} ${r}`
      );
    }
    return t`ORDER BY ${t.join(s, t`,`)}`;
  }
  return t`ORDER BY id ASC`;
}, F = (n, e, s) => ({
  all: (o) => {
    const r = [];
    for (const a of o)
      r.push(n`${n.identifier([a])}`);
    return n`
        SELECT ${n.join(r, n`, `)}
        FROM ${d(e)}
        ORDER BY id ASC
      `;
  },
  create: (o) => {
    const r = [], a = [];
    for (const c in o) {
      const u = c, g = o[u];
      r.push(u), a.push(g);
    }
    const i = r.map((c) => n.identifier([c]));
    return n`
        INSERT INTO ${d(e)}
        (${n.join(i, n`, `)}, created_at, updated_at)
        VALUES (${n.join(a, n`, `)}, NOW(), NOW())
        RETURNING *;
      `;
  },
  delete: (o) => n`
        DELETE FROM ${d(e)}
        WHERE id = ${o}
        RETURNING *;
      `,
  findById: (o) => n`
        SELECT *
        FROM ${d(e)}
        WHERE id = ${o}
      `,
  list: (o, r, a, i) => n`
        SELECT *
        FROM ${d(e)}
        ${D(a, e)}
        ${m(e, i)}
        ${T(
    Math.min(
      o ?? s.pagination.default_limit,
      s?.pagination.max_limit
    ),
    r
  )};
      `,
  update: (o, r) => {
    const a = [];
    for (const i in r) {
      const c = r[i];
      a.push(n`${n.identifier([i])} = ${c}`);
    }
    return n`
        UPDATE ${d(e)}
        SET ${n.join(a, n`, `)}
        WHERE id = ${o}
        RETURNING *;
      `;
  }
}), b = "tenants", O = (n, e, s) => {
  const o = F(s, b, n);
  return {
    all: async () => {
      const r = o.all(["id", "name", "slug"]);
      return await e.connect((i) => i.any(r));
    },
    create: async (r) => {
      const a = o.create(r);
      return await e.connect(async (i) => i.query(a).then((c) => c.rows[0]));
    },
    delete: async (r) => {
      const a = o.delete(r);
      return await e.connect((c) => c.one(a));
    },
    findById: async (r) => {
      const a = o.findById(r);
      return await e.connect((c) => c.maybeOne(a));
    },
    update: async (r, a) => {
      const i = o.update(r, a);
      return await e.connect((c) => c.query(i).then((u) => u.rows[0]));
    }
  };
}, I = async (n, e) => {
  await n.query(`CREATE SCHEMA IF NOT EXISTS ${e};`), await n.query(`SET search_path TO ${e};`);
}, N = (n) => {
  const e = n.slonik;
  return {
    database: e.db.databaseName,
    user: e.db.username,
    password: e.db.password,
    host: e.db.host,
    port: e.db.port,
    ensureDatabaseExists: !0,
    defaultDatabase: "postgres"
  };
}, E = async (n, e, s) => {
  const o = N(n), r = new R.Client(o);
  await r.connect(), s && await I(r, s), await w({ client: r }, e), await r.end();
}, C = async (n) => {
  const e = await $(y(n.slonik.db));
  return {
    connect: e.connect.bind(e),
    pool: e,
    query: e.query.bind(e)
  };
}, A = async (n) => {
  const s = n.slonik.migrations.path;
  await E(n, s);
  const o = await C(n), a = await O(n, o, t).all();
  for (const i of a.values())
    await E(n, s + "/tenants", i.slug);
}, v = async (n, e, s) => {
  const o = n.config.slonik;
  try {
    n.log.info("Registering fastify-slonik plugin"), n.register(k, {
      connectionString: y(o.db)
    });
  } catch (r) {
    throw n.log.error("🔴 Failed to connect, check your connection string"), r;
  }
  n.log.info("Running database migrations"), A(n.config), s();
}, M = p(v);
export {
  F as SqlFactory,
  O as TenantService,
  T as createLimitFragment,
  d as createTableFragment,
  L as createWhereIdFragment,
  M as default,
  N as getMigrateDatabaseConfig,
  E as runMigrations
};

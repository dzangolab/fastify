import p from "fastify-plugin";
import { createPool as E, sql as t, stringifyDsn as $ } from "slonik";
import * as w from "pg";
import { migrate as y } from "postgres-migrations";
var h = async (n, e) => {
  const { connectionString: s } = e;
  let r;
  try {
    r = await E(s);
  } catch (a) {
    throw n.log.error("🔴 Error happened while connecting to Postgres DB"), new Error(a);
  }
  try {
    await r.connect(async () => {
      n.log.info("✅ Connected to Postgres DB");
    });
  } catch {
    n.log.error("🔴 Error happened while connecting to Postgres DB");
  }
  const o = {
    connect: r.connect.bind(r),
    pool: r,
    query: r.query.bind(r)
  };
  !n.hasDecorator("slonik") && !n.hasDecorator("sql") && (n.decorate("slonik", o), n.decorate("sql", t)), !n.hasRequestDecorator("slonik") && !n.hasRequestDecorator("sql") && (n.decorateRequest("slonik", null), n.decorateRequest("sql", null), n.addHook("onRequest", async (a) => {
    a.slonik = o, a.sql = t;
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
const R = async (n, e) => {
  await n.query(`CREATE SCHEMA IF NOT EXISTS ${e};`), await n.query(`SET search_path TO ${e};`);
}, T = async (n, e, s) => {
  await R(n, s.slug), await y({ client: n }, e);
}, S = (n, e) => {
  const s = n.key, r = n.operator || "eq", o = n.not || !1;
  let a = n.value;
  const i = t.identifier([e, s]);
  let c;
  switch (r) {
    case "ct":
    case "sw":
    case "ew": {
      a = {
        ct: `%${a}%`,
        ew: `%${a}`,
        sw: `${a}%`
      }[r], c = o ? t`NOT ILIKE` : t`ILIKE`;
      break;
    }
    case "eq":
    default: {
      c = o ? t`!=` : t`=`;
      break;
    }
    case "gt": {
      c = o ? t`<` : t`>`;
      break;
    }
    case "gte": {
      c = o ? t`<` : t`>=`;
      break;
    }
    case "lte": {
      c = o ? t`>` : t`<=`;
      break;
    }
    case "lt": {
      c = o ? t`>` : t`<`;
      break;
    }
    case "in": {
      c = o ? t`NOT IN` : t`IN`, a = t`(${t.join(a.split(","), t`, `)})`;
      break;
    }
    case "bt": {
      c = o ? t`NOT BETWEEN` : t`BETWEEN`, a = t`${t.join(a.split(","), t` AND `)}`;
      break;
    }
  }
  return t`${i} ${c} ${a}`;
}, f = (n, e, s = !1) => {
  const r = [], o = [];
  let a;
  const i = (c, u, g = !1) => {
    if (c.AND)
      for (const l of c.AND)
        i(l, u);
    else if (c.OR)
      for (const l of c.OR)
        i(l, u, !0);
    else {
      const l = S(c, u);
      g ? o.push(l) : r.push(l);
    }
  };
  return i(n, e, s), r.length > 0 && o.length > 0 ? a = t.join(
    [
      t`(${t.join(r, t` AND `)})`,
      t`(${t.join(o, t` OR `)})`
    ],
    t`${n.AND ? t` AND ` : t` OR `}`
  ) : r.length > 0 ? a = t.join(r, t` AND `) : o.length > 0 && (a = t.join(o, t` OR `)), a ? t`WHERE ${a}` : t``;
}, m = (n, e) => {
  let s = t`LIMIT ${n}`;
  return e && (s = t`LIMIT ${n} OFFSET ${e}`), s;
}, d = (n) => t`${t.identifier([n])}`, L = (n) => t`WHERE id = ${n}`, D = (n, e) => n ? f(n, e) : t``, b = (n, e) => {
  if (e && e.length > 0) {
    const s = [];
    for (const r of e) {
      const o = r.direction === "ASC" ? t`ASC` : t`DESC`;
      s.push(
        t`${t.identifier([n, r.key])} ${o}`
      );
    }
    return t`ORDER BY ${t.join(s, t`,`)}`;
  }
  return t`ORDER BY id ASC`;
}, F = (n, e, s) => ({
  all: (r) => {
    const o = [];
    for (const a of r)
      o.push(n`${n.identifier([a])}`);
    return n`
        SELECT ${n.join(o, n`, `)}
        FROM ${d(e)}
        ORDER BY id ASC
      `;
  },
  create: (r) => {
    const o = [], a = [];
    for (const c in r) {
      const u = c, g = r[u];
      o.push(u), a.push(g);
    }
    const i = o.map((c) => n.identifier([c]));
    return n`
        INSERT INTO ${d(e)}
        (${n.join(i, n`, `)}, created_at, updated_at)
        VALUES (${n.join(a, n`, `)}, NOW(), NOW())
        RETURNING *;
      `;
  },
  delete: (r) => n`
        DELETE FROM ${d(e)}
        WHERE id = ${r}
        RETURNING *;
      `,
  findById: (r) => n`
        SELECT *
        FROM ${d(e)}
        WHERE id = ${r}
      `,
  list: (r, o, a, i) => n`
        SELECT *
        FROM ${d(e)}
        ${D(a, e)}
        ${b(e, i)}
        ${m(
    Math.min(
      r ?? s.pagination.default_limit,
      s?.pagination.max_limit
    ),
    o
  )};
      `,
  update: (r, o) => {
    const a = [];
    for (const i in o) {
      const c = o[i];
      a.push(n`${n.identifier([i])} = ${c}`);
    }
    return n`
        UPDATE ${d(e)}
        SET ${n.join(a, n`, `)}
        WHERE id = ${r}
        RETURNING *;
      `;
  }
}), O = "tenants", I = (n, e, s) => {
  const r = F(s, O, n);
  return {
    all: async () => {
      const o = r.all(["id", "name", "slug"]);
      return await e.connect((i) => i.any(o));
    },
    create: async (o) => {
      const a = r.create(o);
      return await e.connect(async (i) => i.query(a).then((c) => c.rows[0]));
    },
    delete: async (o) => {
      const a = r.delete(o);
      return await e.connect((c) => c.one(a));
    },
    findById: async (o) => {
      const a = r.findById(o);
      return await e.connect((c) => c.maybeOne(a));
    },
    update: async (o, a) => {
      const i = r.update(o, a);
      return await e.connect((c) => c.query(i).then((u) => u.rows[0]));
    }
  };
}, N = async (n) => {
  const e = await E($(n.slonik.db));
  return {
    connect: e.connect.bind(e),
    pool: e,
    query: e.query.bind(e)
  };
}, C = (n) => {
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
}, A = async (n) => {
  const e = n.slonik, s = C(n), r = new w.Client(s);
  await r.connect();
  const o = e.migrations.path;
  await y({ client: r }, o);
  const a = await N(n), c = await I(n, a, t).all();
  for (const u of c.values())
    await T(r, o + "/tenants", u);
  await R(r, "public");
}, v = async (n, e, s) => {
  const r = n.config.slonik;
  try {
    n.log.info("Registering fastify-slonik plugin"), n.register(k, {
      connectionString: $(r.db)
    });
  } catch (o) {
    throw n.log.error("🔴 Failed to connect, check your connection string"), o;
  }
  n.log.info("Running database migrations"), A(n.config), s();
}, M = p(v);
export {
  F as SqlFactory,
  I as TenantService,
  R as changeSchema,
  m as createLimitFragment,
  d as createTableFragment,
  L as createWhereIdFragment,
  M as default,
  C as getMigrateDatabaseConfig,
  T as runTenantMigrations
};

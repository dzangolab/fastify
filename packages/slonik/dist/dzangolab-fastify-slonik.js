import g from "fastify-plugin";
import { createPool as R, sql as n, stringifyDsn as y } from "slonik";
import { migrate as m } from "postgres-migrations";
import * as D from "pg";
var $ = async (t, a) => {
  const { connectionString: i } = a;
  let e;
  try {
    e = await R(i);
  } catch (o) {
    throw t.log.error("🔴 Error happened while connecting to Postgres DB"), new Error(o);
  }
  try {
    await e.connect(async () => {
      t.log.info("✅ Connected to Postgres DB");
    });
  } catch {
    t.log.error("🔴 Error happened while connecting to Postgres DB");
  }
  const r = {
    connect: e.connect.bind(e),
    pool: e,
    query: e.query.bind(e)
  };
  !t.hasDecorator("slonik") && !t.hasDecorator("sql") && (t.decorate("slonik", r), t.decorate("sql", n)), !t.hasRequestDecorator("slonik") && !t.hasRequestDecorator("sql") && (t.decorateRequest("slonik", null), t.decorateRequest("sql", null), t.addHook("onRequest", async (o) => {
    o.slonik = r, o.sql = n;
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
const T = (t, a) => {
  const i = t.key, e = t.operator || "eq", r = t.not || !1;
  let o = t.value;
  const s = n.identifier([a, i]);
  let c;
  switch (e) {
    case "ct":
    case "sw":
    case "ew": {
      o = {
        ct: `%${o}%`,
        ew: `%${o}`,
        sw: `${o}%`
      }[e], c = r ? n`NOT ILIKE` : n`ILIKE`;
      break;
    }
    case "eq":
    default: {
      c = r ? n`!=` : n`=`;
      break;
    }
    case "gt": {
      c = r ? n`<` : n`>`;
      break;
    }
    case "gte": {
      c = r ? n`<` : n`>=`;
      break;
    }
    case "lte": {
      c = r ? n`>` : n`<=`;
      break;
    }
    case "lt": {
      c = r ? n`>` : n`<`;
      break;
    }
    case "in": {
      c = r ? n`NOT IN` : n`IN`, o = n`(${n.join(o.split(","), n`, `)})`;
      break;
    }
    case "bt": {
      c = r ? n`NOT BETWEEN` : n`BETWEEN`, o = n`${n.join(o.split(","), n` AND `)}`;
      break;
    }
  }
  return n`${s} ${c} ${o}`;
}, F = (t, a, i = !1) => {
  const e = [], r = [];
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
      p ? r.push(l) : e.push(l);
    }
  };
  return s(t, a, i), e.length > 0 && r.length > 0 ? o = n.join(
    [
      n`(${n.join(e, n` AND `)})`,
      n`(${n.join(r, n` OR `)})`
    ],
    n`${t.AND ? n` AND ` : n` OR `}`
  ) : e.length > 0 ? o = n.join(e, n` AND `) : r.length > 0 && (o = n.join(r, n` OR `)), o ? n`WHERE ${o}` : n``;
}, k = (t, a) => {
  let i = n`LIMIT ${t}`;
  return a && (i = n`LIMIT ${t} OFFSET ${a}`), i;
}, d = (t) => n`${n.identifier([t])}`, W = (t) => n`WHERE id = ${t}`, O = (t, a) => t ? F(t, a) : n``, I = (t, a) => {
  if (a && a.length > 0) {
    const i = [];
    for (const e of a) {
      const r = e.direction === "ASC" ? n`ASC` : n`DESC`;
      i.push(
        n`${n.identifier([t, e.key])} ${r}`
      );
    }
    return n`ORDER BY ${n.join(i, n`,`)}`;
  }
  return n`ORDER BY id ASC`;
}, N = (t, a, i) => ({
  all: (e) => {
    const r = [];
    for (const o of e)
      r.push(t`${t.identifier([o])}`);
    return t`
        SELECT ${t.join(r, t`, `)}
        FROM ${d(a)}
        ORDER BY id ASC
      `;
  },
  create: (e) => {
    const r = [], o = [];
    for (const c in e) {
      const u = c, p = e[u];
      r.push(u), o.push(p);
    }
    const s = r.map((c) => t.identifier([c]));
    return t`
        INSERT INTO ${d(a)}
        (${t.join(s, t`, `)}, created_at, updated_at)
        VALUES (${t.join(o, t`, `)}, NOW(), NOW())
        RETURNING *;
      `;
  },
  delete: (e) => t`
        DELETE FROM ${d(a)}
        WHERE id = ${e}
        RETURNING *;
      `,
  findById: (e) => t`
        SELECT *
        FROM ${d(a)}
        WHERE id = ${e}
      `,
  list: (e, r, o, s) => t`
        SELECT *
        FROM ${d(a)}
        ${O(o, a)}
        ${I(a, s)}
        ${k(
    Math.min(
      e ?? i.pagination.default_limit,
      i?.pagination.max_limit
    ),
    r
  )};
      `,
  update: (e, r) => {
    const o = [];
    for (const s in r) {
      const c = r[s];
      o.push(t`${t.identifier([s])} = ${c}`);
    }
    return t`
        UPDATE ${d(a)}
        SET ${t.join(o, t`, `)}
        WHERE id = ${e}
        RETURNING *;
      `;
  }
}), b = "tenants", f = (t, a, i) => {
  const e = N(i, b, t);
  return {
    all: async () => {
      const r = e.all(["id", "name", "slug"]);
      return await a.connect((s) => s.any(r));
    },
    create: async (r) => {
      const o = e.create(r);
      return await a.connect(async (s) => s.query(o).then((c) => c.rows[0]));
    },
    delete: async (r) => {
      const o = e.delete(r);
      return await a.connect((c) => c.one(o));
    },
    findById: async (r) => {
      const o = e.findById(r);
      return await a.connect((c) => c.maybeOne(o));
    },
    update: async (r, o) => {
      const s = e.update(r, o);
      return await a.connect((c) => c.query(s).then((u) => u.rows[0]));
    }
  };
}, h = async (t, a) => {
  await t.query(`CREATE SCHEMA IF NOT EXISTS ${a};`), await t.query(`SET search_path TO ${a};`);
}, w = async (t) => {
  const a = new D.Client(t);
  return await a.connect(), a;
}, E = async (t, a, i) => {
  const e = "client" in t ? t.client : await w(t);
  i && await h(e, i), await m({ client: e }, a), "client" in t || await e.end();
}, A = (t) => ({
  database: t.db.databaseName,
  user: t.db.username,
  password: t.db.password,
  host: t.db.host,
  port: t.db.port,
  ensureDatabaseExists: !0,
  defaultDatabase: "postgres"
}), v = async (t, a, i) => {
  try {
    t.log.info("Running database migrations");
    const e = A(
      t.config.slonik
    ), r = await w(e), o = t.config.slonik.migrations.path;
    await E({ client: r }, o);
    const c = await f(t.config, t.slonik, n).all();
    for (const u of c.values())
      t.log.info(`Running migrations for tenant ${u.name}`), await E({ client: r }, o + "/tenants", u.slug);
    await h(r, "public"), await r.end();
  } catch (e) {
    throw t.log.error("🔴 Failed to run the migrations"), e;
  }
  i();
}, j = g(v), B = async (t, a, i) => {
  const e = t.config.slonik;
  try {
    t.log.info("Registering fastify-slonik plugin"), await t.register(S, {
      connectionString: y(e.db)
    });
  } catch (r) {
    throw t.log.error("🔴 Failed to connect, check your connection string"), r;
  }
  await t.register(j), i();
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

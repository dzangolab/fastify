import g from "fastify-plugin";
import { createPool as h, sql as t, stringifyDsn as R } from "slonik";
import { migrate as E } from "pg-node-migrations";
var $ = async (e, c) => {
  const { connectionString: i } = c;
  let n;
  try {
    n = await h(i);
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
var y = g($, {
  fastify: "4.x",
  name: "fastify-slonik"
});
const m = async (e, c, i) => {
  const n = e.config.slonik;
  try {
    e.log.info("Registering fastify-slonik plugin"), e.register(y, {
      connectionString: R(n.db)
    });
  } catch (r) {
    throw e.log.error("🔴 Failed to connect, check your connection string"), r;
  }
  i();
}, j = g(m), D = (e, c) => {
  const i = e.key, n = e.operator || "eq", r = e.not || !1;
  let o = e.value;
  const s = t.identifier([c, i]);
  let a;
  switch (n) {
    case "ct":
    case "sw":
    case "ew": {
      o = {
        ct: `%${o}%`,
        ew: `%${o}`,
        sw: `${o}%`
      }[n], a = r ? t`NOT ILIKE` : t`ILIKE`;
      break;
    }
    case "eq":
    default: {
      a = r ? t`!=` : t`=`;
      break;
    }
    case "gt": {
      a = r ? t`<` : t`>`;
      break;
    }
    case "gte": {
      a = r ? t`<` : t`>=`;
      break;
    }
    case "lte": {
      a = r ? t`>` : t`<=`;
      break;
    }
    case "lt": {
      a = r ? t`>` : t`<`;
      break;
    }
    case "in": {
      a = r ? t`NOT IN` : t`IN`, o = t`(${t.join(o.split(","), t`, `)})`;
      break;
    }
    case "bt": {
      a = r ? t`NOT BETWEEN` : t`BETWEEN`, o = t`${t.join(o.split(","), t` AND `)}`;
      break;
    }
  }
  return t`${s} ${a} ${o}`;
}, w = (e, c, i = !1) => {
  const n = [], r = [];
  let o;
  const s = (a, u, p = !1) => {
    if (a.AND)
      for (const l of a.AND)
        s(l, u);
    else if (a.OR)
      for (const l of a.OR)
        s(l, u, !0);
    else {
      const l = D(a, u);
      p ? r.push(l) : n.push(l);
    }
  };
  return s(e, c, i), n.length > 0 && r.length > 0 ? o = t.join(
    [
      t`(${t.join(n, t` AND `)})`,
      t`(${t.join(r, t` OR `)})`
    ],
    t`${e.AND ? t` AND ` : t` OR `}`
  ) : n.length > 0 ? o = t.join(n, t` AND `) : r.length > 0 && (o = t.join(r, t` OR `)), o ? t`WHERE ${o}` : t``;
}, F = (e, c) => {
  let i = t`LIMIT ${e}`;
  return c && (i = t`LIMIT ${e} OFFSET ${c}`), i;
}, d = (e) => t`${t.identifier([e])}`, B = (e) => t`WHERE id = ${e}`, k = (e, c) => e ? w(e, c) : t``, S = (e, c) => {
  if (c && c.length > 0) {
    const i = [];
    for (const n of c) {
      const r = n.direction === "ASC" ? t`ASC` : t`DESC`;
      i.push(
        t`${t.identifier([e, n.key])} ${r}`
      );
    }
    return t`ORDER BY ${t.join(i, t`,`)}`;
  }
  return t`ORDER BY id ASC`;
}, T = (e, c, i) => ({
  all: (n) => {
    const r = [];
    for (const o of n)
      r.push(e`${e.identifier([o])}`);
    return e`
        SELECT ${e.join(r, e`, `)}
        FROM ${d(c)}
        ORDER BY id ASC
      `;
  },
  create: (n) => {
    const r = [], o = [];
    for (const a in n) {
      const u = a, p = n[u];
      r.push(u), o.push(p);
    }
    const s = r.map((a) => e.identifier([a]));
    return e`
        INSERT INTO ${d(c)}
        (${e.join(s, e`, `)}, created_at, updated_at)
        VALUES (${e.join(o, e`, `)}, NOW(), NOW())
        RETURNING *;
      `;
  },
  delete: (n) => e`
        DELETE FROM ${d(c)}
        WHERE id = ${n}
        RETURNING *;
      `,
  findById: (n) => e`
        SELECT *
        FROM ${d(c)}
        WHERE id = ${n}
      `,
  list: (n, r, o, s) => e`
        SELECT *
        FROM ${d(c)}
        ${k(o, c)}
        ${S(c, s)}
        ${F(
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
      const a = r[s];
      o.push(e`${e.identifier([s])} = ${a}`);
    }
    return e`
        UPDATE ${d(c)}
        SET ${e.join(o, e`, `)}
        WHERE id = ${n}
        RETURNING *;
      `;
  }
}), O = "tenants", I = (e, c, i) => {
  const n = T(i, O, e);
  return {
    all: async () => {
      const r = n.all(["id", "name", "slug"]);
      return await c.connect((s) => s.any(r));
    },
    create: async (r) => {
      const o = n.create(r);
      return await c.connect(async (s) => s.query(o).then((a) => a.rows[0]));
    },
    delete: async (r) => {
      const o = n.delete(r);
      return await c.connect((a) => a.one(o));
    },
    findById: async (r) => {
      const o = n.findById(r);
      return await c.connect((a) => a.maybeOne(o));
    },
    update: async (r, o) => {
      const s = n.update(r, o);
      return await c.connect((a) => a.query(s).then((u) => u.rows[0]));
    }
  };
}, f = (e) => ({
  database: e.db.databaseName,
  user: e.db.username,
  password: e.db.password,
  host: e.db.host,
  port: e.db.port,
  ensureDatabaseExists: !0,
  defaultDatabase: "postgres"
}), N = async (e, c, i) => {
  try {
    e.log.info("Running database migrations");
    const n = f(
      e.config.slonik
    ), r = e.config.slonik.migrations.path;
    await E(n, r);
    const s = await I(e.config, e.slonik, t).all();
    for (const a of s.values())
      await E(n, r + "/tenants", {
        schemaName: a.slug
      });
  } catch (n) {
    throw e.log.error("🔴 Failed to run the migrations"), n;
  }
  i();
}, L = g(N);
export {
  T as SqlFactory,
  I as TenantService,
  F as createLimitFragment,
  d as createTableFragment,
  B as createWhereIdFragment,
  j as default,
  f as getMigrateDatabaseConfig,
  L as migratePlugin
};

import d from "fastify-plugin";
import { SchemaValidationError as S, createPool as E, sql as t, stringifyDsn as T } from "slonik";
import m from "humps";
import { migrate as q } from "@dzangolab/postgres-migrations";
import { z as g } from "zod";
const $ = {
  transformRow: (a, e, n, r) => m.camelizeKeys(n)
}, R = {
  // If you are not going to transform results using Zod, then you should use `afterQueryExecution` instead.
  // Future versions of Zod will provide a more efficient parser when parsing without transformations.
  // You can even combine the two – use `afterQueryExecution` to validate results, and (conditionally)
  // transform results as needed in `transformRow`.
  transformRow: (a, e, n, r) => {
    const { resultParser: i } = a;
    if (!i)
      return n;
    const s = i.safeParse(n);
    if (!s.success)
      throw new S(
        e,
        n,
        s.error.issues
      );
    return s.data;
  }
}, b = (a) => {
  const e = {
    captureStackTrace: !1,
    connectionRetryLimit: 3,
    connectionTimeout: 5e3,
    idleInTransactionSessionTimeout: 6e4,
    idleTimeout: 5e3,
    interceptors: [],
    maximumPoolSize: 10,
    queryRetryLimit: 5,
    statementTimeout: 6e4,
    transactionRetryLimit: 5,
    ...a
  };
  return e.interceptors = [
    $,
    R,
    ...a?.interceptors ?? []
  ], e;
}, v = async (a) => {
  const e = a.slonik, n = {
    database: e.db.databaseName,
    user: e.db.username,
    password: e.db.password,
    host: e.db.host,
    port: e.db.port,
    // Default: false for backwards-compatibility
    // This might change!
    ensureDatabaseExists: !0,
    // Default: "postgres"
    // Used when checking/creating "database-name"
    defaultDatabase: "postgres"
  }, r = "migrations";
  await q(
    n,
    e?.migrations?.path || r
  );
}, F = async (a, e) => {
  const n = await E(
    a,
    b(e)
  );
  return {
    connect: n.connect.bind(n),
    pool: n,
    query: n.query.bind(n)
  };
}, p = async (a, e) => {
  const { connectionString: n, clientConfiguration: r } = e;
  let i;
  try {
    i = await F(n, r), await i.pool.connect(async () => {
      a.log.info("✅ Connected to Postgres DB");
    });
  } catch (s) {
    throw a.log.error("🔴 Error happened while connecting to Postgres DB"), new Error(s);
  }
  !a.hasDecorator("slonik") && !a.hasDecorator("sql") && (a.decorate("slonik", i), a.decorate("sql", t)), !a.hasRequestDecorator("slonik") && !a.hasRequestDecorator("sql") && (a.decorateRequest("slonik", null), a.decorateRequest("sql", null), a.addHook("onRequest", async (s) => {
    s.slonik = i, s.sql = t;
  }));
}, D = d(p, {
  fastify: "4.x",
  name: "fastify-slonik"
});
d(p, {
  fastify: "4.x",
  name: "fastify-slonik"
});
const L = async (a, e, n) => {
  const r = a.config.slonik;
  a.log.info("Registering fastify-slonik plugin"), a.register(D, {
    connectionString: T(r.db),
    clientConfiguration: b(r?.clientConfiguration)
  }), a.log.info("Running database migrations"), await v(a.config), n();
}, P = d(L), k = (a, e) => {
  const n = a.key, r = a.operator || "eq", i = a.not || !1;
  let s = a.value;
  const c = t.identifier([...e.names, n]);
  let o;
  switch (r) {
    case "ct":
    case "sw":
    case "ew": {
      s = {
        ct: `%${s}%`,
        // contains
        ew: `%${s}`,
        // ends with
        sw: `${s}%`
        // starts with
      }[r], o = i ? t.fragment`NOT ILIKE` : t.fragment`ILIKE`;
      break;
    }
    case "eq":
    default: {
      o = i ? t.fragment`!=` : t.fragment`=`;
      break;
    }
    case "gt": {
      o = i ? t.fragment`<` : t.fragment`>`;
      break;
    }
    case "gte": {
      o = i ? t.fragment`<` : t.fragment`>=`;
      break;
    }
    case "lte": {
      o = i ? t.fragment`>` : t.fragment`<=`;
      break;
    }
    case "lt": {
      o = i ? t.fragment`>` : t.fragment`<`;
      break;
    }
    case "in": {
      o = i ? t.fragment`NOT IN` : t.fragment`IN`, s = t.fragment`(${t.join(s.split(","), t.fragment`, `)})`;
      break;
    }
    case "bt": {
      o = i ? t.fragment`NOT BETWEEN` : t.fragment`BETWEEN`, s = t.fragment`${t.join(s.split(","), t.fragment` AND `)}`;
      break;
    }
  }
  return t.fragment`${c} ${o} ${s}`;
}, w = (a, e, n = !1) => {
  const r = [], i = [];
  let s;
  const c = (o, l, f = !1) => {
    if (o.AND)
      for (const u of o.AND)
        c(u, l);
    else if (o.OR)
      for (const u of o.OR)
        c(u, l, !0);
    else {
      const u = k(o, l);
      f ? i.push(u) : r.push(u);
    }
  };
  return c(a, e, n), r.length > 0 && i.length > 0 ? s = t.join(
    [
      t.fragment`(${t.join(r, t.fragment` AND `)})`,
      t.fragment`(${t.join(i, t.fragment` OR `)})`
    ],
    t.fragment`${a.AND ? t.fragment` AND ` : t.fragment` OR `}`
  ) : r.length > 0 ? s = t.join(r, t.fragment` AND `) : i.length > 0 && (s = t.join(i, t.fragment` OR `)), s ? t.fragment`WHERE ${s}` : t.fragment``;
}, y = (a, e) => a ? w(a, e) : t.fragment``, C = (a, e) => {
  let n = t.fragment`LIMIT ${a}`;
  return e && (n = t.fragment`LIMIT ${a} OFFSET ${e}`), n;
}, I = (a, e) => {
  if (e && e.length > 0) {
    const n = [];
    for (const r of e) {
      const i = r.direction === "ASC" ? t.fragment`ASC` : t.fragment`DESC`;
      n.push(
        t.fragment`${t.identifier([
          ...a.names,
          r.key
        ])} ${i}`
      );
    }
    return t.fragment`ORDER BY ${t.join(n, t.fragment`,`)}`;
  }
  return t.fragment`ORDER BY id ASC`;
}, N = (a, e) => t.fragment`${h(a, e)}`, h = (a, e) => t.identifier(e ? [e, a] : [a]), U = (a) => t.fragment`WHERE id = ${a}`;
class O {
  /* eslint-enabled */
  _service;
  constructor(e) {
    this._service = e;
  }
  getAllSql = (e) => {
    const n = [], r = {};
    for (const s of e)
      n.push(t.identifier([m.decamelize(s)])), r[s] = !0;
    const i = this.validationSchema._def.typeName === "ZodObject" ? this.validationSchema.pick(r) : g.any();
    return t.type(i)`
      SELECT ${t.join(n, t.fragment`, `)}
      FROM ${this.getTableFragment()}
      ORDER BY id ASC;
    `;
  };
  getCreateSql = (e) => {
    const n = [], r = [];
    for (const i in e) {
      const s = i, c = e[s];
      n.push(t.identifier([m.decamelize(s)])), r.push(c);
    }
    return t.type(this.validationSchema)`
      INSERT INTO ${this.getTableFragment()}
        (${t.join(n, t.fragment`, `)})
      VALUES (${t.join(r, t.fragment`, `)})
      RETURNING *;
    `;
  };
  getDeleteSql = (e) => t.type(this.validationSchema)`
      DELETE FROM ${this.getTableFragment()}
      WHERE id = ${e}
      RETURNING *;
    `;
  getFindByIdSql = (e) => t.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE id = ${e};
    `;
  getListSql = (e, n, r, i) => {
    const s = h(this.table, this.schema);
    return t.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${y(r, s)}
      ${I(s, i)}
      ${C(e, n)};
    `;
  };
  getTableFragment = () => N(this.table, this.schema);
  getUpdateSql = (e, n) => {
    const r = [];
    for (const i in n) {
      const s = n[i];
      r.push(
        t.fragment`${t.identifier([m.decamelize(i)])} = ${s}`
      );
    }
    return t.type(this.validationSchema)`
      UPDATE ${this.getTableFragment()}
      SET ${t.join(r, t.fragment`, `)}
      WHERE id = ${e}
      RETURNING *;
    `;
  };
  getCountSql = (e) => {
    const n = h(this.table, this.schema), r = g.object({
      count: g.number()
    });
    return t.type(r)`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()}
      ${y(e, n)};
    `;
  };
  get config() {
    return this.service.config;
  }
  get database() {
    return this.service.database;
  }
  get service() {
    return this._service;
  }
  get schema() {
    return this.service.schema;
  }
  get table() {
    return this.service.table;
  }
  get validationSchema() {
    return this.service.validationSchema;
  }
}
class x {
  /* eslint-enabled */
  static TABLE = void 0;
  static LIMIT_DEFAULT = 20;
  static LIMIT_MAX = 50;
  _config;
  _database;
  _factory;
  _schema = "public";
  _validationSchema = g.any();
  constructor(e, n, r) {
    this._config = e, this._database = n, r && (this._schema = r);
  }
  /**
   * Only for entities that support it. Returns the full list of entities,
   * with no filtering, no custom sorting order, no pagination,
   * but with a restricted set of data.
   * Example: to get the full list of countries to populate the CountryPicker
   */
  all = async (e) => {
    const n = this.factory.getAllSql(e);
    return await this.database.connect((i) => i.any(n));
  };
  create = async (e) => {
    const n = this.factory.getCreateSql(e), r = await this.database.connect(async (i) => i.query(n).then((s) => s.rows[0]));
    return r ? this.postCreate(r) : void 0;
  };
  delete = async (e) => {
    const n = this.factory.getDeleteSql(e);
    return await this.database.connect((i) => i.one(n));
  };
  findById = async (e) => {
    const n = this.factory.getFindByIdSql(e);
    return await this.database.connect((i) => i.maybeOne(n));
  };
  getLimitDefault = () => this.config.slonik?.pagination?.defaultLimit || this.constructor.LIMIT_DEFAULT;
  getLimitMax = () => this.config.slonik?.pagination?.maxLimit || this.constructor.LIMIT_MAX;
  list = async (e, n, r, i) => {
    const s = this.factory.getListSql(
      Math.min(e ?? this.getLimitDefault(), this.getLimitMax()),
      n,
      r,
      i
    ), [c, o, l] = await Promise.all([
      this.count(),
      this.count(r),
      this.database.connect((f) => f.any(s))
    ]);
    return {
      totalCount: c,
      filteredCount: o,
      data: l
    };
  };
  /** @deprecated use list() method instead */
  paginatedList = async (e, n, r, i) => this.list(e, n, r, i);
  count = async (e) => {
    const n = this.factory.getCountSql(e);
    return (await this.database.connect((i) => i.any(n)))[0].count;
  };
  update = async (e, n) => {
    const r = this.factory.getUpdateSql(e, n);
    return await this.database.connect((i) => i.query(r).then((s) => s.rows[0]));
  };
  get config() {
    return this._config;
  }
  get database() {
    return this._database;
  }
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new O(this)), this.factory;
  }
  get schema() {
    return this._schema || "public";
  }
  get table() {
    return this.constructor.TABLE;
  }
  get validationSchema() {
    return this._validationSchema || g.any();
  }
  postCreate = async (e) => e;
}
export {
  x as BaseService,
  O as DefaultSqlFactory,
  F as createDatabase,
  y as createFilterFragment,
  C as createLimitFragment,
  I as createSortFragment,
  N as createTableFragment,
  h as createTableIdentifier,
  U as createWhereIdFragment,
  P as default
};

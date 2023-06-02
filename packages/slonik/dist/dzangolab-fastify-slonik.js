import d from "fastify-plugin";
import { SchemaValidationError as E, createPool as T, sql as t, stringifyDsn as q } from "slonik";
import l from "humps";
import { migrate as $ } from "@dzangolab/postgres-migrations";
import { z as m } from "zod";
const R = {
  transformRow: (r, e, n, a) => l.camelizeKeys(n)
}, I = {
  // If you are not going to transform results using Zod, then you should use `afterQueryExecution` instead.
  // Future versions of Zod will provide a more efficient parser when parsing without transformations.
  // You can even combine the two – use `afterQueryExecution` to validate results, and (conditionally)
  // transform results as needed in `transformRow`.
  transformRow: (r, e, n, a) => {
    const { resultParser: i } = r;
    if (!i)
      return n;
    const s = i.safeParse(n);
    if (!s.success)
      throw new E(
        e,
        n,
        s.error.issues
      );
    return s.data;
  }
}, S = (r) => {
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
    ...r
  };
  return e.interceptors = [
    R,
    I,
    ...r?.interceptors ?? []
  ], e;
}, v = async (r) => {
  const e = r.slonik, n = {
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
  }, a = "migrations";
  await $(
    n,
    e?.migrations?.path || a
  );
}, D = async (r, e) => {
  const n = await T(
    r,
    S(e)
  );
  return {
    connect: n.connect.bind(n),
    pool: n,
    query: n.query.bind(n)
  };
}, p = async (r, e) => {
  const { connectionString: n, clientConfiguration: a } = e;
  let i;
  try {
    i = await D(n, a), await i.pool.connect(async () => {
      r.log.info("✅ Connected to Postgres DB");
    });
  } catch (s) {
    throw r.log.error("🔴 Error happened while connecting to Postgres DB"), new Error(s);
  }
  !r.hasDecorator("slonik") && !r.hasDecorator("sql") && (r.decorate("slonik", i), r.decorate("sql", t)), !r.hasRequestDecorator("slonik") && !r.hasRequestDecorator("sql") && (r.decorateRequest("slonik", null), r.decorateRequest("sql", null), r.addHook("onRequest", async (s) => {
    s.slonik = i, s.sql = t;
  }));
}, L = d(p, {
  fastify: "4.x",
  name: "fastify-slonik"
});
d(p, {
  fastify: "4.x",
  name: "fastify-slonik"
});
const F = async (r, e, n) => {
  const a = r.config.slonik;
  r.log.info("Registering fastify-slonik plugin"), await r.register(L, {
    connectionString: q(a.db),
    clientConfiguration: S(a?.clientConfiguration)
  }), a.db.schema && a.db.schema !== "public" && await r.slonik.connect(async (i) => {
    const s = t.unsafe`CREATE SCHEMA IF NOT EXISTS ${t.identifier([
      a.db.schema
    ])};`;
    await i.query(s);
  }), r.log.info("Running database migrations"), await v(r.config), r.decorateRequest("dbSchema", ""), n();
}, B = d(F), N = (r, e) => {
  const n = l.decamelize(r.key), a = r.operator || "eq", i = r.not || !1;
  let s = r.value;
  const c = t.identifier([...e.names, n]);
  let o;
  if (a === "eq" && ["null", "NULL"].includes(s))
    return o = i ? t.fragment`IS NOT NULL` : t.fragment`IS NULL`, t.fragment`${c} ${o}`;
  switch (a) {
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
      }[a], o = i ? t.fragment`NOT ILIKE` : t.fragment`ILIKE`;
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
}, k = (r, e, n = !1) => {
  const a = [], i = [];
  let s;
  const c = (o, u, f = !1) => {
    if (o.AND)
      for (const g of o.AND)
        c(g, u);
    else if (o.OR)
      for (const g of o.OR)
        c(g, u, !0);
    else {
      const g = N(o, u);
      f ? i.push(g) : a.push(g);
    }
  };
  return c(r, e, n), a.length > 0 && i.length > 0 ? s = t.join(
    [
      t.fragment`(${t.join(a, t.fragment` AND `)})`,
      t.fragment`(${t.join(i, t.fragment` OR `)})`
    ],
    t.fragment`${r.AND ? t.fragment` AND ` : t.fragment` OR `}`
  ) : a.length > 0 ? s = t.join(a, t.fragment` AND `) : i.length > 0 && (s = t.join(i, t.fragment` OR `)), s ? t.fragment`WHERE ${s}` : t.fragment``;
}, y = (r, e) => r ? k(r, e) : t.fragment``, w = (r, e) => {
  let n = t.fragment`LIMIT ${r}`;
  return e && (n = t.fragment`LIMIT ${r} OFFSET ${e}`), n;
}, b = (r, e) => {
  if (e && e.length > 0) {
    const n = [];
    for (const a of e) {
      const i = a.direction === "ASC" ? t.fragment`ASC` : t.fragment`DESC`;
      n.push(
        t.fragment`${t.identifier([
          ...r.names,
          l.decamelize(a.key)
        ])} ${i}`
      );
    }
    return t.fragment`ORDER BY ${t.join(n, t.fragment`,`)}`;
  }
  return t.fragment``;
}, C = (r, e) => t.fragment`${h(r, e)}`, h = (r, e) => t.identifier(e ? [e, r] : [r]), P = (r) => t.fragment`WHERE id = ${r}`;
class O {
  /* eslint-enabled */
  _service;
  constructor(e) {
    this._service = e;
  }
  getAllSql = (e, n) => {
    const a = [], i = {};
    for (const o of e)
      a.push(t.identifier([l.decamelize(o)])), i[l.camelize(o)] = !0;
    const s = h(this.table, this.schema), c = this.validationSchema._def.typeName === "ZodObject" ? this.validationSchema.pick(i) : m.any();
    return t.type(c)`
      SELECT ${t.join(a, t.fragment`, `)}
      FROM ${this.getTableFragment()}
      ${b(s, this.getSortInput(n))}
    `;
  };
  getCreateSql = (e) => {
    const n = [], a = [];
    for (const i in e) {
      const s = i, c = e[s];
      n.push(t.identifier([l.decamelize(s)])), a.push(c);
    }
    return t.type(this.validationSchema)`
      INSERT INTO ${this.getTableFragment()}
        (${t.join(n, t.fragment`, `)})
      VALUES (${t.join(a, t.fragment`, `)})
      RETURNING *;
    `;
  };
  getCountSql = (e) => {
    const n = h(this.table, this.schema), a = m.object({
      count: m.number()
    });
    return t.type(a)`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()}
      ${y(e, n)};
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
  getListSql = (e, n, a, i) => {
    const s = h(this.table, this.schema);
    return t.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${y(a, s)}
      ${b(s, this.getSortInput(i))}
      ${w(e, n)};
    `;
  };
  getSortInput = (e) => e || [
    {
      key: this.sortKey,
      direction: this.sortDirection
    }
  ];
  getTableFragment = () => C(this.table, this.schema);
  getUpdateSql = (e, n) => {
    const a = [];
    for (const i in n) {
      const s = n[i];
      a.push(
        t.fragment`${t.identifier([l.decamelize(i)])} = ${s}`
      );
    }
    return t.type(this.validationSchema)`
      UPDATE ${this.getTableFragment()}
      SET ${t.join(a, t.fragment`, `)}
      WHERE id = ${e}
      RETURNING *;
    `;
  };
  get config() {
    return this.service.config;
  }
  get database() {
    return this.service.database;
  }
  get sortDirection() {
    return this.service.sortDirection;
  }
  get sortKey() {
    return this.service.sortKey;
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
  static SORT_DIRECTION = "ASC";
  static SORT_KEY = "id";
  _config;
  _database;
  _factory;
  _schema;
  _validationSchema = m.any();
  constructor(e, n, a) {
    this._config = e, this._database = n, a && (this._schema = a);
  }
  /**
   * Only for entities that support it. Returns the full list of entities,
   * with no filtering, no custom sorting order, no pagination,
   * but with a restricted set of data.
   * Example: to get the full list of countries to populate the CountryPicker
   */
  all = async (e, n) => {
    const a = this.factory.getAllSql(e, n);
    return await this.database.connect((s) => s.any(a));
  };
  create = async (e) => {
    const n = this.factory.getCreateSql(e), a = await this.database.connect(async (i) => i.query(n).then((s) => s.rows[0]));
    return a ? this.postCreate(a) : void 0;
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
  list = async (e, n, a, i) => {
    const s = this.factory.getListSql(
      Math.min(e ?? this.getLimitDefault(), this.getLimitMax()),
      n,
      a,
      i
    ), [c, o, u] = await Promise.all([
      this.count(),
      this.count(a),
      this.database.connect((f) => f.any(s))
    ]);
    return {
      totalCount: c,
      filteredCount: o,
      data: u
    };
  };
  count = async (e) => {
    const n = this.factory.getCountSql(e);
    return (await this.database.connect((i) => i.any(n)))[0].count;
  };
  update = async (e, n) => {
    const a = this.factory.getUpdateSql(e, n);
    return await this.database.connect((i) => i.query(a).then((s) => s.rows[0]));
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
  get sortDirection() {
    return this.constructor.SORT_DIRECTION;
  }
  get sortKey() {
    return this.constructor.SORT_KEY;
  }
  get schema() {
    return this._schema || this.config.slonik.db.schema || "public";
  }
  get table() {
    return this.constructor.TABLE;
  }
  get validationSchema() {
    return this._validationSchema || m.any();
  }
  postCreate = async (e) => e;
}
export {
  x as BaseService,
  O as DefaultSqlFactory,
  D as createDatabase,
  y as createFilterFragment,
  w as createLimitFragment,
  b as createSortFragment,
  C as createTableFragment,
  h as createTableIdentifier,
  P as createWhereIdFragment,
  B as default
};

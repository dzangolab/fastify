import d from "fastify-plugin";
import { createPool as p, sql as t, stringifyDsn as E } from "slonik";
import g from "humps";
import { migrate as T } from "@dzangolab/postgres-migrations";
const R = {
  transformRow: (r, e, n, s) => g.camelizeKeys(n)
}, f = (r) => {
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
    ...r?.interceptors ?? []
  ], e;
}, $ = async (r) => {
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
  }, s = "migrations";
  await T(
    n,
    e?.migrations?.path || s
  );
}, q = async (r, e) => {
  const n = await p(
    r,
    f(e)
  );
  return {
    connect: n.connect.bind(n),
    pool: n,
    query: n.query.bind(n)
  };
}, b = async (r, e) => {
  const { connectionString: n, clientConfiguration: s } = e;
  let a;
  try {
    a = await q(n, s), await a.pool.connect(async () => {
      r.log.info("✅ Connected to Postgres DB");
    });
  } catch (i) {
    throw r.log.error("🔴 Error happened while connecting to Postgres DB"), new Error(i);
  }
  !r.hasDecorator("slonik") && !r.hasDecorator("sql") && (r.decorate("slonik", a), r.decorate("sql", t)), !r.hasRequestDecorator("slonik") && !r.hasRequestDecorator("sql") && (r.decorateRequest("slonik", null), r.decorateRequest("sql", null), r.addHook("onRequest", async (i) => {
    i.slonik = a, i.sql = t;
  }));
}, S = d(b, {
  fastify: "4.x",
  name: "fastify-slonik"
});
d(b, {
  fastify: "4.x",
  name: "fastify-slonik"
});
const F = async (r, e, n) => {
  const s = r.config.slonik;
  r.log.info("Registering fastify-slonik plugin"), r.register(S, {
    connectionString: E(s.db),
    clientConfiguration: f(s?.clientConfiguration)
  }), r.log.info("Running database migrations"), await $(r.config), n();
}, _ = d(F), D = (r, e) => {
  const n = r.key, s = r.operator || "eq", a = r.not || !1;
  let i = r.value;
  const c = t.identifier([...e.names, n]);
  let o;
  switch (s) {
    case "ct":
    case "sw":
    case "ew": {
      i = {
        ct: `%${i}%`,
        // contains
        ew: `%${i}`,
        // ends with
        sw: `${i}%`
        // starts with
      }[s], o = a ? t`NOT ILIKE` : t`ILIKE`;
      break;
    }
    case "eq":
    default: {
      o = a ? t`!=` : t`=`;
      break;
    }
    case "gt": {
      o = a ? t`<` : t`>`;
      break;
    }
    case "gte": {
      o = a ? t`<` : t`>=`;
      break;
    }
    case "lte": {
      o = a ? t`>` : t`<=`;
      break;
    }
    case "lt": {
      o = a ? t`>` : t`<`;
      break;
    }
    case "in": {
      o = a ? t`NOT IN` : t`IN`, i = t`(${t.join(i.split(","), t`, `)})`;
      break;
    }
    case "bt": {
      o = a ? t`NOT BETWEEN` : t`BETWEEN`, i = t`${t.join(i.split(","), t` AND `)}`;
      break;
    }
  }
  return t`${c} ${o} ${i}`;
}, L = (r, e, n = !1) => {
  const s = [], a = [];
  let i;
  const c = (o, u, y = !1) => {
    if (o.AND)
      for (const l of o.AND)
        c(l, u);
    else if (o.OR)
      for (const l of o.OR)
        c(l, u, !0);
    else {
      const l = D(o, u);
      y ? a.push(l) : s.push(l);
    }
  };
  return c(r, e, n), s.length > 0 && a.length > 0 ? i = t.join(
    [
      t`(${t.join(s, t` AND `)})`,
      t`(${t.join(a, t` OR `)})`
    ],
    t`${r.AND ? t` AND ` : t` OR `}`
  ) : s.length > 0 ? i = t.join(s, t` AND `) : a.length > 0 && (i = t.join(a, t` OR `)), i ? t`WHERE ${i}` : t``;
}, m = (r, e) => r ? L(r, e) : t``, w = (r, e) => {
  let n = t`LIMIT ${r}`;
  return e && (n = t`LIMIT ${r} OFFSET ${e}`), n;
}, I = (r, e) => {
  if (e && e.length > 0) {
    const n = [];
    for (const s of e) {
      const a = s.direction === "ASC" ? t`ASC` : t`DESC`;
      n.push(
        t`${t.identifier([
          ...r.names,
          s.key
        ])} ${a}`
      );
    }
    return t`ORDER BY ${t.join(n, t`,`)}`;
  }
  return t`ORDER BY id ASC`;
}, k = (r, e) => t`${h(r, e)}`, h = (r, e) => t.identifier(e ? [e, r] : [r]), M = (r) => t`WHERE id = ${r}`;
class C {
  /* eslint-enabled */
  _service;
  constructor(e) {
    this._service = e;
  }
  getAllSql = (e) => {
    const n = [];
    for (const s of e)
      n.push(t`${t.identifier([g.decamelize(s)])}`);
    return t`
      SELECT ${t.join(n, t`, `)}
      FROM ${this.getTableFragment()}
      ORDER BY id ASC;
    `;
  };
  getCreateSql = (e) => {
    const n = [], s = [];
    for (const a in e) {
      const i = a, c = e[i];
      n.push(t.identifier([g.decamelize(i)])), s.push(c);
    }
    return t`
      INSERT INTO ${this.getTableFragment()}
        (${t.join(n, t`, `)})
      VALUES (${t.join(s, t`, `)})
      RETURNING *;
    `;
  };
  getDeleteSql = (e) => t`
      DELETE FROM ${this.getTableFragment()}
      WHERE id = ${e}
      RETURNING *;
    `;
  getFindByIdSql = (e) => t`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE id = ${e};
    `;
  getListSql = (e, n, s, a) => {
    const i = h(this.table, this.schema);
    return t`
      SELECT *
      FROM ${this.getTableFragment()}
      ${m(s, i)}
      ${I(i, a)}
      ${w(e, n)};
    `;
  };
  getTableFragment = () => k(this.table, this.schema);
  getUpdateSql = (e, n) => {
    const s = [];
    for (const a in n) {
      const i = n[a];
      s.push(
        t`${t.identifier([g.decamelize(a)])} = ${i}`
      );
    }
    return t`
      UPDATE ${this.getTableFragment()}
      SET ${t.join(s, t`, `)}
      WHERE id = ${e}
      RETURNING *;
    `;
  };
  getCount = (e) => {
    const n = h(this.table, this.schema);
    return t`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()}
      ${m(e, n)};
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
}
class B {
  /* eslint-enabled */
  static TABLE = void 0;
  static LIMIT_DEFAULT = 20;
  static LIMIT_MAX = 50;
  _config;
  _database;
  _factory;
  _schema = "public";
  constructor(e, n, s) {
    this._config = e, this._database = n, s && (this._schema = s);
  }
  /**
   * Only for entities that support it. Returns the full list of entities,
   * with no filtering, no custom sorting order, no pagination,
   * but with a restricted set of data.
   * Example: to get the full list of countries to populate the CountryPicker
   */
  all = async (e) => {
    const n = this.factory.getAllSql(e);
    return await this.database.connect((a) => a.any(n));
  };
  create = async (e) => {
    const n = this.factory.getCreateSql(e), s = await this.database.connect(async (a) => a.query(n).then((i) => i.rows[0]));
    return s ? this.postCreate(s) : void 0;
  };
  delete = async (e) => {
    const n = this.factory.getDeleteSql(e);
    return await this.database.connect((a) => a.one(n));
  };
  findById = async (e) => {
    const n = this.factory.getFindByIdSql(e);
    return await this.database.connect((a) => a.maybeOne(n));
  };
  getLimitDefault = () => this.config.slonik?.pagination?.defaultLimit || this.constructor.LIMIT_DEFAULT;
  getLimitMax = () => this.config.slonik?.pagination?.maxLimit || this.constructor.LIMIT_MAX;
  list = async (e, n, s, a) => {
    const i = this.factory.getListSql(
      Math.min(e ?? this.getLimitDefault(), this.getLimitMax()),
      n,
      s,
      a
    );
    return await this.database.connect((o) => o.any(i));
  };
  paginatedList = async (e, n, s, a) => {
    const i = await this.list(e, n, s, a);
    return {
      totalCount: await this.count(s),
      data: [...i]
    };
  };
  count = async (e) => {
    const n = this.factory.getCount(e);
    return (await this.database.connect((a) => a.any(n)))[0].count;
  };
  update = async (e, n) => {
    const s = this.factory.getUpdateSql(e, n);
    return await this.database.connect((a) => a.query(s).then((i) => i.rows[0]));
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
    return this._factory || (this._factory = new C(this)), this.factory;
  }
  get schema() {
    return this._schema || "public";
  }
  get table() {
    return this.constructor.TABLE;
  }
  postCreate = async (e) => e;
}
export {
  B as BaseService,
  C as DefaultSqlFactory,
  q as createDatabase,
  m as createFilterFragment,
  w as createLimitFragment,
  I as createSortFragment,
  k as createTableFragment,
  h as createTableIdentifier,
  M as createWhereIdFragment,
  _ as default
};

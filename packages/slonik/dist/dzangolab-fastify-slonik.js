import _ from "fastify-plugin";
import { SchemaValidationError as T, createTypeParserPreset as R, sql as t, createPool as N, stringifyDsn as y } from "slonik";
import l from "humps";
import { z as d } from "zod";
import { migrate as S } from "@dzangolab/postgres-migrations";
import * as A from "pg";
const $ = {
  transformRow: (a, e, r, n) => l.camelizeKeys(r)
}, C = {
  // If you are not going to transform results using Zod, then you should use `afterQueryExecution` instead.
  // Future versions of Zod will provide a more efficient parser when parsing without transformations.
  // You can even combine the two – use `afterQueryExecution` to validate results, and (conditionally)
  // transform results as needed in `transformRow`.
  transformRow: (a, e, r, n) => {
    const { resultParser: i } = a;
    if (!i)
      return r;
    const s = i.safeParse(r);
    if (!s.success)
      throw new T(
        e,
        r,
        s.error.issues
      );
    return s.data;
  }
}, I = (a) => Number.parseInt(a, 10), O = () => ({
  name: "int8",
  parse: I
}), p = (a) => {
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
    typeParsers: [...R(), O()],
    ...a
  };
  return e.interceptors = [
    $,
    C,
    ...a?.interceptors ?? []
  ], e;
}, L = t.unsafe`
  /* Update updated_at column for a table. */

  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  /* Add trigger to update updated_at for all tables (matching the filters). */

  CREATE OR REPLACE FUNCTION create_updated_at_trigger_to_all_tables()
  RETURNS void AS $$
  DECLARE
    table_name TEXT;
  DECLARE
    table_schema TEXT;
  BEGIN
    FOR table_name, table_schema IN
      SELECT
        c.table_name,
        c.table_schema
      FROM
        information_schema.columns c
        join information_schema.tables as t
        ON
        t.table_name = c.table_name
      WHERE
            c.column_name = 'updated_at'
            AND t.table_schema NOT IN ('pg_catalog', 'information_schema')
            AND t.table_schema NOT LIKE 'pg_toast%'
            AND t.table_schema NOT LIKE'pg_temp_%'
    LOOP
      IF NOT Exists(
          SELECT
            trigger_name
          FROM
            information_schema.triggers
          WHERE
            event_object_table = table_name
            AND trigger_name = CONCAT(table_name,'_updated_at_trigger')
            AND event_object_schema = table_schema
          )
      THEN
        EXECUTE 'CREATE OR REPLACE TRIGGER ' || table_name || '_updated_at_trigger BEFORE UPDATE ON ' || table_schema || '.' || table_name || ' FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()';
      END IF;
    END LOOP;
  END;
  $$ LANGUAGE plpgsql;

  /* Execute create_updated_at_trigger_to_all_tables as a Function. */

  CREATE OR REPLACE FUNCTION add_updated_at_trigger_to_all_existing_tables()
  RETURNS void AS $$
  BEGIN
    EXECUTE public.create_updated_at_trigger_to_all_tables();
  END;
  $$ LANGUAGE plpgsql;

  /* Add trigger to all existing tables. */

  SELECT add_updated_at_trigger_to_all_existing_tables();

  /* Execute create_updated_at_trigger_to_all_tables as a Trigger */

  CREATE OR REPLACE FUNCTION add_updated_at_trigger_to_all_tables()
  RETURNS event_trigger AS $$
  BEGIN
    EXECUTE public.create_updated_at_trigger_to_all_tables();
  END;
  $$ LANGUAGE plpgsql;

  DROP EVENT TRIGGER IF EXISTS on_create_or_update_table;

  /* Add trigger to add trigger to update updated_at in new table or altered table. */

  CREATE EVENT TRIGGER
  on_create_or_update_table ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'ALTER TABLE')
  EXECUTE FUNCTION add_updated_at_trigger_to_all_tables();

  /*
    Here, the difference between add_updated_at_trigger_to_all_existing_tables
    and add_updated_at_trigger_to_all_tables is that
    add_updated_at_trigger_to_all_existing_tables is a function and executes
    create_updated_at_trigger_to_all_tables as function discernible by its return type
    RETURNS void AS $$.

    But, add_updated_at_trigger_to_all_tables returns
    create_updated_at_trigger_to_all_tables as a trigger discernible by its return type
    RETURNS event_trigger AS $$.
  */
`, q = async (a) => {
  await a.connect(async (e) => {
    await e.query(L);
  });
}, D = async (a, e) => {
  const r = await N(
    a,
    p(e)
  );
  return {
    connect: r.connect.bind(r),
    pool: r,
    query: r.query.bind(r)
  };
}, b = async (a, e) => {
  const { connectionString: r, clientConfiguration: n } = e;
  let i;
  try {
    i = await D(r, n), await i.pool.connect(async () => {
      a.log.info("✅ Connected to Postgres DB");
    });
  } catch (s) {
    throw a.log.error("🔴 Error happened while connecting to Postgres DB"), new Error(s);
  }
  !a.hasDecorator("slonik") && !a.hasDecorator("sql") && (a.decorate("slonik", i), a.decorate("sql", t)), !a.hasRequestDecorator("slonik") && !a.hasRequestDecorator("sql") && (a.decorateRequest("slonik", null), a.decorateRequest("sql", null), a.addHook("onRequest", async (s) => {
    s.slonik = i, s.sql = t;
  }));
}, F = _(b, {
  fastify: "4.x",
  name: "fastify-slonik"
});
_(b, {
  fastify: "4.x",
  name: "fastify-slonik"
});
const v = async (a, e, r) => {
  const n = a.config.slonik;
  a.log.info("Registering fastify-slonik plugin"), await a.register(F, {
    connectionString: y(n.db),
    clientConfiguration: p(n?.clientConfiguration)
  }), n.migrations?.package !== !1 && await q(a.slonik), a.decorateRequest("dbSchema", ""), r();
}, X = _(v), w = (a, e) => {
  const r = l.decamelize(a.key), n = a.operator || "eq", i = a.not || !1;
  let s = a.value;
  const c = t.identifier([...e.names, r]);
  let o;
  if (n === "eq" && ["null", "NULL"].includes(s))
    return o = i ? t.fragment`IS NOT NULL` : t.fragment`IS NULL`, t.fragment`${c} ${o}`;
  switch (n) {
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
      }[n], o = i ? t.fragment`NOT ILIKE` : t.fragment`ILIKE`;
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
}, U = (a, e, r = !1) => {
  const n = [], i = [];
  let s;
  const c = (o, g, E = !1) => {
    if (o.AND)
      for (const u of o.AND)
        c(u, g);
    else if (o.OR)
      for (const u of o.OR)
        c(u, g, !0);
    else {
      const u = w(o, g);
      E ? i.push(u) : n.push(u);
    }
  };
  return c(a, e, r), n.length > 0 && i.length > 0 ? s = t.join(
    [
      t.fragment`(${t.join(n, t.fragment` AND `)})`,
      t.fragment`(${t.join(i, t.fragment` OR `)})`
    ],
    t.fragment`${a.AND ? t.fragment` AND ` : t.fragment` OR `}`
  ) : n.length > 0 ? s = t.join(n, t.fragment` AND `) : i.length > 0 && (s = t.join(i, t.fragment` OR `)), s ? t.fragment`WHERE ${s}` : t.fragment``;
}, h = (a, e) => a ? U(a, e) : t.fragment``, k = (a, e) => {
  let r = t.fragment`LIMIT ${a}`;
  return e && (r = t.fragment`LIMIT ${a} OFFSET ${e}`), r;
}, f = (a, e) => {
  if (e && e.length > 0) {
    const r = [];
    for (const n of e) {
      const i = n.direction === "ASC" ? t.fragment`ASC` : t.fragment`DESC`;
      r.push(
        t.fragment`${t.identifier([
          ...a.names,
          l.decamelize(n.key)
        ])} ${i}`
      );
    }
    return t.fragment`ORDER BY ${t.join(r, t.fragment`,`)}`;
  }
  return t.fragment``;
}, P = (a, e) => t.fragment`${m(a, e)}`, m = (a, e) => t.identifier(e ? [e, a] : [a]), z = (a) => t.fragment`WHERE id = ${a}`;
class G {
  /* eslint-enabled */
  _service;
  constructor(e) {
    this._service = e;
  }
  getAllSql = (e, r) => {
    const n = [], i = {};
    for (const o of e)
      n.push(t.identifier([l.decamelize(o)])), i[l.camelize(o)] = !0;
    const s = m(this.table, this.schema), c = this.validationSchema._def.typeName === "ZodObject" ? this.validationSchema.pick(i) : d.any();
    return t.type(c)`
      SELECT ${t.join(n, t.fragment`, `)}
      FROM ${this.getTableFragment()}
      ${f(s, this.getSortInput(r))}
    `;
  };
  getCreateSql = (e) => {
    const r = [], n = [];
    for (const i in e) {
      const s = i, c = e[s];
      r.push(t.identifier([l.decamelize(s)])), n.push(c);
    }
    return t.type(this.validationSchema)`
      INSERT INTO ${this.getTableFragment()}
        (${t.join(r, t.fragment`, `)})
      VALUES (${t.join(n, t.fragment`, `)})
      RETURNING *;
    `;
  };
  getCountSql = (e) => {
    const r = m(this.table, this.schema), n = d.object({
      count: d.number()
    });
    return t.type(n)`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()}
      ${h(e, r)};
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
  getListSql = (e, r, n, i) => {
    const s = m(this.table, this.schema);
    return t.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${h(n, s)}
      ${f(s, this.getSortInput(i))}
      ${k(e, r)};
    `;
  };
  getSortInput = (e) => e || [
    {
      key: this.sortKey,
      direction: this.sortDirection
    }
  ];
  getTableFragment = () => P(this.table, this.schema);
  getUpdateSql = (e, r) => {
    const n = [];
    for (const i in r) {
      const s = r[i];
      n.push(
        t.fragment`${t.identifier([l.decamelize(i)])} = ${s}`
      );
    }
    return t.type(this.validationSchema)`
      UPDATE ${this.getTableFragment()}
      SET ${t.join(n, t.fragment`, `)}
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
class V {
  /* eslint-enabled */
  static TABLE = void 0;
  static LIMIT_DEFAULT = 20;
  static LIMIT_MAX = 50;
  static SORT_DIRECTION = "ASC";
  static SORT_KEY = "id";
  _config;
  _database;
  _factory;
  _schema = "public";
  _validationSchema = d.any();
  constructor(e, r, n) {
    this._config = e, this._database = r, n && (this._schema = n);
  }
  /**
   * Only for entities that support it. Returns the full list of entities,
   * with no filtering, no custom sorting order, no pagination,
   * but with a restricted set of data.
   * Example: to get the full list of countries to populate the CountryPicker
   */
  all = async (e, r) => {
    const n = this.factory.getAllSql(e, r);
    return await this.database.connect((s) => s.any(n));
  };
  create = async (e) => {
    const r = this.factory.getCreateSql(e), n = await this.database.connect(async (i) => i.query(r).then((s) => s.rows[0]));
    return n ? this.postCreate(n) : void 0;
  };
  delete = async (e) => {
    const r = this.factory.getDeleteSql(e);
    return await this.database.connect((i) => i.one(r));
  };
  findById = async (e) => {
    const r = this.factory.getFindByIdSql(e);
    return await this.database.connect((i) => i.maybeOne(r));
  };
  getLimitDefault = () => this.config.slonik?.pagination?.defaultLimit || this.constructor.LIMIT_DEFAULT;
  getLimitMax = () => this.config.slonik?.pagination?.maxLimit || this.constructor.LIMIT_MAX;
  list = async (e, r, n, i) => {
    const s = this.factory.getListSql(
      Math.min(e ?? this.getLimitDefault(), this.getLimitMax()),
      r,
      n,
      i
    ), [c, o, g] = await Promise.all([
      this.count(),
      this.count(n),
      this.database.connect((E) => E.any(s))
    ]);
    return {
      totalCount: c,
      filteredCount: o,
      data: g
    };
  };
  count = async (e) => {
    const r = this.factory.getCountSql(e);
    return (await this.database.connect((i) => i.any(r)))[0].count;
  };
  update = async (e, r) => {
    const n = this.factory.getUpdateSql(e, r);
    return await this.database.connect((i) => i.query(n).then((s) => s.rows[0]));
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
    return this._factory || (this._factory = new G(this)), this._factory;
  }
  get sortDirection() {
    return this.constructor.SORT_DIRECTION;
  }
  get sortKey() {
    return this.constructor.SORT_KEY;
  }
  get schema() {
    return this._schema || "public";
  }
  get table() {
    return this.constructor.TABLE;
  }
  get validationSchema() {
    return this._validationSchema || d.any();
  }
  postCreate = async (e) => e;
}
const Y = (a) => a.toISOString().slice(0, 23).replace("T", " "), B = async (a) => {
  const e = a.slonik, r = "migrations";
  let n = {
    database: e.db.databaseName,
    user: e.db.username,
    password: e.db.password,
    host: e.db.host,
    port: e.db.port
  };
  e.clientConfiguration?.ssl && (n = {
    ...n,
    ssl: e.clientConfiguration?.ssl
  });
  const i = new A.Client(n);
  await i.connect(), await S(
    { client: i },
    e?.migrations?.path || r
  ), await i.end();
}, M = async (a, e, r) => {
  a.log.info("Running database migrations"), await B(a.config), r();
}, Q = _(M);
export {
  V as BaseService,
  G as DefaultSqlFactory,
  w as applyFilter,
  U as applyFiltersToQuery,
  O as createBigintTypeParser,
  D as createDatabase,
  h as createFilterFragment,
  k as createLimitFragment,
  f as createSortFragment,
  P as createTableFragment,
  m as createTableIdentifier,
  z as createWhereIdFragment,
  X as default,
  Y as formatDate,
  Q as migrationPlugin
};

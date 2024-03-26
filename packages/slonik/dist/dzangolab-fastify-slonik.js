import _ from "fastify-plugin";
import { SchemaValidationError as T, createTypeParserPreset as R, sql as e, createPool as N, stringifyDsn as y } from "slonik";
import l from "humps";
import { z as d } from "zod";
import { migrate as S } from "@dzangolab/postgres-migrations";
import * as A from "pg";
const $ = {
  transformRow: (a, t, r, n) => l.camelizeKeys(r)
}, C = {
  // If you are not going to transform results using Zod, then you should use `afterQueryExecution` instead.
  // Future versions of Zod will provide a more efficient parser when parsing without transformations.
  // You can even combine the two – use `afterQueryExecution` to validate results, and (conditionally)
  // transform results as needed in `transformRow`.
  transformRow: (a, t, r, n) => {
    const { resultParser: i } = a;
    if (!i)
      return r;
    const s = i.safeParse(r);
    if (!s.success)
      throw new T(
        t,
        r,
        s.error.issues
      );
    return s.data;
  }
}, I = (a) => Number.parseInt(a, 10), O = () => ({
  name: "int8",
  parse: I
}), p = (a) => {
  const t = {
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
  return t.interceptors = [
    $,
    C,
    ...a?.interceptors ?? []
  ], t;
}, L = e.unsafe`
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
  await a.connect(async (t) => {
    await t.query(L);
  });
}, D = async (a, t) => {
  const r = await N(
    a,
    p(t)
  );
  return {
    connect: r.connect.bind(r),
    pool: r,
    query: r.query.bind(r)
  };
}, b = async (a, t) => {
  const { connectionString: r, clientConfiguration: n } = t;
  let i;
  try {
    i = await D(r, n), await i.pool.connect(async () => {
      a.log.info("✅ Connected to Postgres DB");
    });
  } catch (s) {
    throw a.log.error("🔴 Error happened while connecting to Postgres DB"), new Error(s);
  }
  !a.hasDecorator("slonik") && !a.hasDecorator("sql") && (a.decorate("slonik", i), a.decorate("sql", e)), !a.hasRequestDecorator("slonik") && !a.hasRequestDecorator("sql") && (a.decorateRequest("slonik", null), a.decorateRequest("sql", null), a.addHook("onRequest", async (s) => {
    s.slonik = i, s.sql = e;
  }));
}, F = _(b, {
  fastify: "4.x",
  name: "fastify-slonik"
});
_(b, {
  fastify: "4.x",
  name: "fastify-slonik"
});
const v = async (a, t, r) => {
  const n = a.config.slonik;
  a.log.info("Registering fastify-slonik plugin"), await a.register(F, {
    connectionString: y(n.db),
    clientConfiguration: p(n?.clientConfiguration)
  }), n.migrations?.package !== !1 && await q(a.slonik), a.decorateRequest("dbSchema", ""), r();
}, X = _(v), w = (a, t) => {
  const r = l.decamelize(t.key), n = t.operator || "eq", i = t.not || !1;
  let s = t.value;
  const c = e.identifier([...a.names, r]);
  let o;
  if (n === "eq" && ["null", "NULL"].includes(s))
    return o = i ? e.fragment`IS NOT NULL` : e.fragment`IS NULL`, e.fragment`${c} ${o}`;
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
      }[n], o = i ? e.fragment`NOT ILIKE` : e.fragment`ILIKE`;
      break;
    }
    case "eq":
    default: {
      o = i ? e.fragment`!=` : e.fragment`=`;
      break;
    }
    case "gt": {
      o = i ? e.fragment`<` : e.fragment`>`;
      break;
    }
    case "gte": {
      o = i ? e.fragment`<` : e.fragment`>=`;
      break;
    }
    case "lte": {
      o = i ? e.fragment`>` : e.fragment`<=`;
      break;
    }
    case "lt": {
      o = i ? e.fragment`>` : e.fragment`<`;
      break;
    }
    case "in": {
      o = i ? e.fragment`NOT IN` : e.fragment`IN`, s = e.fragment`(${e.join(s.split(","), e.fragment`, `)})`;
      break;
    }
    case "bt": {
      o = i ? e.fragment`NOT BETWEEN` : e.fragment`BETWEEN`, s = e.fragment`${e.join(s.split(","), e.fragment` AND `)}`;
      break;
    }
  }
  return e.fragment`${c} ${o} ${s}`;
}, U = (a, t, r = !1) => {
  const n = [], i = [];
  let s;
  const c = (o, g, E = !1) => {
    if ("AND" in o)
      for (const u of o.AND)
        c(u, g);
    else if ("OR" in o)
      for (const u of o.OR)
        c(u, g, !0);
    else {
      const u = w(g, o);
      E ? i.push(u) : n.push(u);
    }
  };
  return c(a, t, r), n.length > 0 && i.length > 0 ? s = e.join(
    [
      e.fragment`(${e.join(n, e.fragment` AND `)})`,
      e.fragment`(${e.join(i, e.fragment` OR `)})`
    ],
    e.fragment`${"AND" in a ? e.fragment` AND ` : e.fragment` OR `}`
  ) : n.length > 0 ? s = e.join(n, e.fragment` AND `) : i.length > 0 && (s = e.join(i, e.fragment` OR `)), s ? e.fragment`WHERE ${s}` : e.fragment``;
}, h = (a, t) => a ? U(a, t) : e.fragment``, k = (a, t) => {
  let r = e.fragment`LIMIT ${a}`;
  return t && (r = e.fragment`LIMIT ${a} OFFSET ${t}`), r;
}, f = (a, t) => {
  if (t && t.length > 0) {
    const r = [];
    for (const n of t) {
      const i = n.direction === "ASC" ? e.fragment`ASC` : e.fragment`DESC`;
      r.push(
        e.fragment`${e.identifier([
          ...a.names,
          l.decamelize(n.key)
        ])} ${i}`
      );
    }
    return e.fragment`ORDER BY ${e.join(r, e.fragment`,`)}`;
  }
  return e.fragment``;
}, P = (a, t) => e.fragment`${m(a, t)}`, m = (a, t) => e.identifier(t ? [t, a] : [a]), z = (a) => e.fragment`WHERE id = ${a}`;
class G {
  /* eslint-enabled */
  _service;
  constructor(t) {
    this._service = t;
  }
  getAllSql = (t, r) => {
    const n = [], i = {};
    for (const o of t)
      n.push(e.identifier([l.decamelize(o)])), i[l.camelize(o)] = !0;
    const s = m(this.table, this.schema), c = this.validationSchema._def.typeName === "ZodObject" ? this.validationSchema.pick(i) : d.any();
    return e.type(c)`
      SELECT ${e.join(n, e.fragment`, `)}
      FROM ${this.getTableFragment()}
      ${f(s, this.getSortInput(r))}
    `;
  };
  getCreateSql = (t) => {
    const r = [], n = [];
    for (const i in t) {
      const s = i, c = t[s];
      r.push(e.identifier([l.decamelize(s)])), n.push(c);
    }
    return e.type(this.validationSchema)`
      INSERT INTO ${this.getTableFragment()}
        (${e.join(r, e.fragment`, `)})
      VALUES (${e.join(n, e.fragment`, `)})
      RETURNING *;
    `;
  };
  getCountSql = (t) => {
    const r = m(this.table, this.schema), n = d.object({
      count: d.number()
    });
    return e.type(n)`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()}
      ${h(t, r)};
    `;
  };
  getDeleteSql = (t) => e.type(this.validationSchema)`
      DELETE FROM ${this.getTableFragment()}
      WHERE id = ${t}
      RETURNING *;
    `;
  getFindByIdSql = (t) => e.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE id = ${t};
    `;
  getListSql = (t, r, n, i) => {
    const s = m(this.table, this.schema);
    return e.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${h(n, s)}
      ${f(s, this.getSortInput(i))}
      ${k(t, r)};
    `;
  };
  getSortInput = (t) => t || [
    {
      key: this.sortKey,
      direction: this.sortDirection
    }
  ];
  getTableFragment = () => P(this.table, this.schema);
  getUpdateSql = (t, r) => {
    const n = [];
    for (const i in r) {
      const s = r[i];
      n.push(
        e.fragment`${e.identifier([l.decamelize(i)])} = ${s}`
      );
    }
    return e.type(this.validationSchema)`
      UPDATE ${this.getTableFragment()}
      SET ${e.join(n, e.fragment`, `)}
      WHERE id = ${t}
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
  constructor(t, r, n) {
    this._config = t, this._database = r, n && (this._schema = n);
  }
  /**
   * Only for entities that support it. Returns the full list of entities,
   * with no filtering, no custom sorting order, no pagination,
   * but with a restricted set of data.
   * Example: to get the full list of countries to populate the CountryPicker
   */
  all = async (t, r) => {
    const n = this.factory.getAllSql(t, r);
    return await this.database.connect((s) => s.any(n));
  };
  create = async (t) => {
    const r = this.factory.getCreateSql(t), n = await this.database.connect(async (i) => i.query(r).then((s) => s.rows[0]));
    return n ? this.postCreate(n) : void 0;
  };
  delete = async (t) => {
    const r = this.factory.getDeleteSql(t);
    return await this.database.connect((i) => i.one(r));
  };
  findById = async (t) => {
    const r = this.factory.getFindByIdSql(t);
    return await this.database.connect((i) => i.maybeOne(r));
  };
  getLimitDefault = () => this.config.slonik?.pagination?.defaultLimit || this.constructor.LIMIT_DEFAULT;
  getLimitMax = () => this.config.slonik?.pagination?.maxLimit || this.constructor.LIMIT_MAX;
  list = async (t, r, n, i) => {
    const s = this.factory.getListSql(
      Math.min(t ?? this.getLimitDefault(), this.getLimitMax()),
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
  count = async (t) => {
    const r = this.factory.getCountSql(t);
    return (await this.database.connect((i) => i.any(r)))[0].count;
  };
  update = async (t, r) => {
    const n = this.factory.getUpdateSql(t, r);
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
  postCreate = async (t) => t;
}
const Y = (a) => a.toISOString().slice(0, 23).replace("T", " "), B = async (a) => {
  const t = a.slonik, r = "migrations";
  let n = {
    database: t.db.databaseName,
    user: t.db.username,
    password: t.db.password,
    host: t.db.host,
    port: t.db.port
  };
  t.clientConfiguration?.ssl && (n = {
    ...n,
    ssl: t.clientConfiguration?.ssl
  });
  const i = new A.Client(n);
  await i.connect(), await S(
    { client: i },
    t?.migrations?.path || r
  ), await i.end();
}, M = async (a, t, r) => {
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

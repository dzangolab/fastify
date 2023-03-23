import ke from "fastify-plugin";
import { SchemaValidationError as Me, createPool as Le, sql as d, stringifyDsn as De } from "slonik";
import se from "humps";
import { migrate as Pe } from "@dzangolab/postgres-migrations";
const Ve = {
  transformRow: (r, e, t, n) => se.camelizeKeys(t)
}, qe = {
  // If you are not going to transform results using Zod, then you should use `afterQueryExecution` instead.
  // Future versions of Zod will provide a more efficient parser when parsing without transformations.
  // You can even combine the two – use `afterQueryExecution` to validate results, and (conditionally)
  // transform results as needed in `transformRow`.
  transformRow: (r, e, t, n) => {
    const { resultParser: s } = r;
    if (!s)
      return t;
    const a = s.safeParse(t);
    if (!a.success)
      throw new Me(
        e,
        t,
        a.error.issues
      );
    return a.data;
  }
}, Ee = (r) => {
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
    Ve,
    qe,
    ...r?.interceptors ?? []
  ], e;
}, ze = async (r) => {
  const e = r.slonik, t = {
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
  }, n = "migrations";
  await Pe(
    t,
    e?.migrations?.path || n
  );
}, Ue = async (r, e) => {
  const t = await Le(
    r,
    Ee(e)
  );
  return {
    connect: t.connect.bind(t),
    pool: t,
    query: t.query.bind(t)
  };
}, Ne = async (r, e) => {
  const { connectionString: t, clientConfiguration: n } = e;
  let s;
  try {
    s = await Ue(t, n), await s.pool.connect(async () => {
      r.log.info("✅ Connected to Postgres DB");
    });
  } catch (a) {
    throw r.log.error("🔴 Error happened while connecting to Postgres DB"), new Error(a);
  }
  !r.hasDecorator("slonik") && !r.hasDecorator("sql") && (r.decorate("slonik", s), r.decorate("sql", d)), !r.hasRequestDecorator("slonik") && !r.hasRequestDecorator("sql") && (r.decorateRequest("slonik", null), r.decorateRequest("sql", null), r.addHook("onRequest", async (a) => {
    a.slonik = s, a.sql = d;
  }));
}, Be = ke(Ne, {
  fastify: "4.x",
  name: "fastify-slonik"
});
ke(Ne, {
  fastify: "4.x",
  name: "fastify-slonik"
});
const We = async (r, e, t) => {
  const n = r.config.slonik;
  r.log.info("Registering fastify-slonik plugin"), r.register(Be, {
    connectionString: De(n.db),
    clientConfiguration: Ee(n?.clientConfiguration)
  }), r.log.info("Running database migrations"), await ze(r.config), t();
}, er = ke(We), Fe = (r, e) => {
  const t = r.key, n = r.operator || "eq", s = r.not || !1;
  let a = r.value;
  const o = d.identifier([...e.names, t]);
  let i;
  switch (n) {
    case "ct":
    case "sw":
    case "ew": {
      a = {
        ct: `%${a}%`,
        // contains
        ew: `%${a}`,
        // ends with
        sw: `${a}%`
        // starts with
      }[n], i = s ? d.fragment`NOT ILIKE` : d.fragment`ILIKE`;
      break;
    }
    case "eq":
    default: {
      i = s ? d.fragment`!=` : d.fragment`=`;
      break;
    }
    case "gt": {
      i = s ? d.fragment`<` : d.fragment`>`;
      break;
    }
    case "gte": {
      i = s ? d.fragment`<` : d.fragment`>=`;
      break;
    }
    case "lte": {
      i = s ? d.fragment`>` : d.fragment`<=`;
      break;
    }
    case "lt": {
      i = s ? d.fragment`>` : d.fragment`<`;
      break;
    }
    case "in": {
      i = s ? d.fragment`NOT IN` : d.fragment`IN`, a = d.fragment`(${d.join(a.split(","), d.fragment`, `)})`;
      break;
    }
    case "bt": {
      i = s ? d.fragment`NOT BETWEEN` : d.fragment`BETWEEN`, a = d.fragment`${d.join(a.split(","), d.fragment` AND `)}`;
      break;
    }
  }
  return d.fragment`${o} ${i} ${a}`;
}, He = (r, e, t = !1) => {
  const n = [], s = [];
  let a;
  const o = (i, l, f = !1) => {
    if (i.AND)
      for (const g of i.AND)
        o(g, l);
    else if (i.OR)
      for (const g of i.OR)
        o(g, l, !0);
    else {
      const g = Fe(i, l);
      f ? s.push(g) : n.push(g);
    }
  };
  return o(r, e, t), n.length > 0 && s.length > 0 ? a = d.join(
    [
      d.fragment`(${d.join(n, d.fragment` AND `)})`,
      d.fragment`(${d.join(s, d.fragment` OR `)})`
    ],
    d.fragment`${r.AND ? d.fragment` AND ` : d.fragment` OR `}`
  ) : n.length > 0 ? a = d.join(n, d.fragment` AND `) : s.length > 0 && (a = d.join(s, d.fragment` OR `)), a ? d.fragment`WHERE ${a}` : d.fragment``;
}, we = (r, e) => r ? He(r, e) : d.fragment``, Ye = (r, e) => {
  let t = d.fragment`LIMIT ${r}`;
  return e && (t = d.fragment`LIMIT ${r} OFFSET ${e}`), t;
}, Je = (r, e) => {
  if (e && e.length > 0) {
    const t = [];
    for (const n of e) {
      const s = n.direction === "ASC" ? d.fragment`ASC` : d.fragment`DESC`;
      t.push(
        d.fragment`${d.identifier([
          ...r.names,
          n.key
        ])} ${s}`
      );
    }
    return d.fragment`ORDER BY ${d.join(t, d.fragment`,`)}`;
  }
  return d.fragment`ORDER BY id ASC`;
}, Ge = (r, e) => d.fragment`${ye(r, e)}`, ye = (r, e) => d.identifier(e ? [e, r] : [r]), tr = (r) => d.fragment`WHERE id = ${r}`;
var x;
(function(r) {
  r.assertEqual = (s) => s;
  function e(s) {
  }
  r.assertIs = e;
  function t(s) {
    throw new Error();
  }
  r.assertNever = t, r.arrayToEnum = (s) => {
    const a = {};
    for (const o of s)
      a[o] = o;
    return a;
  }, r.getValidEnumValues = (s) => {
    const a = r.objectKeys(s).filter((i) => typeof s[s[i]] != "number"), o = {};
    for (const i of a)
      o[i] = s[i];
    return r.objectValues(o);
  }, r.objectValues = (s) => r.objectKeys(s).map(function(a) {
    return s[a];
  }), r.objectKeys = typeof Object.keys == "function" ? (s) => Object.keys(s) : (s) => {
    const a = [];
    for (const o in s)
      Object.prototype.hasOwnProperty.call(s, o) && a.push(o);
    return a;
  }, r.find = (s, a) => {
    for (const o of s)
      if (a(o))
        return o;
  }, r.isInteger = typeof Number.isInteger == "function" ? (s) => Number.isInteger(s) : (s) => typeof s == "number" && isFinite(s) && Math.floor(s) === s;
  function n(s, a = " | ") {
    return s.map((o) => typeof o == "string" ? `'${o}'` : o).join(a);
  }
  r.joinValues = n, r.jsonStringifyReplacer = (s, a) => typeof a == "bigint" ? a.toString() : a;
})(x || (x = {}));
var ve;
(function(r) {
  r.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(ve || (ve = {}));
const u = x.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), I = (r) => {
  switch (typeof r) {
    case "undefined":
      return u.undefined;
    case "string":
      return u.string;
    case "number":
      return isNaN(r) ? u.nan : u.number;
    case "boolean":
      return u.boolean;
    case "function":
      return u.function;
    case "bigint":
      return u.bigint;
    case "symbol":
      return u.symbol;
    case "object":
      return Array.isArray(r) ? u.array : r === null ? u.null : r.then && typeof r.then == "function" && r.catch && typeof r.catch == "function" ? u.promise : typeof Map < "u" && r instanceof Map ? u.map : typeof Set < "u" && r instanceof Set ? u.set : typeof Date < "u" && r instanceof Date ? u.date : u.object;
    default:
      return u.unknown;
  }
}, c = x.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]), Ke = (r) => JSON.stringify(r, null, 2).replace(/"([^"]+)":/g, "$1:");
class S extends Error {
  constructor(e) {
    super(), this.issues = [], this.addIssue = (n) => {
      this.issues = [...this.issues, n];
    }, this.addIssues = (n = []) => {
      this.issues = [...this.issues, ...n];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  get errors() {
    return this.issues;
  }
  format(e) {
    const t = e || function(a) {
      return a.message;
    }, n = { _errors: [] }, s = (a) => {
      for (const o of a.issues)
        if (o.code === "invalid_union")
          o.unionErrors.map(s);
        else if (o.code === "invalid_return_type")
          s(o.returnTypeError);
        else if (o.code === "invalid_arguments")
          s(o.argumentsError);
        else if (o.path.length === 0)
          n._errors.push(t(o));
        else {
          let i = n, l = 0;
          for (; l < o.path.length; ) {
            const f = o.path[l];
            l === o.path.length - 1 ? (i[f] = i[f] || { _errors: [] }, i[f]._errors.push(t(o))) : i[f] = i[f] || { _errors: [] }, i = i[f], l++;
          }
        }
    };
    return s(this), n;
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, x.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, n = [];
    for (const s of this.issues)
      s.path.length > 0 ? (t[s.path[0]] = t[s.path[0]] || [], t[s.path[0]].push(e(s))) : n.push(e(s));
    return { formErrors: n, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
S.create = (r) => new S(r);
const F = (r, e) => {
  let t;
  switch (r.code) {
    case c.invalid_type:
      r.received === u.undefined ? t = "Required" : t = `Expected ${r.expected}, received ${r.received}`;
      break;
    case c.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(r.expected, x.jsonStringifyReplacer)}`;
      break;
    case c.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${x.joinValues(r.keys, ", ")}`;
      break;
    case c.invalid_union:
      t = "Invalid input";
      break;
    case c.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${x.joinValues(r.options)}`;
      break;
    case c.invalid_enum_value:
      t = `Invalid enum value. Expected ${x.joinValues(r.options)}, received '${r.received}'`;
      break;
    case c.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case c.invalid_return_type:
      t = "Invalid function return type";
      break;
    case c.invalid_date:
      t = "Invalid date";
      break;
    case c.invalid_string:
      typeof r.validation == "object" ? "includes" in r.validation ? (t = `Invalid input: must include "${r.validation.includes}"`, typeof r.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${r.validation.position}`)) : "startsWith" in r.validation ? t = `Invalid input: must start with "${r.validation.startsWith}"` : "endsWith" in r.validation ? t = `Invalid input: must end with "${r.validation.endsWith}"` : x.assertNever(r.validation) : r.validation !== "regex" ? t = `Invalid ${r.validation}` : t = "Invalid";
      break;
    case c.too_small:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "more than"} ${r.minimum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "over"} ${r.minimum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${r.minimum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(r.minimum))}` : t = "Invalid input";
      break;
    case c.too_big:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "less than"} ${r.maximum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "under"} ${r.maximum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "bigint" ? t = `BigInt must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly" : r.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(r.maximum))}` : t = "Invalid input";
      break;
    case c.custom:
      t = "Invalid input";
      break;
    case c.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case c.not_multiple_of:
      t = `Number must be a multiple of ${r.multipleOf}`;
      break;
    case c.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, x.assertNever(r);
  }
  return { message: t };
};
let Ce = F;
function Xe(r) {
  Ce = r;
}
function ie() {
  return Ce;
}
const oe = (r) => {
  const { data: e, path: t, errorMaps: n, issueData: s } = r, a = [...t, ...s.path || []], o = {
    ...s,
    path: a
  };
  let i = "";
  const l = n.filter((f) => !!f).slice().reverse();
  for (const f of l)
    i = f(o, { data: e, defaultError: i }).message;
  return {
    ...s,
    path: a,
    message: s.message || i
  };
}, Qe = [];
function h(r, e) {
  const t = oe({
    issueData: e,
    data: r.data,
    path: r.path,
    errorMaps: [
      r.common.contextualErrorMap,
      r.schemaErrorMap,
      ie(),
      F
      // then global default map
    ].filter((n) => !!n)
  });
  r.common.issues.push(t);
}
class k {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const n = [];
    for (const s of t) {
      if (s.status === "aborted")
        return y;
      s.status === "dirty" && e.dirty(), n.push(s.value);
    }
    return { status: e.value, value: n };
  }
  static async mergeObjectAsync(e, t) {
    const n = [];
    for (const s of t)
      n.push({
        key: await s.key,
        value: await s.value
      });
    return k.mergeObjectSync(e, n);
  }
  static mergeObjectSync(e, t) {
    const n = {};
    for (const s of t) {
      const { key: a, value: o } = s;
      if (a.status === "aborted" || o.status === "aborted")
        return y;
      a.status === "dirty" && e.dirty(), o.status === "dirty" && e.dirty(), (typeof o.value < "u" || s.alwaysSet) && (n[a.value] = o.value);
    }
    return { status: e.value, value: n };
  }
}
const y = Object.freeze({
  status: "aborted"
}), Ze = (r) => ({ status: "dirty", value: r }), w = (r) => ({ status: "valid", value: r }), _e = (r) => r.status === "aborted", xe = (r) => r.status === "dirty", ce = (r) => r.status === "valid", de = (r) => typeof Promise < "u" && r instanceof Promise;
var m;
(function(r) {
  r.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r.toString = (e) => typeof e == "string" ? e : e?.message;
})(m || (m = {}));
class C {
  constructor(e, t, n, s) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = s;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const Te = (r, e) => {
  if (ce(e))
    return { success: !0, data: e.value };
  if (!r.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new S(r.common.issues);
      return this._error = t, this._error;
    }
  };
};
function v(r) {
  if (!r)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: n, description: s } = r;
  if (e && (t || n))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: s } : { errorMap: (o, i) => o.code !== "invalid_type" ? { message: i.defaultError } : typeof i.data > "u" ? { message: n ?? i.defaultError } : { message: t ?? i.defaultError }, description: s };
}
class _ {
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this);
  }
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return I(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: I(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new k(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: I(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (de(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const n = this.safeParse(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  safeParse(e, t) {
    var n;
    const s = {
      common: {
        issues: [],
        async: (n = t?.async) !== null && n !== void 0 ? n : !1,
        contextualErrorMap: t?.errorMap
      },
      path: t?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: I(e)
    }, a = this._parseSync({ data: e, path: s.path, parent: s });
    return Te(s, a);
  }
  async parseAsync(e, t) {
    const n = await this.safeParseAsync(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  async safeParseAsync(e, t) {
    const n = {
      common: {
        issues: [],
        contextualErrorMap: t?.errorMap,
        async: !0
      },
      path: t?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: I(e)
    }, s = this._parse({ data: e, path: n.path, parent: n }), a = await (de(s) ? s : Promise.resolve(s));
    return Te(n, a);
  }
  refine(e, t) {
    const n = (s) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(s) : t;
    return this._refinement((s, a) => {
      const o = e(s), i = () => a.addIssue({
        code: c.custom,
        ...n(s)
      });
      return typeof Promise < "u" && o instanceof Promise ? o.then((l) => l ? !0 : (i(), !1)) : o ? !0 : (i(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((n, s) => e(n) ? !0 : (s.addIssue(typeof t == "function" ? t(n, s) : t), !1));
  }
  _refinement(e) {
    return new N({
      schema: this,
      typeName: p.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  optional() {
    return R.create(this, this._def);
  }
  nullable() {
    return P.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return E.create(this, this._def);
  }
  promise() {
    return W.create(this, this._def);
  }
  or(e) {
    return G.create([this, e], this._def);
  }
  and(e) {
    return K.create(this, e, this._def);
  }
  transform(e) {
    return new N({
      ...v(this._def),
      schema: this,
      typeName: p.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new re({
      ...v(this._def),
      innerType: this,
      defaultValue: t,
      typeName: p.ZodDefault
    });
  }
  brand() {
    return new Oe({
      typeName: p.ZodBranded,
      type: this,
      ...v(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new he({
      ...v(this._def),
      innerType: this,
      catchValue: t,
      typeName: p.ZodCatch
    });
  }
  describe(e) {
    const t = this.constructor;
    return new t({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return ne.create(this, e);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const et = /^c[^\s-]{8,}$/i, tt = /^[a-z][a-z0-9]*$/, rt = /[0-9A-HJKMNP-TV-Z]{26}/, nt = /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i, st = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/, at = /^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u, it = /^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/, ot = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/, ct = (r) => r.precision ? r.offset ? new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${r.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`) : new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${r.precision}}Z$`) : r.precision === 0 ? r.offset ? new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$") : new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$") : r.offset ? new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$") : new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$");
function dt(r, e) {
  return !!((e === "v4" || !e) && it.test(r) || (e === "v6" || !e) && ot.test(r));
}
class T extends _ {
  constructor() {
    super(...arguments), this._regex = (e, t, n) => this.refinement((s) => e.test(s), {
      validation: t,
      code: c.invalid_string,
      ...m.errToObj(n)
    }), this.nonempty = (e) => this.min(1, m.errToObj(e)), this.trim = () => new T({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    }), this.toLowerCase = () => new T({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    }), this.toUpperCase = () => new T({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== u.string) {
      const a = this._getOrReturnCtx(e);
      return h(
        a,
        {
          code: c.invalid_type,
          expected: u.string,
          received: a.parsedType
        }
        //
      ), y;
    }
    const n = new k();
    let s;
    for (const a of this._def.checks)
      if (a.kind === "min")
        e.data.length < a.value && (s = this._getOrReturnCtx(e, s), h(s, {
          code: c.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), n.dirty());
      else if (a.kind === "max")
        e.data.length > a.value && (s = this._getOrReturnCtx(e, s), h(s, {
          code: c.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), n.dirty());
      else if (a.kind === "length") {
        const o = e.data.length > a.value, i = e.data.length < a.value;
        (o || i) && (s = this._getOrReturnCtx(e, s), o ? h(s, {
          code: c.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }) : i && h(s, {
          code: c.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }), n.dirty());
      } else if (a.kind === "email")
        st.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
          validation: "email",
          code: c.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "emoji")
        at.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
          validation: "emoji",
          code: c.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "uuid")
        nt.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
          validation: "uuid",
          code: c.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "cuid")
        et.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
          validation: "cuid",
          code: c.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "cuid2")
        tt.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
          validation: "cuid2",
          code: c.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "ulid")
        rt.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
          validation: "ulid",
          code: c.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "url")
        try {
          new URL(e.data);
        } catch {
          s = this._getOrReturnCtx(e, s), h(s, {
            validation: "url",
            code: c.invalid_string,
            message: a.message
          }), n.dirty();
        }
      else
        a.kind === "regex" ? (a.regex.lastIndex = 0, a.regex.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
          validation: "regex",
          code: c.invalid_string,
          message: a.message
        }), n.dirty())) : a.kind === "trim" ? e.data = e.data.trim() : a.kind === "includes" ? e.data.includes(a.value, a.position) || (s = this._getOrReturnCtx(e, s), h(s, {
          code: c.invalid_string,
          validation: { includes: a.value, position: a.position },
          message: a.message
        }), n.dirty()) : a.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : a.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : a.kind === "startsWith" ? e.data.startsWith(a.value) || (s = this._getOrReturnCtx(e, s), h(s, {
          code: c.invalid_string,
          validation: { startsWith: a.value },
          message: a.message
        }), n.dirty()) : a.kind === "endsWith" ? e.data.endsWith(a.value) || (s = this._getOrReturnCtx(e, s), h(s, {
          code: c.invalid_string,
          validation: { endsWith: a.value },
          message: a.message
        }), n.dirty()) : a.kind === "datetime" ? ct(a).test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
          code: c.invalid_string,
          validation: "datetime",
          message: a.message
        }), n.dirty()) : a.kind === "ip" ? dt(e.data, a.version) || (s = this._getOrReturnCtx(e, s), h(s, {
          validation: "ip",
          code: c.invalid_string,
          message: a.message
        }), n.dirty()) : x.assertNever(a);
    return { status: n.value, value: e.data };
  }
  _addCheck(e) {
    return new T({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...m.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...m.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...m.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...m.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...m.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...m.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...m.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...m.errToObj(e) });
  }
  datetime(e) {
    var t;
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof e?.precision > "u" ? null : e?.precision,
      offset: (t = e?.offset) !== null && t !== void 0 ? t : !1,
      ...m.errToObj(e?.message)
    });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...m.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t?.position,
      ...m.errToObj(t?.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...m.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...m.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...m.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...m.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...m.errToObj(t)
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
T.create = (r) => {
  var e;
  return new T({
    checks: [],
    typeName: p.ZodString,
    coerce: (e = r?.coerce) !== null && e !== void 0 ? e : !1,
    ...v(r)
  });
};
function ut(r, e) {
  const t = (r.toString().split(".")[1] || "").length, n = (e.toString().split(".")[1] || "").length, s = t > n ? t : n, a = parseInt(r.toFixed(s).replace(".", "")), o = parseInt(e.toFixed(s).replace(".", ""));
  return a % o / Math.pow(10, s);
}
class j extends _ {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== u.number) {
      const a = this._getOrReturnCtx(e);
      return h(a, {
        code: c.invalid_type,
        expected: u.number,
        received: a.parsedType
      }), y;
    }
    let n;
    const s = new k();
    for (const a of this._def.checks)
      a.kind === "int" ? x.isInteger(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        code: c.invalid_type,
        expected: "integer",
        received: "float",
        message: a.message
      }), s.dirty()) : a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (n = this._getOrReturnCtx(e, n), h(n, {
        code: c.too_small,
        minimum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), s.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (n = this._getOrReturnCtx(e, n), h(n, {
        code: c.too_big,
        maximum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), s.dirty()) : a.kind === "multipleOf" ? ut(e.data, a.value) !== 0 && (n = this._getOrReturnCtx(e, n), h(n, {
        code: c.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), s.dirty()) : a.kind === "finite" ? Number.isFinite(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        code: c.not_finite,
        message: a.message
      }), s.dirty()) : x.assertNever(a);
    return { status: s.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, m.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, m.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, m.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, m.toString(t));
  }
  setLimit(e, t, n, s) {
    return new j({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: m.toString(s)
        }
      ]
    });
  }
  _addCheck(e) {
    return new j({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: m.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: m.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: m.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: m.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: m.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: m.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: m.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: m.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: m.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && x.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const n of this._def.checks) {
      if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf")
        return !0;
      n.kind === "min" ? (t === null || n.value > t) && (t = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
j.create = (r) => new j({
  checks: [],
  typeName: p.ZodNumber,
  coerce: r?.coerce || !1,
  ...v(r)
});
class A extends _ {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = BigInt(e.data)), this._getType(e) !== u.bigint) {
      const a = this._getOrReturnCtx(e);
      return h(a, {
        code: c.invalid_type,
        expected: u.bigint,
        received: a.parsedType
      }), y;
    }
    let n;
    const s = new k();
    for (const a of this._def.checks)
      a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (n = this._getOrReturnCtx(e, n), h(n, {
        code: c.too_small,
        type: "bigint",
        minimum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), s.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (n = this._getOrReturnCtx(e, n), h(n, {
        code: c.too_big,
        type: "bigint",
        maximum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), s.dirty()) : a.kind === "multipleOf" ? e.data % a.value !== BigInt(0) && (n = this._getOrReturnCtx(e, n), h(n, {
        code: c.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), s.dirty()) : x.assertNever(a);
    return { status: s.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, m.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, m.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, m.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, m.toString(t));
  }
  setLimit(e, t, n, s) {
    return new A({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: m.toString(s)
        }
      ]
    });
  }
  _addCheck(e) {
    return new A({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: m.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: m.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: m.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: m.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: m.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
A.create = (r) => {
  var e;
  return new A({
    checks: [],
    typeName: p.ZodBigInt,
    coerce: (e = r?.coerce) !== null && e !== void 0 ? e : !1,
    ...v(r)
  });
};
class H extends _ {
  _parse(e) {
    if (this._def.coerce && (e.data = Boolean(e.data)), this._getType(e) !== u.boolean) {
      const n = this._getOrReturnCtx(e);
      return h(n, {
        code: c.invalid_type,
        expected: u.boolean,
        received: n.parsedType
      }), y;
    }
    return w(e.data);
  }
}
H.create = (r) => new H({
  typeName: p.ZodBoolean,
  coerce: r?.coerce || !1,
  ...v(r)
});
class L extends _ {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== u.date) {
      const a = this._getOrReturnCtx(e);
      return h(a, {
        code: c.invalid_type,
        expected: u.date,
        received: a.parsedType
      }), y;
    }
    if (isNaN(e.data.getTime())) {
      const a = this._getOrReturnCtx(e);
      return h(a, {
        code: c.invalid_date
      }), y;
    }
    const n = new k();
    let s;
    for (const a of this._def.checks)
      a.kind === "min" ? e.data.getTime() < a.value && (s = this._getOrReturnCtx(e, s), h(s, {
        code: c.too_small,
        message: a.message,
        inclusive: !0,
        exact: !1,
        minimum: a.value,
        type: "date"
      }), n.dirty()) : a.kind === "max" ? e.data.getTime() > a.value && (s = this._getOrReturnCtx(e, s), h(s, {
        code: c.too_big,
        message: a.message,
        inclusive: !0,
        exact: !1,
        maximum: a.value,
        type: "date"
      }), n.dirty()) : x.assertNever(a);
    return {
      status: n.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new L({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: m.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: m.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
L.create = (r) => new L({
  checks: [],
  coerce: r?.coerce || !1,
  typeName: p.ZodDate,
  ...v(r)
});
class ue extends _ {
  _parse(e) {
    if (this._getType(e) !== u.symbol) {
      const n = this._getOrReturnCtx(e);
      return h(n, {
        code: c.invalid_type,
        expected: u.symbol,
        received: n.parsedType
      }), y;
    }
    return w(e.data);
  }
}
ue.create = (r) => new ue({
  typeName: p.ZodSymbol,
  ...v(r)
});
class Y extends _ {
  _parse(e) {
    if (this._getType(e) !== u.undefined) {
      const n = this._getOrReturnCtx(e);
      return h(n, {
        code: c.invalid_type,
        expected: u.undefined,
        received: n.parsedType
      }), y;
    }
    return w(e.data);
  }
}
Y.create = (r) => new Y({
  typeName: p.ZodUndefined,
  ...v(r)
});
class J extends _ {
  _parse(e) {
    if (this._getType(e) !== u.null) {
      const n = this._getOrReturnCtx(e);
      return h(n, {
        code: c.invalid_type,
        expected: u.null,
        received: n.parsedType
      }), y;
    }
    return w(e.data);
  }
}
J.create = (r) => new J({
  typeName: p.ZodNull,
  ...v(r)
});
class B extends _ {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return w(e.data);
  }
}
B.create = (r) => new B({
  typeName: p.ZodAny,
  ...v(r)
});
class M extends _ {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return w(e.data);
  }
}
M.create = (r) => new M({
  typeName: p.ZodUnknown,
  ...v(r)
});
class O extends _ {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return h(t, {
      code: c.invalid_type,
      expected: u.never,
      received: t.parsedType
    }), y;
  }
}
O.create = (r) => new O({
  typeName: p.ZodNever,
  ...v(r)
});
class le extends _ {
  _parse(e) {
    if (this._getType(e) !== u.undefined) {
      const n = this._getOrReturnCtx(e);
      return h(n, {
        code: c.invalid_type,
        expected: u.void,
        received: n.parsedType
      }), y;
    }
    return w(e.data);
  }
}
le.create = (r) => new le({
  typeName: p.ZodVoid,
  ...v(r)
});
class E extends _ {
  _parse(e) {
    const { ctx: t, status: n } = this._processInputParams(e), s = this._def;
    if (t.parsedType !== u.array)
      return h(t, {
        code: c.invalid_type,
        expected: u.array,
        received: t.parsedType
      }), y;
    if (s.exactLength !== null) {
      const o = t.data.length > s.exactLength.value, i = t.data.length < s.exactLength.value;
      (o || i) && (h(t, {
        code: o ? c.too_big : c.too_small,
        minimum: i ? s.exactLength.value : void 0,
        maximum: o ? s.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: s.exactLength.message
      }), n.dirty());
    }
    if (s.minLength !== null && t.data.length < s.minLength.value && (h(t, {
      code: c.too_small,
      minimum: s.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.minLength.message
    }), n.dirty()), s.maxLength !== null && t.data.length > s.maxLength.value && (h(t, {
      code: c.too_big,
      maximum: s.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.maxLength.message
    }), n.dirty()), t.common.async)
      return Promise.all([...t.data].map((o, i) => s.type._parseAsync(new C(t, o, t.path, i)))).then((o) => k.mergeArray(n, o));
    const a = [...t.data].map((o, i) => s.type._parseSync(new C(t, o, t.path, i)));
    return k.mergeArray(n, a);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new E({
      ...this._def,
      minLength: { value: e, message: m.toString(t) }
    });
  }
  max(e, t) {
    return new E({
      ...this._def,
      maxLength: { value: e, message: m.toString(t) }
    });
  }
  length(e, t) {
    return new E({
      ...this._def,
      exactLength: { value: e, message: m.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
E.create = (r, e) => new E({
  type: r,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: p.ZodArray,
  ...v(e)
});
function q(r) {
  if (r instanceof b) {
    const e = {};
    for (const t in r.shape) {
      const n = r.shape[t];
      e[t] = R.create(q(n));
    }
    return new b({
      ...r._def,
      shape: () => e
    });
  } else
    return r instanceof E ? new E({
      ...r._def,
      type: q(r.element)
    }) : r instanceof R ? R.create(q(r.unwrap())) : r instanceof P ? P.create(q(r.unwrap())) : r instanceof Z ? Z.create(r.items.map((e) => q(e))) : r;
}
class b extends _ {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = x.objectKeys(e);
    return this._cached = { shape: e, keys: t };
  }
  _parse(e) {
    if (this._getType(e) !== u.object) {
      const f = this._getOrReturnCtx(e);
      return h(f, {
        code: c.invalid_type,
        expected: u.object,
        received: f.parsedType
      }), y;
    }
    const { status: n, ctx: s } = this._processInputParams(e), { shape: a, keys: o } = this._getCached(), i = [];
    if (!(this._def.catchall instanceof O && this._def.unknownKeys === "strip"))
      for (const f in s.data)
        o.includes(f) || i.push(f);
    const l = [];
    for (const f of o) {
      const g = a[f], V = s.data[f];
      l.push({
        key: { status: "valid", value: f },
        value: g._parse(new C(s, V, s.path, f)),
        alwaysSet: f in s.data
      });
    }
    if (this._def.catchall instanceof O) {
      const f = this._def.unknownKeys;
      if (f === "passthrough")
        for (const g of i)
          l.push({
            key: { status: "valid", value: g },
            value: { status: "valid", value: s.data[g] }
          });
      else if (f === "strict")
        i.length > 0 && (h(s, {
          code: c.unrecognized_keys,
          keys: i
        }), n.dirty());
      else if (f !== "strip")
        throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const f = this._def.catchall;
      for (const g of i) {
        const V = s.data[g];
        l.push({
          key: { status: "valid", value: g },
          value: f._parse(
            new C(s, V, s.path, g)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: g in s.data
        });
      }
    }
    return s.common.async ? Promise.resolve().then(async () => {
      const f = [];
      for (const g of l) {
        const V = await g.key;
        f.push({
          key: V,
          value: await g.value,
          alwaysSet: g.alwaysSet
        });
      }
      return f;
    }).then((f) => k.mergeObjectSync(n, f)) : k.mergeObjectSync(n, l);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return m.errToObj, new b({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, n) => {
          var s, a, o, i;
          const l = (o = (a = (s = this._def).errorMap) === null || a === void 0 ? void 0 : a.call(s, t, n).message) !== null && o !== void 0 ? o : n.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: (i = m.errToObj(e).message) !== null && i !== void 0 ? i : l
          } : {
            message: l
          };
        }
      } : {}
    });
  }
  strip() {
    return new b({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new b({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new b({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new b({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: p.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new b({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    return x.objectKeys(e).forEach((n) => {
      e[n] && this.shape[n] && (t[n] = this.shape[n]);
    }), new b({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    return x.objectKeys(this.shape).forEach((n) => {
      e[n] || (t[n] = this.shape[n]);
    }), new b({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return q(this);
  }
  partial(e) {
    const t = {};
    return x.objectKeys(this.shape).forEach((n) => {
      const s = this.shape[n];
      e && !e[n] ? t[n] = s : t[n] = s.optional();
    }), new b({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    return x.objectKeys(this.shape).forEach((n) => {
      if (e && !e[n])
        t[n] = this.shape[n];
      else {
        let a = this.shape[n];
        for (; a instanceof R; )
          a = a._def.innerType;
        t[n] = a;
      }
    }), new b({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return Re(x.objectKeys(this.shape));
  }
}
b.create = (r, e) => new b({
  shape: () => r,
  unknownKeys: "strip",
  catchall: O.create(),
  typeName: p.ZodObject,
  ...v(e)
});
b.strictCreate = (r, e) => new b({
  shape: () => r,
  unknownKeys: "strict",
  catchall: O.create(),
  typeName: p.ZodObject,
  ...v(e)
});
b.lazycreate = (r, e) => new b({
  shape: r,
  unknownKeys: "strip",
  catchall: O.create(),
  typeName: p.ZodObject,
  ...v(e)
});
class G extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = this._def.options;
    function s(a) {
      for (const i of a)
        if (i.result.status === "valid")
          return i.result;
      for (const i of a)
        if (i.result.status === "dirty")
          return t.common.issues.push(...i.ctx.common.issues), i.result;
      const o = a.map((i) => new S(i.ctx.common.issues));
      return h(t, {
        code: c.invalid_union,
        unionErrors: o
      }), y;
    }
    if (t.common.async)
      return Promise.all(n.map(async (a) => {
        const o = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await a._parseAsync({
            data: t.data,
            path: t.path,
            parent: o
          }),
          ctx: o
        };
      })).then(s);
    {
      let a;
      const o = [];
      for (const l of n) {
        const f = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, g = l._parseSync({
          data: t.data,
          path: t.path,
          parent: f
        });
        if (g.status === "valid")
          return g;
        g.status === "dirty" && !a && (a = { result: g, ctx: f }), f.common.issues.length && o.push(f.common.issues);
      }
      if (a)
        return t.common.issues.push(...a.ctx.common.issues), a.result;
      const i = o.map((l) => new S(l));
      return h(t, {
        code: c.invalid_union,
        unionErrors: i
      }), y;
    }
  }
  get options() {
    return this._def.options;
  }
}
G.create = (r, e) => new G({
  options: r,
  typeName: p.ZodUnion,
  ...v(e)
});
const ae = (r) => r instanceof Q ? ae(r.schema) : r instanceof N ? ae(r.innerType()) : r instanceof ee ? [r.value] : r instanceof $ ? r.options : r instanceof te ? Object.keys(r.enum) : r instanceof re ? ae(r._def.innerType) : r instanceof Y ? [void 0] : r instanceof J ? [null] : null;
class pe extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== u.object)
      return h(t, {
        code: c.invalid_type,
        expected: u.object,
        received: t.parsedType
      }), y;
    const n = this.discriminator, s = t.data[n], a = this.optionsMap.get(s);
    return a ? t.common.async ? a._parseAsync({
      data: t.data,
      path: t.path,
      parent: t
    }) : a._parseSync({
      data: t.data,
      path: t.path,
      parent: t
    }) : (h(t, {
      code: c.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [n]
    }), y);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(e, t, n) {
    const s = /* @__PURE__ */ new Map();
    for (const a of t) {
      const o = ae(a.shape[e]);
      if (!o)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const i of o) {
        if (s.has(i))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(i)}`);
        s.set(i, a);
      }
    }
    return new pe({
      typeName: p.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: s,
      ...v(n)
    });
  }
}
function be(r, e) {
  const t = I(r), n = I(e);
  if (r === e)
    return { valid: !0, data: r };
  if (t === u.object && n === u.object) {
    const s = x.objectKeys(e), a = x.objectKeys(r).filter((i) => s.indexOf(i) !== -1), o = { ...r, ...e };
    for (const i of a) {
      const l = be(r[i], e[i]);
      if (!l.valid)
        return { valid: !1 };
      o[i] = l.data;
    }
    return { valid: !0, data: o };
  } else if (t === u.array && n === u.array) {
    if (r.length !== e.length)
      return { valid: !1 };
    const s = [];
    for (let a = 0; a < r.length; a++) {
      const o = r[a], i = e[a], l = be(o, i);
      if (!l.valid)
        return { valid: !1 };
      s.push(l.data);
    }
    return { valid: !0, data: s };
  } else
    return t === u.date && n === u.date && +r == +e ? { valid: !0, data: r } : { valid: !1 };
}
class K extends _ {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), s = (a, o) => {
      if (_e(a) || _e(o))
        return y;
      const i = be(a.value, o.value);
      return i.valid ? ((xe(a) || xe(o)) && t.dirty(), { status: t.value, value: i.data }) : (h(n, {
        code: c.invalid_intersection_types
      }), y);
    };
    return n.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      }),
      this._def.right._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      })
    ]).then(([a, o]) => s(a, o)) : s(this._def.left._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }), this._def.right._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }));
  }
}
K.create = (r, e, t) => new K({
  left: r,
  right: e,
  typeName: p.ZodIntersection,
  ...v(t)
});
class Z extends _ {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== u.array)
      return h(n, {
        code: c.invalid_type,
        expected: u.array,
        received: n.parsedType
      }), y;
    if (n.data.length < this._def.items.length)
      return h(n, {
        code: c.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), y;
    !this._def.rest && n.data.length > this._def.items.length && (h(n, {
      code: c.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const a = [...n.data].map((o, i) => {
      const l = this._def.items[i] || this._def.rest;
      return l ? l._parse(new C(n, o, n.path, i)) : null;
    }).filter((o) => !!o);
    return n.common.async ? Promise.all(a).then((o) => k.mergeArray(t, o)) : k.mergeArray(t, a);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new Z({
      ...this._def,
      rest: e
    });
  }
}
Z.create = (r, e) => {
  if (!Array.isArray(r))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Z({
    items: r,
    typeName: p.ZodTuple,
    rest: null,
    ...v(e)
  });
};
class X extends _ {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== u.object)
      return h(n, {
        code: c.invalid_type,
        expected: u.object,
        received: n.parsedType
      }), y;
    const s = [], a = this._def.keyType, o = this._def.valueType;
    for (const i in n.data)
      s.push({
        key: a._parse(new C(n, i, n.path, i)),
        value: o._parse(new C(n, n.data[i], n.path, i))
      });
    return n.common.async ? k.mergeObjectAsync(t, s) : k.mergeObjectSync(t, s);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, n) {
    return t instanceof _ ? new X({
      keyType: e,
      valueType: t,
      typeName: p.ZodRecord,
      ...v(n)
    }) : new X({
      keyType: T.create(),
      valueType: e,
      typeName: p.ZodRecord,
      ...v(t)
    });
  }
}
class fe extends _ {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== u.map)
      return h(n, {
        code: c.invalid_type,
        expected: u.map,
        received: n.parsedType
      }), y;
    const s = this._def.keyType, a = this._def.valueType, o = [...n.data.entries()].map(([i, l], f) => ({
      key: s._parse(new C(n, i, n.path, [f, "key"])),
      value: a._parse(new C(n, l, n.path, [f, "value"]))
    }));
    if (n.common.async) {
      const i = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const l of o) {
          const f = await l.key, g = await l.value;
          if (f.status === "aborted" || g.status === "aborted")
            return y;
          (f.status === "dirty" || g.status === "dirty") && t.dirty(), i.set(f.value, g.value);
        }
        return { status: t.value, value: i };
      });
    } else {
      const i = /* @__PURE__ */ new Map();
      for (const l of o) {
        const f = l.key, g = l.value;
        if (f.status === "aborted" || g.status === "aborted")
          return y;
        (f.status === "dirty" || g.status === "dirty") && t.dirty(), i.set(f.value, g.value);
      }
      return { status: t.value, value: i };
    }
  }
}
fe.create = (r, e, t) => new fe({
  valueType: e,
  keyType: r,
  typeName: p.ZodMap,
  ...v(t)
});
class D extends _ {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== u.set)
      return h(n, {
        code: c.invalid_type,
        expected: u.set,
        received: n.parsedType
      }), y;
    const s = this._def;
    s.minSize !== null && n.data.size < s.minSize.value && (h(n, {
      code: c.too_small,
      minimum: s.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.minSize.message
    }), t.dirty()), s.maxSize !== null && n.data.size > s.maxSize.value && (h(n, {
      code: c.too_big,
      maximum: s.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.maxSize.message
    }), t.dirty());
    const a = this._def.valueType;
    function o(l) {
      const f = /* @__PURE__ */ new Set();
      for (const g of l) {
        if (g.status === "aborted")
          return y;
        g.status === "dirty" && t.dirty(), f.add(g.value);
      }
      return { status: t.value, value: f };
    }
    const i = [...n.data.values()].map((l, f) => a._parse(new C(n, l, n.path, f)));
    return n.common.async ? Promise.all(i).then((l) => o(l)) : o(i);
  }
  min(e, t) {
    return new D({
      ...this._def,
      minSize: { value: e, message: m.toString(t) }
    });
  }
  max(e, t) {
    return new D({
      ...this._def,
      maxSize: { value: e, message: m.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
D.create = (r, e) => new D({
  valueType: r,
  minSize: null,
  maxSize: null,
  typeName: p.ZodSet,
  ...v(e)
});
class U extends _ {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== u.function)
      return h(t, {
        code: c.invalid_type,
        expected: u.function,
        received: t.parsedType
      }), y;
    function n(i, l) {
      return oe({
        data: i,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          ie(),
          F
        ].filter((f) => !!f),
        issueData: {
          code: c.invalid_arguments,
          argumentsError: l
        }
      });
    }
    function s(i, l) {
      return oe({
        data: i,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          ie(),
          F
        ].filter((f) => !!f),
        issueData: {
          code: c.invalid_return_type,
          returnTypeError: l
        }
      });
    }
    const a = { errorMap: t.common.contextualErrorMap }, o = t.data;
    return this._def.returns instanceof W ? w(async (...i) => {
      const l = new S([]), f = await this._def.args.parseAsync(i, a).catch((ge) => {
        throw l.addIssue(n(i, ge)), l;
      }), g = await o(...f);
      return await this._def.returns._def.type.parseAsync(g, a).catch((ge) => {
        throw l.addIssue(s(g, ge)), l;
      });
    }) : w((...i) => {
      const l = this._def.args.safeParse(i, a);
      if (!l.success)
        throw new S([n(i, l.error)]);
      const f = o(...l.data), g = this._def.returns.safeParse(f, a);
      if (!g.success)
        throw new S([s(f, g.error)]);
      return g.data;
    });
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...e) {
    return new U({
      ...this._def,
      args: Z.create(e).rest(M.create())
    });
  }
  returns(e) {
    return new U({
      ...this._def,
      returns: e
    });
  }
  implement(e) {
    return this.parse(e);
  }
  strictImplement(e) {
    return this.parse(e);
  }
  static create(e, t, n) {
    return new U({
      args: e || Z.create([]).rest(M.create()),
      returns: t || M.create(),
      typeName: p.ZodFunction,
      ...v(n)
    });
  }
}
class Q extends _ {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
Q.create = (r, e) => new Q({
  getter: r,
  typeName: p.ZodLazy,
  ...v(e)
});
class ee extends _ {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return h(t, {
        received: t.data,
        code: c.invalid_literal,
        expected: this._def.value
      }), y;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
ee.create = (r, e) => new ee({
  value: r,
  typeName: p.ZodLiteral,
  ...v(e)
});
function Re(r, e) {
  return new $({
    values: r,
    typeName: p.ZodEnum,
    ...v(e)
  });
}
class $ extends _ {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return h(t, {
        expected: x.joinValues(n),
        received: t.parsedType,
        code: c.invalid_type
      }), y;
    }
    if (this._def.values.indexOf(e.data) === -1) {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return h(t, {
        received: t.data,
        code: c.invalid_enum_value,
        options: n
      }), y;
    }
    return w(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  extract(e) {
    return $.create(e);
  }
  exclude(e) {
    return $.create(this.options.filter((t) => !e.includes(t)));
  }
}
$.create = Re;
class te extends _ {
  _parse(e) {
    const t = x.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
    if (n.parsedType !== u.string && n.parsedType !== u.number) {
      const s = x.objectValues(t);
      return h(n, {
        expected: x.joinValues(s),
        received: n.parsedType,
        code: c.invalid_type
      }), y;
    }
    if (t.indexOf(e.data) === -1) {
      const s = x.objectValues(t);
      return h(n, {
        received: n.data,
        code: c.invalid_enum_value,
        options: s
      }), y;
    }
    return w(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
te.create = (r, e) => new te({
  values: r,
  typeName: p.ZodNativeEnum,
  ...v(e)
});
class W extends _ {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== u.promise && t.common.async === !1)
      return h(t, {
        code: c.invalid_type,
        expected: u.promise,
        received: t.parsedType
      }), y;
    const n = t.parsedType === u.promise ? t.data : Promise.resolve(t.data);
    return w(n.then((s) => this._def.type.parseAsync(s, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
W.create = (r, e) => new W({
  type: r,
  typeName: p.ZodPromise,
  ...v(e)
});
class N extends _ {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === p.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), s = this._def.effect || null;
    if (s.type === "preprocess") {
      const o = s.transform(n.data);
      return n.common.async ? Promise.resolve(o).then((i) => this._def.schema._parseAsync({
        data: i,
        path: n.path,
        parent: n
      })) : this._def.schema._parseSync({
        data: o,
        path: n.path,
        parent: n
      });
    }
    const a = {
      addIssue: (o) => {
        h(n, o), o.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return n.path;
      }
    };
    if (a.addIssue = a.addIssue.bind(a), s.type === "refinement") {
      const o = (i) => {
        const l = s.refinement(i, a);
        if (n.common.async)
          return Promise.resolve(l);
        if (l instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return i;
      };
      if (n.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return i.status === "aborted" ? y : (i.status === "dirty" && t.dirty(), o(i.value), { status: t.value, value: i.value });
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((i) => i.status === "aborted" ? y : (i.status === "dirty" && t.dirty(), o(i.value).then(() => ({ status: t.value, value: i.value }))));
    }
    if (s.type === "transform")
      if (n.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        if (!ce(o))
          return o;
        const i = s.transform(o.value, a);
        if (i instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: i };
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((o) => ce(o) ? Promise.resolve(s.transform(o.value, a)).then((i) => ({ status: t.value, value: i })) : o);
    x.assertNever(s);
  }
}
N.create = (r, e, t) => new N({
  schema: r,
  typeName: p.ZodEffects,
  effect: e,
  ...v(t)
});
N.createWithPreprocess = (r, e, t) => new N({
  schema: e,
  effect: { type: "preprocess", transform: r },
  typeName: p.ZodEffects,
  ...v(t)
});
class R extends _ {
  _parse(e) {
    return this._getType(e) === u.undefined ? w(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
R.create = (r, e) => new R({
  innerType: r,
  typeName: p.ZodOptional,
  ...v(e)
});
class P extends _ {
  _parse(e) {
    return this._getType(e) === u.null ? w(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
P.create = (r, e) => new P({
  innerType: r,
  typeName: p.ZodNullable,
  ...v(e)
});
class re extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let n = t.data;
    return t.parsedType === u.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
re.create = (r, e) => new re({
  innerType: r,
  typeName: p.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...v(e)
});
class he extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, s = this._def.innerType._parse({
      data: n.data,
      path: n.path,
      parent: {
        ...n
      }
    });
    return de(s) ? s.then((a) => ({
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new S(n.common.issues);
        },
        input: n.data
      })
    })) : {
      status: "valid",
      value: s.status === "valid" ? s.value : this._def.catchValue({
        get error() {
          return new S(n.common.issues);
        },
        input: n.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
he.create = (r, e) => new he({
  innerType: r,
  typeName: p.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...v(e)
});
class me extends _ {
  _parse(e) {
    if (this._getType(e) !== u.nan) {
      const n = this._getOrReturnCtx(e);
      return h(n, {
        code: c.invalid_type,
        expected: u.nan,
        received: n.parsedType
      }), y;
    }
    return { status: "valid", value: e.data };
  }
}
me.create = (r) => new me({
  typeName: p.ZodNaN,
  ...v(r)
});
const lt = Symbol("zod_brand");
class Oe extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = t.data;
    return this._def.type._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class ne extends _ {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.common.async)
      return (async () => {
        const a = await this._def.in._parseAsync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return a.status === "aborted" ? y : a.status === "dirty" ? (t.dirty(), Ze(a.value)) : this._def.out._parseAsync({
          data: a.value,
          path: n.path,
          parent: n
        });
      })();
    {
      const s = this._def.in._parseSync({
        data: n.data,
        path: n.path,
        parent: n
      });
      return s.status === "aborted" ? y : s.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: s.value
      }) : this._def.out._parseSync({
        data: s.value,
        path: n.path,
        parent: n
      });
    }
  }
  static create(e, t) {
    return new ne({
      in: e,
      out: t,
      typeName: p.ZodPipeline
    });
  }
}
const Ie = (r, e = {}, t) => r ? B.create().superRefine((n, s) => {
  var a, o;
  if (!r(n)) {
    const i = typeof e == "function" ? e(n) : typeof e == "string" ? { message: e } : e, l = (o = (a = i.fatal) !== null && a !== void 0 ? a : t) !== null && o !== void 0 ? o : !0, f = typeof i == "string" ? { message: i } : i;
    s.addIssue({ code: "custom", ...f, fatal: l });
  }
}) : B.create(), ft = {
  object: b.lazycreate
};
var p;
(function(r) {
  r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline";
})(p || (p = {}));
const ht = (r, e = {
  message: `Input not instance of ${r.name}`
}) => Ie((t) => t instanceof r, e), je = T.create, Ae = j.create, mt = me.create, pt = A.create, $e = H.create, gt = L.create, yt = ue.create, vt = Y.create, _t = J.create, xt = B.create, bt = M.create, kt = O.create, wt = le.create, Tt = E.create, St = b.create, Et = b.strictCreate, Nt = G.create, Ct = pe.create, Zt = K.create, Rt = Z.create, Ot = X.create, It = fe.create, jt = D.create, At = U.create, $t = Q.create, Mt = ee.create, Lt = $.create, Dt = te.create, Pt = W.create, Se = N.create, Vt = R.create, qt = P.create, zt = N.createWithPreprocess, Ut = ne.create, Bt = () => je().optional(), Wt = () => Ae().optional(), Ft = () => $e().optional(), Ht = {
  string: (r) => T.create({ ...r, coerce: !0 }),
  number: (r) => j.create({ ...r, coerce: !0 }),
  boolean: (r) => H.create({
    ...r,
    coerce: !0
  }),
  bigint: (r) => A.create({ ...r, coerce: !0 }),
  date: (r) => L.create({ ...r, coerce: !0 })
}, Yt = y;
var z = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: F,
  setErrorMap: Xe,
  getErrorMap: ie,
  makeIssue: oe,
  EMPTY_PATH: Qe,
  addIssueToContext: h,
  ParseStatus: k,
  INVALID: y,
  DIRTY: Ze,
  OK: w,
  isAborted: _e,
  isDirty: xe,
  isValid: ce,
  isAsync: de,
  get util() {
    return x;
  },
  get objectUtil() {
    return ve;
  },
  ZodParsedType: u,
  getParsedType: I,
  ZodType: _,
  ZodString: T,
  ZodNumber: j,
  ZodBigInt: A,
  ZodBoolean: H,
  ZodDate: L,
  ZodSymbol: ue,
  ZodUndefined: Y,
  ZodNull: J,
  ZodAny: B,
  ZodUnknown: M,
  ZodNever: O,
  ZodVoid: le,
  ZodArray: E,
  ZodObject: b,
  ZodUnion: G,
  ZodDiscriminatedUnion: pe,
  ZodIntersection: K,
  ZodTuple: Z,
  ZodRecord: X,
  ZodMap: fe,
  ZodSet: D,
  ZodFunction: U,
  ZodLazy: Q,
  ZodLiteral: ee,
  ZodEnum: $,
  ZodNativeEnum: te,
  ZodPromise: W,
  ZodEffects: N,
  ZodTransformer: N,
  ZodOptional: R,
  ZodNullable: P,
  ZodDefault: re,
  ZodCatch: he,
  ZodNaN: me,
  BRAND: lt,
  ZodBranded: Oe,
  ZodPipeline: ne,
  custom: Ie,
  Schema: _,
  ZodSchema: _,
  late: ft,
  get ZodFirstPartyTypeKind() {
    return p;
  },
  coerce: Ht,
  any: xt,
  array: Tt,
  bigint: pt,
  boolean: $e,
  date: gt,
  discriminatedUnion: Ct,
  effect: Se,
  enum: Lt,
  function: At,
  instanceof: ht,
  intersection: Zt,
  lazy: $t,
  literal: Mt,
  map: It,
  nan: mt,
  nativeEnum: Dt,
  never: kt,
  null: _t,
  nullable: qt,
  number: Ae,
  object: St,
  oboolean: Ft,
  onumber: Wt,
  optional: Vt,
  ostring: Bt,
  pipeline: Ut,
  preprocess: zt,
  promise: Pt,
  record: Ot,
  set: jt,
  strictObject: Et,
  string: je,
  symbol: yt,
  transformer: Se,
  tuple: Rt,
  undefined: vt,
  union: Nt,
  unknown: bt,
  void: wt,
  NEVER: Yt,
  ZodIssueCode: c,
  quotelessJson: Ke,
  ZodError: S
});
class Jt {
  /* eslint-enabled */
  _service;
  constructor(e) {
    this._service = e;
  }
  getAllSql = (e) => {
    const t = [], n = {};
    for (const a of e)
      t.push(d.identifier([se.decamelize(a)])), n[a] = !0;
    const s = this.validationSchema instanceof z.ZodObject ? this.validationSchema.pick(n) : z.any();
    return d.type(s)`
      SELECT ${d.join(t, d.fragment`, `)}
      FROM ${this.getTableFragment()}
      ORDER BY id ASC;
    `;
  };
  getCreateSql = (e) => {
    const t = [], n = [];
    for (const s in e) {
      const a = s, o = e[a];
      t.push(d.identifier([se.decamelize(a)])), n.push(o);
    }
    return d.type(this.validationSchema)`
      INSERT INTO ${this.getTableFragment()}
        (${d.join(t, d.fragment`, `)})
      VALUES (${d.join(n, d.fragment`, `)})
      RETURNING *;
    `;
  };
  getDeleteSql = (e) => d.type(this.validationSchema)`
      DELETE FROM ${this.getTableFragment()}
      WHERE id = ${e}
      RETURNING *;
    `;
  getFindByIdSql = (e) => d.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE id = ${e};
    `;
  getListSql = (e, t, n, s) => {
    const a = ye(this.table, this.schema);
    return d.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${we(n, a)}
      ${Je(a, s)}
      ${Ye(e, t)};
    `;
  };
  getTableFragment = () => Ge(this.table, this.schema);
  getUpdateSql = (e, t) => {
    const n = [];
    for (const s in t) {
      const a = t[s];
      n.push(
        d.fragment`${d.identifier([se.decamelize(s)])} = ${a}`
      );
    }
    return d.type(this.validationSchema)`
      UPDATE ${this.getTableFragment()}
      SET ${d.join(n, d.fragment`, `)}
      WHERE id = ${e}
      RETURNING *;
    `;
  };
  getCount = (e) => {
    const t = ye(this.table, this.schema), n = z.object({
      count: z.number()
    });
    return d.type(n)`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()}
      ${we(e, t)};
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
class rr {
  /* eslint-enabled */
  static TABLE = void 0;
  static LIMIT_DEFAULT = 20;
  static LIMIT_MAX = 50;
  _config;
  _database;
  _factory;
  _schema = "public";
  _validationSchema = z.any();
  constructor(e, t, n) {
    this._config = e, this._database = t, n && (this._schema = n);
  }
  /**
   * Only for entities that support it. Returns the full list of entities,
   * with no filtering, no custom sorting order, no pagination,
   * but with a restricted set of data.
   * Example: to get the full list of countries to populate the CountryPicker
   */
  all = async (e) => {
    const t = this.factory.getAllSql(e);
    return await this.database.connect((s) => s.any(t));
  };
  create = async (e) => {
    const t = this.factory.getCreateSql(e), n = await this.database.connect(async (s) => s.query(t).then((a) => a.rows[0]));
    return n ? this.postCreate(n) : void 0;
  };
  delete = async (e) => {
    const t = this.factory.getDeleteSql(e);
    return await this.database.connect((s) => s.one(t));
  };
  findById = async (e) => {
    const t = this.factory.getFindByIdSql(e);
    return await this.database.connect((s) => s.maybeOne(t));
  };
  getLimitDefault = () => this.config.slonik?.pagination?.defaultLimit || this.constructor.LIMIT_DEFAULT;
  getLimitMax = () => this.config.slonik?.pagination?.maxLimit || this.constructor.LIMIT_MAX;
  list = async (e, t, n, s) => {
    const a = this.factory.getListSql(
      Math.min(e ?? this.getLimitDefault(), this.getLimitMax()),
      t,
      n,
      s
    );
    return await this.database.connect((i) => i.any(a));
  };
  paginatedList = async (e, t, n, s) => {
    const a = await this.list(e, t, n, s);
    return {
      totalCount: await this.count(n),
      data: [...a]
    };
  };
  count = async (e) => {
    const t = this.factory.getCount(e);
    return (await this.database.connect((s) => s.any(t)))[0].count;
  };
  update = async (e, t) => {
    const n = this.factory.getUpdateSql(e, t);
    return await this.database.connect((s) => s.query(n).then((a) => a.rows[0]));
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
    return this._factory || (this._factory = new Jt(this)), this.factory;
  }
  get schema() {
    return this._schema || "public";
  }
  get table() {
    return this.constructor.TABLE;
  }
  get validationSchema() {
    return this._validationSchema || z.any();
  }
  postCreate = async (e) => e;
}
export {
  rr as BaseService,
  Jt as DefaultSqlFactory,
  Ue as createDatabase,
  we as createFilterFragment,
  Ye as createLimitFragment,
  Je as createSortFragment,
  Ge as createTableFragment,
  ye as createTableIdentifier,
  tr as createWhereIdFragment,
  er as default
};

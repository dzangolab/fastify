import "@dzangolab/fastify-config";
import "mercurius";
import Ce from "fastify-plugin";
import { existsSync as je } from "node:fs";
import * as Ye from "pg";
import { migrate as Ge } from "@dzangolab/postgres-migrations";
import { DefaultSqlFactory as Xe, BaseService as Qe } from "@dzangolab/fastify-slonik";
import { sql as w } from "slonik";
const et = async (n, e) => {
  e.config.mercurius.enabled && (n.tenant = e.tenant);
}, Ae = async (n, e) => {
  await n.query(
    `
      CREATE SCHEMA IF NOT EXISTS ${e};
      SET search_path TO ${e};
    `
  );
}, Me = (n) => ({
  database: n.db.databaseName,
  user: n.db.username,
  password: n.db.password,
  host: n.db.host,
  port: n.db.port
}), $e = async (n) => {
  const e = new Ye.Client(n);
  return await e.connect(), e;
}, Pe = (n) => {
  const e = n.slonik?.migrations?.path || "migrations";
  return {
    migrations: {
      path: n.multiTenant?.migrations?.path || `${e}/tenants`
    },
    reserved: {
      domains: n.multiTenant?.reserved?.domains || [],
      slugs: n.multiTenant?.reserved?.slugs || []
    },
    table: {
      name: n.multiTenant?.table?.name || "tenants",
      columns: {
        id: n.multiTenant?.table?.columns?.id || "id",
        name: n.multiTenant?.table?.columns?.name || "name",
        slug: n.multiTenant?.table?.columns?.slug || "slug",
        domain: n.multiTenant?.table?.columns?.domain || "domain"
      }
    }
  };
}, ze = async (n, e, t) => {
  if (!je(e))
    return !1;
  const r = "client" in n ? n.client : (
    // DU [2023-JAN-06] This smells
    await $e(n)
  );
  return await Ae(r, t.slug), await Ge({ client: r }, e), "client" in n || await r.end(), !0;
};
var tt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, H = {}, nt = {
  get exports() {
    return H;
  },
  set exports(n) {
    H = n;
  }
};
(function(n) {
  (function(e) {
    var t = function(g, x, E) {
      if (!u(x) || Z(x) || Y(x) || Je(x) || d(x))
        return x;
      var A, G = 0, Ne = 0;
      if (m(x))
        for (A = [], Ne = x.length; G < Ne; G++)
          A.push(t(g, x[G], E));
      else {
        A = {};
        for (var ke in x)
          Object.prototype.hasOwnProperty.call(x, ke) && (A[g(ke, E)] = t(g, x[ke], E));
      }
      return A;
    }, r = function(g, x) {
      x = x || {};
      var E = x.separator || "_", A = x.split || /(?=[A-Z])/;
      return g.split(A).join(E);
    }, s = function(g) {
      return Ke(g) ? g : (g = g.replace(/[\-_\s]+(.)?/g, function(x, E) {
        return E ? E.toUpperCase() : "";
      }), g.substr(0, 1).toLowerCase() + g.substr(1));
    }, a = function(g) {
      var x = s(g);
      return x.substr(0, 1).toUpperCase() + x.substr(1);
    }, i = function(g, x) {
      return r(g, x).toLowerCase();
    }, o = Object.prototype.toString, d = function(g) {
      return typeof g == "function";
    }, u = function(g) {
      return g === Object(g);
    }, m = function(g) {
      return o.call(g) == "[object Array]";
    }, Z = function(g) {
      return o.call(g) == "[object Date]";
    }, Y = function(g) {
      return o.call(g) == "[object RegExp]";
    }, Je = function(g) {
      return o.call(g) == "[object Boolean]";
    }, Ke = function(g) {
      return g = g - 0, g === g;
    }, be = function(g, x) {
      var E = x && "process" in x ? x.process : x;
      return typeof E != "function" ? g : function(A, G) {
        return E(A, g, G);
      };
    }, Oe = {
      camelize: s,
      decamelize: i,
      pascalize: a,
      depascalize: i,
      camelizeKeys: function(g, x) {
        return t(be(s, x), g);
      },
      decamelizeKeys: function(g, x) {
        return t(be(i, x), g, x);
      },
      pascalizeKeys: function(g, x) {
        return t(be(a, x), g);
      },
      depascalizeKeys: function() {
        return this.decamelizeKeys.apply(this, arguments);
      }
    };
    n.exports ? n.exports = Oe : e.humps = Oe;
  })(tt);
})(nt);
var b;
(function(n) {
  n.assertEqual = (s) => s;
  function e(s) {
  }
  n.assertIs = e;
  function t(s) {
    throw new Error();
  }
  n.assertNever = t, n.arrayToEnum = (s) => {
    const a = {};
    for (const i of s)
      a[i] = i;
    return a;
  }, n.getValidEnumValues = (s) => {
    const a = n.objectKeys(s).filter((o) => typeof s[s[o]] != "number"), i = {};
    for (const o of a)
      i[o] = s[o];
    return n.objectValues(i);
  }, n.objectValues = (s) => n.objectKeys(s).map(function(a) {
    return s[a];
  }), n.objectKeys = typeof Object.keys == "function" ? (s) => Object.keys(s) : (s) => {
    const a = [];
    for (const i in s)
      Object.prototype.hasOwnProperty.call(s, i) && a.push(i);
    return a;
  }, n.find = (s, a) => {
    for (const i of s)
      if (a(i))
        return i;
  }, n.isInteger = typeof Number.isInteger == "function" ? (s) => Number.isInteger(s) : (s) => typeof s == "number" && isFinite(s) && Math.floor(s) === s;
  function r(s, a = " | ") {
    return s.map((i) => typeof i == "string" ? `'${i}'` : i).join(a);
  }
  n.joinValues = r, n.jsonStringifyReplacer = (s, a) => typeof a == "bigint" ? a.toString() : a;
})(b || (b = {}));
var Te;
(function(n) {
  n.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(Te || (Te = {}));
const l = b.arrayToEnum([
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
]), P = (n) => {
  switch (typeof n) {
    case "undefined":
      return l.undefined;
    case "string":
      return l.string;
    case "number":
      return isNaN(n) ? l.nan : l.number;
    case "boolean":
      return l.boolean;
    case "function":
      return l.function;
    case "bigint":
      return l.bigint;
    case "symbol":
      return l.symbol;
    case "object":
      return Array.isArray(n) ? l.array : n === null ? l.null : n.then && typeof n.then == "function" && n.catch && typeof n.catch == "function" ? l.promise : typeof Map < "u" && n instanceof Map ? l.map : typeof Set < "u" && n instanceof Set ? l.set : typeof Date < "u" && n instanceof Date ? l.date : l.object;
    default:
      return l.unknown;
  }
}, c = b.arrayToEnum([
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
]), rt = (n) => JSON.stringify(n, null, 2).replace(/"([^"]+)":/g, "$1:");
class O extends Error {
  constructor(e) {
    super(), this.issues = [], this.addIssue = (r) => {
      this.issues = [...this.issues, r];
    }, this.addIssues = (r = []) => {
      this.issues = [...this.issues, ...r];
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
    }, r = { _errors: [] }, s = (a) => {
      for (const i of a.issues)
        if (i.code === "invalid_union")
          i.unionErrors.map(s);
        else if (i.code === "invalid_return_type")
          s(i.returnTypeError);
        else if (i.code === "invalid_arguments")
          s(i.argumentsError);
        else if (i.path.length === 0)
          r._errors.push(t(i));
        else {
          let o = r, d = 0;
          for (; d < i.path.length; ) {
            const u = i.path[d];
            d === i.path.length - 1 ? (o[u] = o[u] || { _errors: [] }, o[u]._errors.push(t(i))) : o[u] = o[u] || { _errors: [] }, o = o[u], d++;
          }
        }
    };
    return s(this), r;
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, b.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, r = [];
    for (const s of this.issues)
      s.path.length > 0 ? (t[s.path[0]] = t[s.path[0]] || [], t[s.path[0]].push(e(s))) : r.push(e(s));
    return { formErrors: r, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
O.create = (n) => new O(n);
const X = (n, e) => {
  let t;
  switch (n.code) {
    case c.invalid_type:
      n.received === l.undefined ? t = "Required" : t = `Expected ${n.expected}, received ${n.received}`;
      break;
    case c.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(n.expected, b.jsonStringifyReplacer)}`;
      break;
    case c.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${b.joinValues(n.keys, ", ")}`;
      break;
    case c.invalid_union:
      t = "Invalid input";
      break;
    case c.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${b.joinValues(n.options)}`;
      break;
    case c.invalid_enum_value:
      t = `Invalid enum value. Expected ${b.joinValues(n.options)}, received '${n.received}'`;
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
      typeof n.validation == "object" ? "includes" in n.validation ? (t = `Invalid input: must include "${n.validation.includes}"`, typeof n.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${n.validation.position}`)) : "startsWith" in n.validation ? t = `Invalid input: must start with "${n.validation.startsWith}"` : "endsWith" in n.validation ? t = `Invalid input: must end with "${n.validation.endsWith}"` : b.assertNever(n.validation) : n.validation !== "regex" ? t = `Invalid ${n.validation}` : t = "Invalid";
      break;
    case c.too_small:
      n.type === "array" ? t = `Array must contain ${n.exact ? "exactly" : n.inclusive ? "at least" : "more than"} ${n.minimum} element(s)` : n.type === "string" ? t = `String must contain ${n.exact ? "exactly" : n.inclusive ? "at least" : "over"} ${n.minimum} character(s)` : n.type === "number" ? t = `Number must be ${n.exact ? "exactly equal to " : n.inclusive ? "greater than or equal to " : "greater than "}${n.minimum}` : n.type === "date" ? t = `Date must be ${n.exact ? "exactly equal to " : n.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(n.minimum))}` : t = "Invalid input";
      break;
    case c.too_big:
      n.type === "array" ? t = `Array must contain ${n.exact ? "exactly" : n.inclusive ? "at most" : "less than"} ${n.maximum} element(s)` : n.type === "string" ? t = `String must contain ${n.exact ? "exactly" : n.inclusive ? "at most" : "under"} ${n.maximum} character(s)` : n.type === "number" ? t = `Number must be ${n.exact ? "exactly" : n.inclusive ? "less than or equal to" : "less than"} ${n.maximum}` : n.type === "bigint" ? t = `BigInt must be ${n.exact ? "exactly" : n.inclusive ? "less than or equal to" : "less than"} ${n.maximum}` : n.type === "date" ? t = `Date must be ${n.exact ? "exactly" : n.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(n.maximum))}` : t = "Invalid input";
      break;
    case c.custom:
      t = "Invalid input";
      break;
    case c.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case c.not_multiple_of:
      t = `Number must be a multiple of ${n.multipleOf}`;
      break;
    case c.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, b.assertNever(n);
  }
  return { message: t };
};
let Ve = X;
function st(n) {
  Ve = n;
}
function le() {
  return Ve;
}
const fe = (n) => {
  const { data: e, path: t, errorMaps: r, issueData: s } = n, a = [...t, ...s.path || []], i = {
    ...s,
    path: a
  };
  let o = "";
  const d = r.filter((u) => !!u).slice().reverse();
  for (const u of d)
    o = u(i, { data: e, defaultError: o }).message;
  return {
    ...s,
    path: a,
    message: s.message || o
  };
}, at = [];
function f(n, e) {
  const t = fe({
    issueData: e,
    data: n.data,
    path: n.path,
    errorMaps: [
      n.common.contextualErrorMap,
      n.schemaErrorMap,
      le(),
      X
      // then global default map
    ].filter((r) => !!r)
  });
  n.common.issues.push(t);
}
class T {
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
    const r = [];
    for (const s of t) {
      if (s.status === "aborted")
        return y;
      s.status === "dirty" && e.dirty(), r.push(s.value);
    }
    return { status: e.value, value: r };
  }
  static async mergeObjectAsync(e, t) {
    const r = [];
    for (const s of t)
      r.push({
        key: await s.key,
        value: await s.value
      });
    return T.mergeObjectSync(e, r);
  }
  static mergeObjectSync(e, t) {
    const r = {};
    for (const s of t) {
      const { key: a, value: i } = s;
      if (a.status === "aborted" || i.status === "aborted")
        return y;
      a.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), (typeof i.value < "u" || s.alwaysSet) && (r[a.value] = i.value);
    }
    return { status: e.value, value: r };
  }
}
const y = Object.freeze({
  status: "aborted"
}), Le = (n) => ({ status: "dirty", value: n }), S = (n) => ({ status: "valid", value: n }), Se = (n) => n.status === "aborted", Ze = (n) => n.status === "dirty", he = (n) => n.status === "valid", pe = (n) => typeof Promise < "u" && n instanceof Promise;
var h;
(function(n) {
  n.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, n.toString = (e) => typeof e == "string" ? e : e?.message;
})(h || (h = {}));
class R {
  constructor(e, t, r, s) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = r, this._key = s;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const Ie = (n, e) => {
  if (he(e))
    return { success: !0, data: e.value };
  if (!n.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new O(n.common.issues);
      return this._error = t, this._error;
    }
  };
};
function v(n) {
  if (!n)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: r, description: s } = n;
  if (e && (t || r))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: s } : { errorMap: (i, o) => i.code !== "invalid_type" ? { message: o.defaultError } : typeof o.data > "u" ? { message: r ?? o.defaultError } : { message: t ?? o.defaultError }, description: s };
}
class _ {
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this);
  }
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return P(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: P(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new T(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: P(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (pe(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const r = this.safeParse(e, t);
    if (r.success)
      return r.data;
    throw r.error;
  }
  safeParse(e, t) {
    var r;
    const s = {
      common: {
        issues: [],
        async: (r = t?.async) !== null && r !== void 0 ? r : !1,
        contextualErrorMap: t?.errorMap
      },
      path: t?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: P(e)
    }, a = this._parseSync({ data: e, path: s.path, parent: s });
    return Ie(s, a);
  }
  async parseAsync(e, t) {
    const r = await this.safeParseAsync(e, t);
    if (r.success)
      return r.data;
    throw r.error;
  }
  async safeParseAsync(e, t) {
    const r = {
      common: {
        issues: [],
        contextualErrorMap: t?.errorMap,
        async: !0
      },
      path: t?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: P(e)
    }, s = this._parse({ data: e, path: r.path, parent: r }), a = await (pe(s) ? s : Promise.resolve(s));
    return Ie(r, a);
  }
  refine(e, t) {
    const r = (s) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(s) : t;
    return this._refinement((s, a) => {
      const i = e(s), o = () => a.addIssue({
        code: c.custom,
        ...r(s)
      });
      return typeof Promise < "u" && i instanceof Promise ? i.then((d) => d ? !0 : (o(), !1)) : i ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((r, s) => e(r) ? !0 : (s.addIssue(typeof t == "function" ? t(r, s) : t), !1));
  }
  _refinement(e) {
    return new I({
      schema: this,
      typeName: p.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  optional() {
    return M.create(this, this._def);
  }
  nullable() {
    return q.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return N.create(this, this._def);
  }
  promise() {
    return K.create(this, this._def);
  }
  or(e) {
    return ne.create([this, e], this._def);
  }
  and(e) {
    return re.create(this, e, this._def);
  }
  transform(e) {
    return new I({
      ...v(this._def),
      schema: this,
      typeName: p.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ce({
      ...v(this._def),
      innerType: this,
      defaultValue: t,
      typeName: p.ZodDefault
    });
  }
  brand() {
    return new Ue({
      typeName: p.ZodBranded,
      type: this,
      ...v(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ve({
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
    return de.create(this, e);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const it = /^c[^\s-]{8,}$/i, ot = /^[a-z][a-z0-9]*$/, ct = /[0-9A-HJKMNP-TV-Z]{26}/, dt = /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i, ut = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/, lt = /^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u, ft = /^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/, ht = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/, pt = (n) => n.precision ? n.offset ? new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${n.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`) : new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${n.precision}}Z$`) : n.precision === 0 ? n.offset ? new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$") : new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$") : n.offset ? new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$") : new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$");
function mt(n, e) {
  return !!((e === "v4" || !e) && ft.test(n) || (e === "v6" || !e) && ht.test(n));
}
class C extends _ {
  constructor() {
    super(...arguments), this._regex = (e, t, r) => this.refinement((s) => e.test(s), {
      validation: t,
      code: c.invalid_string,
      ...h.errToObj(r)
    }), this.nonempty = (e) => this.min(1, h.errToObj(e)), this.trim = () => new C({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    }), this.toLowerCase = () => new C({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    }), this.toUpperCase = () => new C({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== l.string) {
      const a = this._getOrReturnCtx(e);
      return f(
        a,
        {
          code: c.invalid_type,
          expected: l.string,
          received: a.parsedType
        }
        //
      ), y;
    }
    const r = new T();
    let s;
    for (const a of this._def.checks)
      if (a.kind === "min")
        e.data.length < a.value && (s = this._getOrReturnCtx(e, s), f(s, {
          code: c.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), r.dirty());
      else if (a.kind === "max")
        e.data.length > a.value && (s = this._getOrReturnCtx(e, s), f(s, {
          code: c.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), r.dirty());
      else if (a.kind === "length") {
        const i = e.data.length > a.value, o = e.data.length < a.value;
        (i || o) && (s = this._getOrReturnCtx(e, s), i ? f(s, {
          code: c.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }) : o && f(s, {
          code: c.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }), r.dirty());
      } else if (a.kind === "email")
        ut.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
          validation: "email",
          code: c.invalid_string,
          message: a.message
        }), r.dirty());
      else if (a.kind === "emoji")
        lt.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
          validation: "emoji",
          code: c.invalid_string,
          message: a.message
        }), r.dirty());
      else if (a.kind === "uuid")
        dt.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
          validation: "uuid",
          code: c.invalid_string,
          message: a.message
        }), r.dirty());
      else if (a.kind === "cuid")
        it.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
          validation: "cuid",
          code: c.invalid_string,
          message: a.message
        }), r.dirty());
      else if (a.kind === "cuid2")
        ot.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
          validation: "cuid2",
          code: c.invalid_string,
          message: a.message
        }), r.dirty());
      else if (a.kind === "ulid")
        ct.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
          validation: "ulid",
          code: c.invalid_string,
          message: a.message
        }), r.dirty());
      else if (a.kind === "url")
        try {
          new URL(e.data);
        } catch {
          s = this._getOrReturnCtx(e, s), f(s, {
            validation: "url",
            code: c.invalid_string,
            message: a.message
          }), r.dirty();
        }
      else
        a.kind === "regex" ? (a.regex.lastIndex = 0, a.regex.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
          validation: "regex",
          code: c.invalid_string,
          message: a.message
        }), r.dirty())) : a.kind === "trim" ? e.data = e.data.trim() : a.kind === "includes" ? e.data.includes(a.value, a.position) || (s = this._getOrReturnCtx(e, s), f(s, {
          code: c.invalid_string,
          validation: { includes: a.value, position: a.position },
          message: a.message
        }), r.dirty()) : a.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : a.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : a.kind === "startsWith" ? e.data.startsWith(a.value) || (s = this._getOrReturnCtx(e, s), f(s, {
          code: c.invalid_string,
          validation: { startsWith: a.value },
          message: a.message
        }), r.dirty()) : a.kind === "endsWith" ? e.data.endsWith(a.value) || (s = this._getOrReturnCtx(e, s), f(s, {
          code: c.invalid_string,
          validation: { endsWith: a.value },
          message: a.message
        }), r.dirty()) : a.kind === "datetime" ? pt(a).test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
          code: c.invalid_string,
          validation: "datetime",
          message: a.message
        }), r.dirty()) : a.kind === "ip" ? mt(e.data, a.version) || (s = this._getOrReturnCtx(e, s), f(s, {
          validation: "ip",
          code: c.invalid_string,
          message: a.message
        }), r.dirty()) : b.assertNever(a);
    return { status: r.value, value: e.data };
  }
  _addCheck(e) {
    return new C({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...h.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...h.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...h.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...h.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...h.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...h.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...h.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...h.errToObj(e) });
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
      ...h.errToObj(e?.message)
    });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...h.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t?.position,
      ...h.errToObj(t?.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...h.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...h.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...h.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...h.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...h.errToObj(t)
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
C.create = (n) => {
  var e;
  return new C({
    checks: [],
    typeName: p.ZodString,
    coerce: (e = n?.coerce) !== null && e !== void 0 ? e : !1,
    ...v(n)
  });
};
function yt(n, e) {
  const t = (n.toString().split(".")[1] || "").length, r = (e.toString().split(".")[1] || "").length, s = t > r ? t : r, a = parseInt(n.toFixed(s).replace(".", "")), i = parseInt(e.toFixed(s).replace(".", ""));
  return a % i / Math.pow(10, s);
}
class z extends _ {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== l.number) {
      const a = this._getOrReturnCtx(e);
      return f(a, {
        code: c.invalid_type,
        expected: l.number,
        received: a.parsedType
      }), y;
    }
    let r;
    const s = new T();
    for (const a of this._def.checks)
      a.kind === "int" ? b.isInteger(e.data) || (r = this._getOrReturnCtx(e, r), f(r, {
        code: c.invalid_type,
        expected: "integer",
        received: "float",
        message: a.message
      }), s.dirty()) : a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (r = this._getOrReturnCtx(e, r), f(r, {
        code: c.too_small,
        minimum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), s.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (r = this._getOrReturnCtx(e, r), f(r, {
        code: c.too_big,
        maximum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), s.dirty()) : a.kind === "multipleOf" ? yt(e.data, a.value) !== 0 && (r = this._getOrReturnCtx(e, r), f(r, {
        code: c.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), s.dirty()) : a.kind === "finite" ? Number.isFinite(e.data) || (r = this._getOrReturnCtx(e, r), f(r, {
        code: c.not_finite,
        message: a.message
      }), s.dirty()) : b.assertNever(a);
    return { status: s.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, h.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, h.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, h.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, h.toString(t));
  }
  setLimit(e, t, r, s) {
    return new z({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: r,
          message: h.toString(s)
        }
      ]
    });
  }
  _addCheck(e) {
    return new z({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: h.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: h.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: h.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: h.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: h.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: h.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: h.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: h.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: h.toString(e)
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
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && b.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const r of this._def.checks) {
      if (r.kind === "finite" || r.kind === "int" || r.kind === "multipleOf")
        return !0;
      r.kind === "min" ? (t === null || r.value > t) && (t = r.value) : r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
z.create = (n) => new z({
  checks: [],
  typeName: p.ZodNumber,
  coerce: n?.coerce || !1,
  ...v(n)
});
class V extends _ {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = BigInt(e.data)), this._getType(e) !== l.bigint) {
      const a = this._getOrReturnCtx(e);
      return f(a, {
        code: c.invalid_type,
        expected: l.bigint,
        received: a.parsedType
      }), y;
    }
    let r;
    const s = new T();
    for (const a of this._def.checks)
      a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (r = this._getOrReturnCtx(e, r), f(r, {
        code: c.too_small,
        type: "bigint",
        minimum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), s.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (r = this._getOrReturnCtx(e, r), f(r, {
        code: c.too_big,
        type: "bigint",
        maximum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), s.dirty()) : a.kind === "multipleOf" ? e.data % a.value !== BigInt(0) && (r = this._getOrReturnCtx(e, r), f(r, {
        code: c.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), s.dirty()) : b.assertNever(a);
    return { status: s.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, h.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, h.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, h.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, h.toString(t));
  }
  setLimit(e, t, r, s) {
    return new V({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: r,
          message: h.toString(s)
        }
      ]
    });
  }
  _addCheck(e) {
    return new V({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: h.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: h.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: h.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: h.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: h.toString(t)
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
V.create = (n) => {
  var e;
  return new V({
    checks: [],
    typeName: p.ZodBigInt,
    coerce: (e = n?.coerce) !== null && e !== void 0 ? e : !1,
    ...v(n)
  });
};
class Q extends _ {
  _parse(e) {
    if (this._def.coerce && (e.data = Boolean(e.data)), this._getType(e) !== l.boolean) {
      const r = this._getOrReturnCtx(e);
      return f(r, {
        code: c.invalid_type,
        expected: l.boolean,
        received: r.parsedType
      }), y;
    }
    return S(e.data);
  }
}
Q.create = (n) => new Q({
  typeName: p.ZodBoolean,
  coerce: n?.coerce || !1,
  ...v(n)
});
class U extends _ {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== l.date) {
      const a = this._getOrReturnCtx(e);
      return f(a, {
        code: c.invalid_type,
        expected: l.date,
        received: a.parsedType
      }), y;
    }
    if (isNaN(e.data.getTime())) {
      const a = this._getOrReturnCtx(e);
      return f(a, {
        code: c.invalid_date
      }), y;
    }
    const r = new T();
    let s;
    for (const a of this._def.checks)
      a.kind === "min" ? e.data.getTime() < a.value && (s = this._getOrReturnCtx(e, s), f(s, {
        code: c.too_small,
        message: a.message,
        inclusive: !0,
        exact: !1,
        minimum: a.value,
        type: "date"
      }), r.dirty()) : a.kind === "max" ? e.data.getTime() > a.value && (s = this._getOrReturnCtx(e, s), f(s, {
        code: c.too_big,
        message: a.message,
        inclusive: !0,
        exact: !1,
        maximum: a.value,
        type: "date"
      }), r.dirty()) : b.assertNever(a);
    return {
      status: r.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new U({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: h.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: h.toString(t)
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
U.create = (n) => new U({
  checks: [],
  coerce: n?.coerce || !1,
  typeName: p.ZodDate,
  ...v(n)
});
class me extends _ {
  _parse(e) {
    if (this._getType(e) !== l.symbol) {
      const r = this._getOrReturnCtx(e);
      return f(r, {
        code: c.invalid_type,
        expected: l.symbol,
        received: r.parsedType
      }), y;
    }
    return S(e.data);
  }
}
me.create = (n) => new me({
  typeName: p.ZodSymbol,
  ...v(n)
});
class ee extends _ {
  _parse(e) {
    if (this._getType(e) !== l.undefined) {
      const r = this._getOrReturnCtx(e);
      return f(r, {
        code: c.invalid_type,
        expected: l.undefined,
        received: r.parsedType
      }), y;
    }
    return S(e.data);
  }
}
ee.create = (n) => new ee({
  typeName: p.ZodUndefined,
  ...v(n)
});
class te extends _ {
  _parse(e) {
    if (this._getType(e) !== l.null) {
      const r = this._getOrReturnCtx(e);
      return f(r, {
        code: c.invalid_type,
        expected: l.null,
        received: r.parsedType
      }), y;
    }
    return S(e.data);
  }
}
te.create = (n) => new te({
  typeName: p.ZodNull,
  ...v(n)
});
class J extends _ {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return S(e.data);
  }
}
J.create = (n) => new J({
  typeName: p.ZodAny,
  ...v(n)
});
class D extends _ {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return S(e.data);
  }
}
D.create = (n) => new D({
  typeName: p.ZodUnknown,
  ...v(n)
});
class $ extends _ {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return f(t, {
      code: c.invalid_type,
      expected: l.never,
      received: t.parsedType
    }), y;
  }
}
$.create = (n) => new $({
  typeName: p.ZodNever,
  ...v(n)
});
class ye extends _ {
  _parse(e) {
    if (this._getType(e) !== l.undefined) {
      const r = this._getOrReturnCtx(e);
      return f(r, {
        code: c.invalid_type,
        expected: l.void,
        received: r.parsedType
      }), y;
    }
    return S(e.data);
  }
}
ye.create = (n) => new ye({
  typeName: p.ZodVoid,
  ...v(n)
});
class N extends _ {
  _parse(e) {
    const { ctx: t, status: r } = this._processInputParams(e), s = this._def;
    if (t.parsedType !== l.array)
      return f(t, {
        code: c.invalid_type,
        expected: l.array,
        received: t.parsedType
      }), y;
    if (s.exactLength !== null) {
      const i = t.data.length > s.exactLength.value, o = t.data.length < s.exactLength.value;
      (i || o) && (f(t, {
        code: i ? c.too_big : c.too_small,
        minimum: o ? s.exactLength.value : void 0,
        maximum: i ? s.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: s.exactLength.message
      }), r.dirty());
    }
    if (s.minLength !== null && t.data.length < s.minLength.value && (f(t, {
      code: c.too_small,
      minimum: s.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.minLength.message
    }), r.dirty()), s.maxLength !== null && t.data.length > s.maxLength.value && (f(t, {
      code: c.too_big,
      maximum: s.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.maxLength.message
    }), r.dirty()), t.common.async)
      return Promise.all([...t.data].map((i, o) => s.type._parseAsync(new R(t, i, t.path, o)))).then((i) => T.mergeArray(r, i));
    const a = [...t.data].map((i, o) => s.type._parseSync(new R(t, i, t.path, o)));
    return T.mergeArray(r, a);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new N({
      ...this._def,
      minLength: { value: e, message: h.toString(t) }
    });
  }
  max(e, t) {
    return new N({
      ...this._def,
      maxLength: { value: e, message: h.toString(t) }
    });
  }
  length(e, t) {
    return new N({
      ...this._def,
      exactLength: { value: e, message: h.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
N.create = (n, e) => new N({
  type: n,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: p.ZodArray,
  ...v(e)
});
function W(n) {
  if (n instanceof k) {
    const e = {};
    for (const t in n.shape) {
      const r = n.shape[t];
      e[t] = M.create(W(r));
    }
    return new k({
      ...n._def,
      shape: () => e
    });
  } else
    return n instanceof N ? new N({
      ...n._def,
      type: W(n.element)
    }) : n instanceof M ? M.create(W(n.unwrap())) : n instanceof q ? q.create(W(n.unwrap())) : n instanceof j ? j.create(n.items.map((e) => W(e))) : n;
}
class k extends _ {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = b.objectKeys(e);
    return this._cached = { shape: e, keys: t };
  }
  _parse(e) {
    if (this._getType(e) !== l.object) {
      const u = this._getOrReturnCtx(e);
      return f(u, {
        code: c.invalid_type,
        expected: l.object,
        received: u.parsedType
      }), y;
    }
    const { status: r, ctx: s } = this._processInputParams(e), { shape: a, keys: i } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof $ && this._def.unknownKeys === "strip"))
      for (const u in s.data)
        i.includes(u) || o.push(u);
    const d = [];
    for (const u of i) {
      const m = a[u], Z = s.data[u];
      d.push({
        key: { status: "valid", value: u },
        value: m._parse(new R(s, Z, s.path, u)),
        alwaysSet: u in s.data
      });
    }
    if (this._def.catchall instanceof $) {
      const u = this._def.unknownKeys;
      if (u === "passthrough")
        for (const m of o)
          d.push({
            key: { status: "valid", value: m },
            value: { status: "valid", value: s.data[m] }
          });
      else if (u === "strict")
        o.length > 0 && (f(s, {
          code: c.unrecognized_keys,
          keys: o
        }), r.dirty());
      else if (u !== "strip")
        throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const u = this._def.catchall;
      for (const m of o) {
        const Z = s.data[m];
        d.push({
          key: { status: "valid", value: m },
          value: u._parse(
            new R(s, Z, s.path, m)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: m in s.data
        });
      }
    }
    return s.common.async ? Promise.resolve().then(async () => {
      const u = [];
      for (const m of d) {
        const Z = await m.key;
        u.push({
          key: Z,
          value: await m.value,
          alwaysSet: m.alwaysSet
        });
      }
      return u;
    }).then((u) => T.mergeObjectSync(r, u)) : T.mergeObjectSync(r, d);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return h.errToObj, new k({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, r) => {
          var s, a, i, o;
          const d = (i = (a = (s = this._def).errorMap) === null || a === void 0 ? void 0 : a.call(s, t, r).message) !== null && i !== void 0 ? i : r.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: (o = h.errToObj(e).message) !== null && o !== void 0 ? o : d
          } : {
            message: d
          };
        }
      } : {}
    });
  }
  strip() {
    return new k({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new k({
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
    return new k({
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
    return new k({
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
    return new k({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    return b.objectKeys(e).forEach((r) => {
      e[r] && this.shape[r] && (t[r] = this.shape[r]);
    }), new k({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    return b.objectKeys(this.shape).forEach((r) => {
      e[r] || (t[r] = this.shape[r]);
    }), new k({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return W(this);
  }
  partial(e) {
    const t = {};
    return b.objectKeys(this.shape).forEach((r) => {
      const s = this.shape[r];
      e && !e[r] ? t[r] = s : t[r] = s.optional();
    }), new k({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    return b.objectKeys(this.shape).forEach((r) => {
      if (e && !e[r])
        t[r] = this.shape[r];
      else {
        let a = this.shape[r];
        for (; a instanceof M; )
          a = a._def.innerType;
        t[r] = a;
      }
    }), new k({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return De(b.objectKeys(this.shape));
  }
}
k.create = (n, e) => new k({
  shape: () => n,
  unknownKeys: "strip",
  catchall: $.create(),
  typeName: p.ZodObject,
  ...v(e)
});
k.strictCreate = (n, e) => new k({
  shape: () => n,
  unknownKeys: "strict",
  catchall: $.create(),
  typeName: p.ZodObject,
  ...v(e)
});
k.lazycreate = (n, e) => new k({
  shape: n,
  unknownKeys: "strip",
  catchall: $.create(),
  typeName: p.ZodObject,
  ...v(e)
});
class ne extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), r = this._def.options;
    function s(a) {
      for (const o of a)
        if (o.result.status === "valid")
          return o.result;
      for (const o of a)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const i = a.map((o) => new O(o.ctx.common.issues));
      return f(t, {
        code: c.invalid_union,
        unionErrors: i
      }), y;
    }
    if (t.common.async)
      return Promise.all(r.map(async (a) => {
        const i = {
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
            parent: i
          }),
          ctx: i
        };
      })).then(s);
    {
      let a;
      const i = [];
      for (const d of r) {
        const u = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, m = d._parseSync({
          data: t.data,
          path: t.path,
          parent: u
        });
        if (m.status === "valid")
          return m;
        m.status === "dirty" && !a && (a = { result: m, ctx: u }), u.common.issues.length && i.push(u.common.issues);
      }
      if (a)
        return t.common.issues.push(...a.ctx.common.issues), a.result;
      const o = i.map((d) => new O(d));
      return f(t, {
        code: c.invalid_union,
        unionErrors: o
      }), y;
    }
  }
  get options() {
    return this._def.options;
  }
}
ne.create = (n, e) => new ne({
  options: n,
  typeName: p.ZodUnion,
  ...v(e)
});
const ue = (n) => n instanceof ae ? ue(n.schema) : n instanceof I ? ue(n.innerType()) : n instanceof ie ? [n.value] : n instanceof L ? n.options : n instanceof oe ? Object.keys(n.enum) : n instanceof ce ? ue(n._def.innerType) : n instanceof ee ? [void 0] : n instanceof te ? [null] : null;
class xe extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== l.object)
      return f(t, {
        code: c.invalid_type,
        expected: l.object,
        received: t.parsedType
      }), y;
    const r = this.discriminator, s = t.data[r], a = this.optionsMap.get(s);
    return a ? t.common.async ? a._parseAsync({
      data: t.data,
      path: t.path,
      parent: t
    }) : a._parseSync({
      data: t.data,
      path: t.path,
      parent: t
    }) : (f(t, {
      code: c.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [r]
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
  static create(e, t, r) {
    const s = /* @__PURE__ */ new Map();
    for (const a of t) {
      const i = ue(a.shape[e]);
      if (!i)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const o of i) {
        if (s.has(o))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(o)}`);
        s.set(o, a);
      }
    }
    return new xe({
      typeName: p.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: s,
      ...v(r)
    });
  }
}
function Ee(n, e) {
  const t = P(n), r = P(e);
  if (n === e)
    return { valid: !0, data: n };
  if (t === l.object && r === l.object) {
    const s = b.objectKeys(e), a = b.objectKeys(n).filter((o) => s.indexOf(o) !== -1), i = { ...n, ...e };
    for (const o of a) {
      const d = Ee(n[o], e[o]);
      if (!d.valid)
        return { valid: !1 };
      i[o] = d.data;
    }
    return { valid: !0, data: i };
  } else if (t === l.array && r === l.array) {
    if (n.length !== e.length)
      return { valid: !1 };
    const s = [];
    for (let a = 0; a < n.length; a++) {
      const i = n[a], o = e[a], d = Ee(i, o);
      if (!d.valid)
        return { valid: !1 };
      s.push(d.data);
    }
    return { valid: !0, data: s };
  } else
    return t === l.date && r === l.date && +n == +e ? { valid: !0, data: n } : { valid: !1 };
}
class re extends _ {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e), s = (a, i) => {
      if (Se(a) || Se(i))
        return y;
      const o = Ee(a.value, i.value);
      return o.valid ? ((Ze(a) || Ze(i)) && t.dirty(), { status: t.value, value: o.data }) : (f(r, {
        code: c.invalid_intersection_types
      }), y);
    };
    return r.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: r.data,
        path: r.path,
        parent: r
      }),
      this._def.right._parseAsync({
        data: r.data,
        path: r.path,
        parent: r
      })
    ]).then(([a, i]) => s(a, i)) : s(this._def.left._parseSync({
      data: r.data,
      path: r.path,
      parent: r
    }), this._def.right._parseSync({
      data: r.data,
      path: r.path,
      parent: r
    }));
  }
}
re.create = (n, e, t) => new re({
  left: n,
  right: e,
  typeName: p.ZodIntersection,
  ...v(t)
});
class j extends _ {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== l.array)
      return f(r, {
        code: c.invalid_type,
        expected: l.array,
        received: r.parsedType
      }), y;
    if (r.data.length < this._def.items.length)
      return f(r, {
        code: c.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), y;
    !this._def.rest && r.data.length > this._def.items.length && (f(r, {
      code: c.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const a = [...r.data].map((i, o) => {
      const d = this._def.items[o] || this._def.rest;
      return d ? d._parse(new R(r, i, r.path, o)) : null;
    }).filter((i) => !!i);
    return r.common.async ? Promise.all(a).then((i) => T.mergeArray(t, i)) : T.mergeArray(t, a);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new j({
      ...this._def,
      rest: e
    });
  }
}
j.create = (n, e) => {
  if (!Array.isArray(n))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new j({
    items: n,
    typeName: p.ZodTuple,
    rest: null,
    ...v(e)
  });
};
class se extends _ {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== l.object)
      return f(r, {
        code: c.invalid_type,
        expected: l.object,
        received: r.parsedType
      }), y;
    const s = [], a = this._def.keyType, i = this._def.valueType;
    for (const o in r.data)
      s.push({
        key: a._parse(new R(r, o, r.path, o)),
        value: i._parse(new R(r, r.data[o], r.path, o))
      });
    return r.common.async ? T.mergeObjectAsync(t, s) : T.mergeObjectSync(t, s);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, r) {
    return t instanceof _ ? new se({
      keyType: e,
      valueType: t,
      typeName: p.ZodRecord,
      ...v(r)
    }) : new se({
      keyType: C.create(),
      valueType: e,
      typeName: p.ZodRecord,
      ...v(t)
    });
  }
}
class ge extends _ {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== l.map)
      return f(r, {
        code: c.invalid_type,
        expected: l.map,
        received: r.parsedType
      }), y;
    const s = this._def.keyType, a = this._def.valueType, i = [...r.data.entries()].map(([o, d], u) => ({
      key: s._parse(new R(r, o, r.path, [u, "key"])),
      value: a._parse(new R(r, d, r.path, [u, "value"]))
    }));
    if (r.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const d of i) {
          const u = await d.key, m = await d.value;
          if (u.status === "aborted" || m.status === "aborted")
            return y;
          (u.status === "dirty" || m.status === "dirty") && t.dirty(), o.set(u.value, m.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const d of i) {
        const u = d.key, m = d.value;
        if (u.status === "aborted" || m.status === "aborted")
          return y;
        (u.status === "dirty" || m.status === "dirty") && t.dirty(), o.set(u.value, m.value);
      }
      return { status: t.value, value: o };
    }
  }
}
ge.create = (n, e, t) => new ge({
  valueType: e,
  keyType: n,
  typeName: p.ZodMap,
  ...v(t)
});
class B extends _ {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== l.set)
      return f(r, {
        code: c.invalid_type,
        expected: l.set,
        received: r.parsedType
      }), y;
    const s = this._def;
    s.minSize !== null && r.data.size < s.minSize.value && (f(r, {
      code: c.too_small,
      minimum: s.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.minSize.message
    }), t.dirty()), s.maxSize !== null && r.data.size > s.maxSize.value && (f(r, {
      code: c.too_big,
      maximum: s.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.maxSize.message
    }), t.dirty());
    const a = this._def.valueType;
    function i(d) {
      const u = /* @__PURE__ */ new Set();
      for (const m of d) {
        if (m.status === "aborted")
          return y;
        m.status === "dirty" && t.dirty(), u.add(m.value);
      }
      return { status: t.value, value: u };
    }
    const o = [...r.data.values()].map((d, u) => a._parse(new R(r, d, r.path, u)));
    return r.common.async ? Promise.all(o).then((d) => i(d)) : i(o);
  }
  min(e, t) {
    return new B({
      ...this._def,
      minSize: { value: e, message: h.toString(t) }
    });
  }
  max(e, t) {
    return new B({
      ...this._def,
      maxSize: { value: e, message: h.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
B.create = (n, e) => new B({
  valueType: n,
  minSize: null,
  maxSize: null,
  typeName: p.ZodSet,
  ...v(e)
});
class F extends _ {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== l.function)
      return f(t, {
        code: c.invalid_type,
        expected: l.function,
        received: t.parsedType
      }), y;
    function r(o, d) {
      return fe({
        data: o,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          le(),
          X
        ].filter((u) => !!u),
        issueData: {
          code: c.invalid_arguments,
          argumentsError: d
        }
      });
    }
    function s(o, d) {
      return fe({
        data: o,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          le(),
          X
        ].filter((u) => !!u),
        issueData: {
          code: c.invalid_return_type,
          returnTypeError: d
        }
      });
    }
    const a = { errorMap: t.common.contextualErrorMap }, i = t.data;
    return this._def.returns instanceof K ? S(async (...o) => {
      const d = new O([]), u = await this._def.args.parseAsync(o, a).catch((Y) => {
        throw d.addIssue(r(o, Y)), d;
      }), m = await i(...u);
      return await this._def.returns._def.type.parseAsync(m, a).catch((Y) => {
        throw d.addIssue(s(m, Y)), d;
      });
    }) : S((...o) => {
      const d = this._def.args.safeParse(o, a);
      if (!d.success)
        throw new O([r(o, d.error)]);
      const u = i(...d.data), m = this._def.returns.safeParse(u, a);
      if (!m.success)
        throw new O([s(u, m.error)]);
      return m.data;
    });
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...e) {
    return new F({
      ...this._def,
      args: j.create(e).rest(D.create())
    });
  }
  returns(e) {
    return new F({
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
  static create(e, t, r) {
    return new F({
      args: e || j.create([]).rest(D.create()),
      returns: t || D.create(),
      typeName: p.ZodFunction,
      ...v(r)
    });
  }
}
class ae extends _ {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
ae.create = (n, e) => new ae({
  getter: n,
  typeName: p.ZodLazy,
  ...v(e)
});
class ie extends _ {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return f(t, {
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
ie.create = (n, e) => new ie({
  value: n,
  typeName: p.ZodLiteral,
  ...v(e)
});
function De(n, e) {
  return new L({
    values: n,
    typeName: p.ZodEnum,
    ...v(e)
  });
}
class L extends _ {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), r = this._def.values;
      return f(t, {
        expected: b.joinValues(r),
        received: t.parsedType,
        code: c.invalid_type
      }), y;
    }
    if (this._def.values.indexOf(e.data) === -1) {
      const t = this._getOrReturnCtx(e), r = this._def.values;
      return f(t, {
        received: t.data,
        code: c.invalid_enum_value,
        options: r
      }), y;
    }
    return S(e.data);
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
    return L.create(e);
  }
  exclude(e) {
    return L.create(this.options.filter((t) => !e.includes(t)));
  }
}
L.create = De;
class oe extends _ {
  _parse(e) {
    const t = b.getValidEnumValues(this._def.values), r = this._getOrReturnCtx(e);
    if (r.parsedType !== l.string && r.parsedType !== l.number) {
      const s = b.objectValues(t);
      return f(r, {
        expected: b.joinValues(s),
        received: r.parsedType,
        code: c.invalid_type
      }), y;
    }
    if (t.indexOf(e.data) === -1) {
      const s = b.objectValues(t);
      return f(r, {
        received: r.data,
        code: c.invalid_enum_value,
        options: s
      }), y;
    }
    return S(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
oe.create = (n, e) => new oe({
  values: n,
  typeName: p.ZodNativeEnum,
  ...v(e)
});
class K extends _ {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== l.promise && t.common.async === !1)
      return f(t, {
        code: c.invalid_type,
        expected: l.promise,
        received: t.parsedType
      }), y;
    const r = t.parsedType === l.promise ? t.data : Promise.resolve(t.data);
    return S(r.then((s) => this._def.type.parseAsync(s, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
K.create = (n, e) => new K({
  type: n,
  typeName: p.ZodPromise,
  ...v(e)
});
class I extends _ {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === p.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e), s = this._def.effect || null;
    if (s.type === "preprocess") {
      const i = s.transform(r.data);
      return r.common.async ? Promise.resolve(i).then((o) => this._def.schema._parseAsync({
        data: o,
        path: r.path,
        parent: r
      })) : this._def.schema._parseSync({
        data: i,
        path: r.path,
        parent: r
      });
    }
    const a = {
      addIssue: (i) => {
        f(r, i), i.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return r.path;
      }
    };
    if (a.addIssue = a.addIssue.bind(a), s.type === "refinement") {
      const i = (o) => {
        const d = s.refinement(o, a);
        if (r.common.async)
          return Promise.resolve(d);
        if (d instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (r.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: r.data,
          path: r.path,
          parent: r
        });
        return o.status === "aborted" ? y : (o.status === "dirty" && t.dirty(), i(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: r.data, path: r.path, parent: r }).then((o) => o.status === "aborted" ? y : (o.status === "dirty" && t.dirty(), i(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (s.type === "transform")
      if (r.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: r.data,
          path: r.path,
          parent: r
        });
        if (!he(i))
          return i;
        const o = s.transform(i.value, a);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: r.data, path: r.path, parent: r }).then((i) => he(i) ? Promise.resolve(s.transform(i.value, a)).then((o) => ({ status: t.value, value: o })) : i);
    b.assertNever(s);
  }
}
I.create = (n, e, t) => new I({
  schema: n,
  typeName: p.ZodEffects,
  effect: e,
  ...v(t)
});
I.createWithPreprocess = (n, e, t) => new I({
  schema: e,
  effect: { type: "preprocess", transform: n },
  typeName: p.ZodEffects,
  ...v(t)
});
class M extends _ {
  _parse(e) {
    return this._getType(e) === l.undefined ? S(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
M.create = (n, e) => new M({
  innerType: n,
  typeName: p.ZodOptional,
  ...v(e)
});
class q extends _ {
  _parse(e) {
    return this._getType(e) === l.null ? S(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
q.create = (n, e) => new q({
  innerType: n,
  typeName: p.ZodNullable,
  ...v(e)
});
class ce extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let r = t.data;
    return t.parsedType === l.undefined && (r = this._def.defaultValue()), this._def.innerType._parse({
      data: r,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ce.create = (n, e) => new ce({
  innerType: n,
  typeName: p.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...v(e)
});
class ve extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), r = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, s = this._def.innerType._parse({
      data: r.data,
      path: r.path,
      parent: {
        ...r
      }
    });
    return pe(s) ? s.then((a) => ({
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new O(r.common.issues);
        },
        input: r.data
      })
    })) : {
      status: "valid",
      value: s.status === "valid" ? s.value : this._def.catchValue({
        get error() {
          return new O(r.common.issues);
        },
        input: r.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ve.create = (n, e) => new ve({
  innerType: n,
  typeName: p.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...v(e)
});
class _e extends _ {
  _parse(e) {
    if (this._getType(e) !== l.nan) {
      const r = this._getOrReturnCtx(e);
      return f(r, {
        code: c.invalid_type,
        expected: l.nan,
        received: r.parsedType
      }), y;
    }
    return { status: "valid", value: e.data };
  }
}
_e.create = (n) => new _e({
  typeName: p.ZodNaN,
  ...v(n)
});
const gt = Symbol("zod_brand");
class Ue extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), r = t.data;
    return this._def.type._parse({
      data: r,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class de extends _ {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.common.async)
      return (async () => {
        const a = await this._def.in._parseAsync({
          data: r.data,
          path: r.path,
          parent: r
        });
        return a.status === "aborted" ? y : a.status === "dirty" ? (t.dirty(), Le(a.value)) : this._def.out._parseAsync({
          data: a.value,
          path: r.path,
          parent: r
        });
      })();
    {
      const s = this._def.in._parseSync({
        data: r.data,
        path: r.path,
        parent: r
      });
      return s.status === "aborted" ? y : s.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: s.value
      }) : this._def.out._parseSync({
        data: s.value,
        path: r.path,
        parent: r
      });
    }
  }
  static create(e, t) {
    return new de({
      in: e,
      out: t,
      typeName: p.ZodPipeline
    });
  }
}
const Be = (n, e = {}, t) => n ? J.create().superRefine((r, s) => {
  var a, i;
  if (!n(r)) {
    const o = typeof e == "function" ? e(r) : typeof e == "string" ? { message: e } : e, d = (i = (a = o.fatal) !== null && a !== void 0 ? a : t) !== null && i !== void 0 ? i : !0, u = typeof o == "string" ? { message: o } : o;
    s.addIssue({ code: "custom", ...u, fatal: d });
  }
}) : J.create(), vt = {
  object: k.lazycreate
};
var p;
(function(n) {
  n.ZodString = "ZodString", n.ZodNumber = "ZodNumber", n.ZodNaN = "ZodNaN", n.ZodBigInt = "ZodBigInt", n.ZodBoolean = "ZodBoolean", n.ZodDate = "ZodDate", n.ZodSymbol = "ZodSymbol", n.ZodUndefined = "ZodUndefined", n.ZodNull = "ZodNull", n.ZodAny = "ZodAny", n.ZodUnknown = "ZodUnknown", n.ZodNever = "ZodNever", n.ZodVoid = "ZodVoid", n.ZodArray = "ZodArray", n.ZodObject = "ZodObject", n.ZodUnion = "ZodUnion", n.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", n.ZodIntersection = "ZodIntersection", n.ZodTuple = "ZodTuple", n.ZodRecord = "ZodRecord", n.ZodMap = "ZodMap", n.ZodSet = "ZodSet", n.ZodFunction = "ZodFunction", n.ZodLazy = "ZodLazy", n.ZodLiteral = "ZodLiteral", n.ZodEnum = "ZodEnum", n.ZodEffects = "ZodEffects", n.ZodNativeEnum = "ZodNativeEnum", n.ZodOptional = "ZodOptional", n.ZodNullable = "ZodNullable", n.ZodDefault = "ZodDefault", n.ZodCatch = "ZodCatch", n.ZodPromise = "ZodPromise", n.ZodBranded = "ZodBranded", n.ZodPipeline = "ZodPipeline";
})(p || (p = {}));
const _t = (n, e = {
  message: `Input not instance of ${n.name}`
}) => Be((t) => t instanceof n, e), qe = C.create, We = z.create, xt = _e.create, bt = V.create, He = Q.create, kt = U.create, wt = me.create, Tt = ee.create, St = te.create, Zt = J.create, Et = D.create, Ct = $.create, Ot = ye.create, Nt = N.create, It = k.create, Rt = k.strictCreate, jt = ne.create, At = xe.create, Mt = re.create, $t = j.create, Pt = se.create, zt = ge.create, Vt = B.create, Lt = F.create, Dt = ae.create, Ut = ie.create, Bt = L.create, qt = oe.create, Wt = K.create, Re = I.create, Ht = M.create, Ft = q.create, Jt = I.createWithPreprocess, Kt = de.create, Yt = () => qe().optional(), Gt = () => We().optional(), Xt = () => He().optional(), Qt = {
  string: (n) => C.create({ ...n, coerce: !0 }),
  number: (n) => z.create({ ...n, coerce: !0 }),
  boolean: (n) => Q.create({
    ...n,
    coerce: !0
  }),
  bigint: (n) => V.create({ ...n, coerce: !0 }),
  date: (n) => U.create({ ...n, coerce: !0 })
}, en = y;
var we = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: X,
  setErrorMap: st,
  getErrorMap: le,
  makeIssue: fe,
  EMPTY_PATH: at,
  addIssueToContext: f,
  ParseStatus: T,
  INVALID: y,
  DIRTY: Le,
  OK: S,
  isAborted: Se,
  isDirty: Ze,
  isValid: he,
  isAsync: pe,
  get util() {
    return b;
  },
  get objectUtil() {
    return Te;
  },
  ZodParsedType: l,
  getParsedType: P,
  ZodType: _,
  ZodString: C,
  ZodNumber: z,
  ZodBigInt: V,
  ZodBoolean: Q,
  ZodDate: U,
  ZodSymbol: me,
  ZodUndefined: ee,
  ZodNull: te,
  ZodAny: J,
  ZodUnknown: D,
  ZodNever: $,
  ZodVoid: ye,
  ZodArray: N,
  ZodObject: k,
  ZodUnion: ne,
  ZodDiscriminatedUnion: xe,
  ZodIntersection: re,
  ZodTuple: j,
  ZodRecord: se,
  ZodMap: ge,
  ZodSet: B,
  ZodFunction: F,
  ZodLazy: ae,
  ZodLiteral: ie,
  ZodEnum: L,
  ZodNativeEnum: oe,
  ZodPromise: K,
  ZodEffects: I,
  ZodTransformer: I,
  ZodOptional: M,
  ZodNullable: q,
  ZodDefault: ce,
  ZodCatch: ve,
  ZodNaN: _e,
  BRAND: gt,
  ZodBranded: Ue,
  ZodPipeline: de,
  custom: Be,
  Schema: _,
  ZodSchema: _,
  late: vt,
  get ZodFirstPartyTypeKind() {
    return p;
  },
  coerce: Qt,
  any: Zt,
  array: Nt,
  bigint: bt,
  boolean: He,
  date: kt,
  discriminatedUnion: At,
  effect: Re,
  enum: Bt,
  function: Lt,
  instanceof: _t,
  intersection: Mt,
  lazy: Dt,
  literal: Ut,
  map: zt,
  nan: xt,
  nativeEnum: qt,
  never: Ct,
  null: St,
  nullable: Ft,
  number: We,
  object: It,
  oboolean: Xt,
  onumber: Gt,
  optional: Ht,
  ostring: Yt,
  pipeline: Kt,
  preprocess: Jt,
  promise: Wt,
  record: Pt,
  set: Vt,
  strictObject: Rt,
  string: qe,
  symbol: wt,
  transformer: Re,
  tuple: $t,
  undefined: Tt,
  union: jt,
  unknown: Et,
  void: Ot,
  NEVER: en,
  ZodIssueCode: c,
  quotelessJson: rt,
  ZodError: O
});
class tn extends Xe {
  /* eslint-enabled */
  fieldMappings = new Map(
    Object.entries({
      domain: "domain",
      id: "id",
      name: "name",
      slug: "slug"
    })
  );
  constructor(e) {
    super(e), this.init();
  }
  getAllWithAliasesSql = (e) => {
    const t = [];
    for (const r of e)
      t.push(w.fragment`${this.getAliasedField(r)}`);
    return w.type(we.any())`
      SELECT ${w.join(t, w.fragment`, `)}
      FROM ${this.getTableFragment()}
      ORDER BY ${w.identifier([
      H.decamelize(this.getMappedField("id"))
    ])} ASC;
    `;
  };
  getCreateSql = (e) => {
    const t = [], r = [];
    for (const s in e) {
      const a = s, i = e[a];
      t.push(
        w.identifier([H.decamelize(this.getMappedField(a))])
      ), r.push(i);
    }
    return w.type(we.any())`
      INSERT INTO ${this.getTableFragment()}
        (${w.join(t, w.fragment`, `)})
      VALUES (${w.join(r, w.fragment`, `)})
      RETURNING *;
    `;
  };
  getFindByHostnameSql = (e, t) => w.type(we.any())`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE ${w.identifier([
    H.decamelize(this.getMappedField("domain"))
  ])} = ${e}
      OR (
        ${w.identifier([H.decamelize(this.getMappedField("slug"))])}
        || '.' ||
        ${t}
      ) = ${e};
    `;
  getAliasedField = (e) => {
    const t = this.getMappedField(e);
    return t === e ? w.identifier([e]) : w.join(
      [w.identifier([t]), w.identifier([e])],
      w.fragment` AS `
    );
  };
  getMappedField = (e) => this.fieldMappings.has(e) ? this.fieldMappings.get(e) : e;
  init() {
    const e = this.config.multiTenant?.table?.columns;
    if (e)
      for (const t in e) {
        const r = t;
        this.fieldMappings.set(r, e[r]);
      }
  }
}
class Fe extends Qe {
  all = async (e) => {
    const t = this.factory.getAllWithAliasesSql(e);
    return await this.database.connect((s) => s.any(t));
  };
  findByHostname = async (e) => {
    const t = this.factory.getFindByHostnameSql(
      e,
      this.config.multiTenant.rootDomain
    );
    return await this.database.connect(async (s) => s.maybeOne(t));
  };
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new tn(this)), this._factory;
  }
  get table() {
    return this.config.multiTenant?.table?.name || "tenants";
  }
  postCreate = async (e) => {
    const t = Pe(this.config);
    return await ze(
      Me(this.config.slonik),
      t.migrations.path,
      e
    ), e;
  };
}
const nn = async (n, e, t) => {
  try {
    const { config: r, slonik: s } = n, a = Me(r.slonik), o = Pe(r).migrations.path;
    if (je(o)) {
      const u = await new Fe(r, s).all(["name", "slug"]), m = await $e(a);
      for (const Z of u)
        n.log.info(`Running migrations for tenant ${Z.name}`), await ze({ client: m }, o, Z);
      await Ae(m, "public"), await m.end();
    } else
      n.log.warn(
        `Tenant migrations path '${o}' does not exists.`
      );
  } catch (r) {
    throw n.log.error("🔴 multi-tenant: Failed to run tenant migrations"), r;
  }
  t();
}, rn = Ce(nn), sn = async (n, e, t) => {
  const r = n.multiTenant?.reserved?.slugs, s = n.multiTenant?.reserved?.domains;
  if (s && s.includes(t) || r && r.some(
    (o) => `${o}.${n.multiTenant.rootDomain}` === t
  ))
    return null;
  const i = await new Fe(n, e).findByHostname(t);
  if (i)
    return i;
  throw new Error("Tenant not found");
}, an = (n) => {
  let e;
  try {
    if (e = new URL(n).host, !e)
      throw new Error("Host is empty");
  } catch {
    e = n;
  }
  return e;
}, on = async (n, e, t) => {
  n.addHook(
    "preHandler",
    async (r, s) => {
      const a = r.headers.referer || r.headers.origin || r.hostname, { config: i, slonik: o } = r;
      try {
        const d = await sn(i, o, an(a));
        d && (r.tenant = d);
      } catch (d) {
        return n.log.error(d), s.send({ error: { message: "Tenant not found" } });
      }
    }
  ), t();
}, cn = Ce(on), dn = async (n, e, t) => {
  n.log.info("Registering fastify-multi-tenant plugin"), await n.register(rn), await n.register(cn), t();
}, un = Ce(dn);
un.updateContext = et;
export {
  Fe as TenantService,
  un as default
};

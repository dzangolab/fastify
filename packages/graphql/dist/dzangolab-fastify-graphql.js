import be from "fastify-plugin";
import xe from "mercurius";
import { parse as fe, versionInfo as Le, GraphQLError as ee, isNonNullType as M, Kind as o, valueFromAST as de, print as Me, valueFromASTUntyped as Ve, isListType as pe, isInputObjectType as me, isLeafType as Ce, isEnumType as Ee, isSpecifiedDirective as Pe, isSpecifiedScalarType as Ue, isIntrospectionType as Be, isObjectType as we, isInterfaceType as je, isUnionType as Re, isScalarType as $e, GraphQLDeprecatedDirective as Ye, visit as Je, TokenKind as Qe, Source as He, isSchema as Ge, isDefinitionNode as Xe } from "graphql";
const We = async (e, n) => {
  const t = e.config.graphql.plugins, i = {
    config: e.config,
    database: e.slonik,
    dbSchema: e.dbSchema
  };
  if (t)
    for (const r of t)
      await r.updateContext(i, e, n);
  return i;
}, qe = async (e) => {
  const n = e.config.graphql;
  n?.enabled ? await e.register(xe, {
    context: We,
    ...n
  }) : e.log.info("GraphQL API not enabled");
}, Dt = be(qe);
var w = function() {
  return w = Object.assign || function(n) {
    for (var t, i = 1, r = arguments.length; i < r; i++) {
      t = arguments[i];
      for (var s in t)
        Object.prototype.hasOwnProperty.call(t, s) && (n[s] = t[s]);
    }
    return n;
  }, w.apply(this, arguments);
}, B = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), Te = !0, j = !1;
function ve(e) {
  return e.replace(/[\s,]+/g, " ").trim();
}
function ze(e) {
  return ve(e.source.body.substring(e.start, e.end));
}
function Ke(e) {
  var n = /* @__PURE__ */ new Set(), t = [];
  return e.definitions.forEach(function(i) {
    if (i.kind === "FragmentDefinition") {
      var r = i.name.value, s = ze(i.loc), a = Q.get(r);
      a && !a.has(s) ? Te && console.warn("Warning: fragment with name " + r + ` already exists.
graphql-tag enforces all fragment names across your application to be unique; read more about
this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names`) : a || Q.set(r, a = /* @__PURE__ */ new Set()), a.add(s), n.has(s) || (n.add(s), t.push(i));
    } else
      t.push(i);
  }), w(w({}, e), { definitions: t });
}
function Ze(e) {
  var n = new Set(e.definitions);
  n.forEach(function(i) {
    i.loc && delete i.loc, Object.keys(i).forEach(function(r) {
      var s = i[r];
      s && typeof s == "object" && n.add(s);
    });
  });
  var t = e.loc;
  return t && (delete t.startToken, delete t.endToken), e;
}
function en(e) {
  var n = ve(e);
  if (!B.has(n)) {
    var t = fe(e, {
      experimentalFragmentVariables: j,
      allowLegacyFragmentVariables: j
    });
    if (!t || t.kind !== "Document")
      throw new Error("Not a valid GraphQL document.");
    B.set(n, Ze(Ke(t)));
  }
  return B.get(n);
}
function F(e) {
  for (var n = [], t = 1; t < arguments.length; t++)
    n[t - 1] = arguments[t];
  typeof e == "string" && (e = [e]);
  var i = e[0];
  return n.forEach(function(r, s) {
    r && r.kind === "Document" ? i += r.loc.source.body : i += r, i += e[s + 1];
  }), en(i);
}
function nn() {
  B.clear(), Q.clear();
}
function tn() {
  Te = !1;
}
function rn() {
  j = !0;
}
function sn() {
  j = !1;
}
var b = {
  gql: F,
  resetCaches: nn,
  disableFragmentWarnings: tn,
  enableExperimentalFragmentVariables: rn,
  disableExperimentalFragmentVariables: sn
};
(function(e) {
  e.gql = b.gql, e.resetCaches = b.resetCaches, e.disableFragmentWarnings = b.disableFragmentWarnings, e.enableExperimentalFragmentVariables = b.enableExperimentalFragmentVariables, e.disableExperimentalFragmentVariables = b.disableExperimentalFragmentVariables;
})(F || (F = {}));
F.default = F;
function on(e, n) {
  return String(e) < String(n) ? -1 : String(e) > String(n) ? 1 : 0;
}
function ne(e) {
  let n;
  return "alias" in e && (n = e.alias?.value), n == null && "name" in e && (n = e.name?.value), n == null && (n = e.kind), n;
}
function $(e, n, t) {
  const i = ne(e), r = ne(n);
  return typeof t == "function" ? t(i, r) : on(i, r);
}
function q(e) {
  return e != null;
}
const Ne = 3;
function V(e) {
  return Y(e, []);
}
function Y(e, n) {
  switch (typeof e) {
    case "string":
      return JSON.stringify(e);
    case "function":
      return e.name ? `[function ${e.name}]` : "[function]";
    case "object":
      return an(e, n);
    default:
      return String(e);
  }
}
function te(e) {
  return (e.name = "GraphQLError") ? e.toString() : `${e.name}: ${e.message};
 ${e.stack}`;
}
function an(e, n) {
  if (e === null)
    return "null";
  if (e instanceof Error)
    return e.name === "AggregateError" ? te(e) + `
` + ie(e.errors, n) : te(e);
  if (n.includes(e))
    return "[Circular]";
  const t = [...n, e];
  if (un(e)) {
    const i = e.toJSON();
    if (i !== e)
      return typeof i == "string" ? i : Y(i, t);
  } else if (Array.isArray(e))
    return ie(e, t);
  return cn(e, t);
}
function un(e) {
  return typeof e.toJSON == "function";
}
function cn(e, n) {
  const t = Object.entries(e);
  return t.length === 0 ? "{}" : n.length > Ne ? "[" + ln(e) + "]" : "{ " + t.map(([r, s]) => r + ": " + Y(s, n)).join(", ") + " }";
}
function ie(e, n) {
  if (e.length === 0)
    return "[]";
  if (n.length > Ne)
    return "[Array]";
  const t = e.length, i = [];
  for (let r = 0; r < t; ++r)
    i.push(Y(e[r], n));
  return "[" + i.join(", ") + "]";
}
function ln(e) {
  const n = Object.prototype.toString.call(e).replace(/^\[object /, "").replace(/]$/, "");
  if (n === "Object" && typeof e.constructor == "function") {
    const t = e.constructor.name;
    if (typeof t == "string" && t !== "")
      return t;
  }
  return n;
}
const fn = [
  "message",
  "locations",
  "path",
  "nodes",
  "source",
  "positions",
  "originalError",
  "name",
  "stack",
  "extensions"
];
function dn(e) {
  return e != null && typeof e == "object" && Object.keys(e).every((n) => fn.includes(n));
}
function x(e, n) {
  return n?.originalError && !(n.originalError instanceof Error) && dn(n.originalError) && (n.originalError = x(n.originalError.message, n.originalError)), Le.major >= 17 ? new ee(e, n) : new ee(e, n?.nodes, n?.source, n?.positions, n?.path, n?.originalError, n?.extensions);
}
function pn(e) {
  return e != null && typeof e == "object" && Symbol.iterator in e;
}
function mn(e) {
  return typeof e == "object" && e !== null;
}
function En(e, n) {
  return Object.prototype.hasOwnProperty.call(e, n);
}
function Tn(e, n, t = {}) {
  const i = {}, s = (n.arguments ?? []).reduce((a, u) => ({
    ...a,
    [u.name.value]: u
  }), {});
  for (const { name: a, type: u, defaultValue: c } of e.args) {
    const f = s[a];
    if (!f) {
      if (c !== void 0)
        i[a] = c;
      else if (M(u))
        throw x(`Argument "${a}" of required type "${V(u)}" was not provided.`, {
          nodes: [n]
        });
      continue;
    }
    const d = f.value;
    let p = d.kind === o.NULL;
    if (d.kind === o.VARIABLE) {
      const v = d.name.value;
      if (t == null || !En(t, v)) {
        if (c !== void 0)
          i[a] = c;
        else if (M(u))
          throw x(`Argument "${a}" of required type "${V(u)}" was provided the variable "$${v}" which was not provided a runtime value.`, {
            nodes: [d]
          });
        continue;
      }
      p = t[v] == null;
    }
    if (p && M(u))
      throw x(`Argument "${a}" of non-null type "${V(u)}" must not be null.`, {
        nodes: [d]
      });
    const E = de(d, u, t);
    if (E === void 0)
      throw x(`Argument "${a}" has invalid value ${Me(d)}.`, {
        nodes: [d]
      });
    i[a] = E;
  }
  return i;
}
function Ie(e) {
  const n = /* @__PURE__ */ new WeakMap();
  return function(i) {
    const r = n.get(i);
    if (r === void 0) {
      const s = e(i);
      return n.set(i, s), s;
    }
    return r;
  };
}
function vn(e, n, t = ["directives"]) {
  const i = {};
  if (e.extensions) {
    let a = e.extensions;
    for (const u of t)
      a = a?.[u];
    if (a != null)
      for (const u in a) {
        const c = a[u], f = u;
        if (Array.isArray(c))
          for (const d of c) {
            let p = i[f];
            p || (p = [], i[f] = p), p.push(d);
          }
        else {
          let d = i[f];
          d || (d = [], i[f] = d), d.push(c);
        }
      }
  }
  const r = Ie((a) => JSON.stringify(a)), s = [];
  e.astNode && s.push(e.astNode), e.extensionASTNodes && s.push(...e.extensionASTNodes);
  for (const a of s)
    if (a.directives?.length)
      for (const u of a.directives) {
        const c = u.name.value;
        let f = i[c];
        f || (f = [], i[c] = f);
        const d = n?.getDirective(c);
        let p = {};
        if (d && (p = Tn(d, u)), u.arguments)
          for (const E of u.arguments) {
            const v = E.name.value;
            if (p[v] == null) {
              const Z = d?.args.find((Fe) => Fe.name === v);
              Z && (p[v] = de(E.value, Z.type));
            }
            p[v] == null && (p[v] = Ve(E.value));
          }
        if (s.length > 0 && f.length > 0) {
          const E = r(p);
          if (f.some((v) => r(v) === E))
            continue;
        }
        f.push(p);
      }
  return i;
}
function ye(e, n = ["directives"]) {
  const t = vn(e, void 0, n);
  return Object.entries(t).map(([i, r]) => r?.map((s) => ({
    name: i,
    args: s
  }))).flat(1 / 0).filter(Boolean);
}
function g(e) {
  if (M(e)) {
    const n = g(e.ofType);
    if (n.kind === o.NON_NULL_TYPE)
      throw new Error(`Invalid type node ${V(e)}. Inner type of non-null type cannot be a non-null type.`);
    return {
      kind: o.NON_NULL_TYPE,
      type: n
    };
  } else if (pe(e))
    return {
      kind: o.LIST_TYPE,
      type: g(e.ofType)
    };
  return {
    kind: o.NAMED_TYPE,
    name: {
      kind: o.NAME,
      value: e.name
    }
  };
}
function C(e) {
  if (e === null)
    return { kind: o.NULL };
  if (e === void 0)
    return null;
  if (Array.isArray(e)) {
    const n = [];
    for (const t of e) {
      const i = C(t);
      i != null && n.push(i);
    }
    return { kind: o.LIST, values: n };
  }
  if (typeof e == "object") {
    if (e?.toJSON)
      return C(e.toJSON());
    const n = [];
    for (const t in e) {
      const i = e[t], r = C(i);
      r && n.push({
        kind: o.OBJECT_FIELD,
        name: { kind: o.NAME, value: t },
        value: r
      });
    }
    return { kind: o.OBJECT, fields: n };
  }
  if (typeof e == "boolean")
    return { kind: o.BOOLEAN, value: e };
  if (typeof e == "bigint")
    return { kind: o.INT, value: String(e) };
  if (typeof e == "number" && isFinite(e)) {
    const n = String(e);
    return Nn.test(n) ? { kind: o.INT, value: n } : { kind: o.FLOAT, value: n };
  }
  if (typeof e == "string")
    return { kind: o.STRING, value: e };
  throw new TypeError(`Cannot convert value to AST: ${e}.`);
}
const Nn = /^-?(?:0|[1-9][0-9]*)$/;
function O(e, n) {
  if (M(n)) {
    const t = O(e, n.ofType);
    return t?.kind === o.NULL ? null : t;
  }
  if (e === null)
    return { kind: o.NULL };
  if (e === void 0)
    return null;
  if (pe(n)) {
    const t = n.ofType;
    if (pn(e)) {
      const i = [];
      for (const r of e) {
        const s = O(r, t);
        s != null && i.push(s);
      }
      return { kind: o.LIST, values: i };
    }
    return O(e, t);
  }
  if (me(n)) {
    if (!mn(e))
      return null;
    const t = [];
    for (const i of Object.values(n.getFields())) {
      const r = O(e[i.name], i.type);
      r && t.push({
        kind: o.OBJECT_FIELD,
        name: { kind: o.NAME, value: i.name },
        value: r
      });
    }
    return { kind: o.OBJECT, fields: t };
  }
  if (Ce(n)) {
    const t = n.serialize(e);
    return t == null ? null : Ee(n) ? { kind: o.ENUM, value: t } : n.name === "ID" && typeof t == "string" && In.test(t) ? { kind: o.INT, value: t } : C(t);
  }
  console.assert(!1, "Unexpected input type: " + V(n));
}
const In = /^-?(?:0|[1-9][0-9]*)$/;
function T(e) {
  if (e.astNode?.description)
    return {
      ...e.astNode.description,
      block: !0
    };
  if (e.description)
    return {
      kind: o.STRING,
      value: e.description,
      block: !0
    };
}
const yn = Ie(function(n) {
  const t = /* @__PURE__ */ new Map(), i = n.getQueryType();
  i && t.set("query", i);
  const r = n.getMutationType();
  r && t.set("mutation", r);
  const s = n.getSubscriptionType();
  return s && t.set("subscription", s), t;
});
function gn(e, n = {}) {
  const t = n.pathToDirectivesInExtensions, i = e.getTypeMap(), r = Dn(e, t), s = r != null ? [r] : [], a = e.getDirectives();
  for (const u of a)
    Pe(u) || s.push(hn(u, e, t));
  for (const u in i) {
    const c = i[u], f = Ue(c), d = Be(c);
    if (!(f || d))
      if (we(c))
        s.push(On(c, e, t));
      else if (je(c))
        s.push(kn(c, e, t));
      else if (Re(c))
        s.push(_n(c, e, t));
      else if (me(c))
        s.push(An(c, e, t));
      else if (Ee(c))
        s.push(Sn(c, e, t));
      else if ($e(c))
        s.push(Fn(c, e, t));
      else
        throw new Error(`Unknown type ${c}.`);
  }
  return {
    kind: o.DOCUMENT,
    definitions: s
  };
}
function Dn(e, n) {
  const t = /* @__PURE__ */ new Map([
    ["query", void 0],
    ["mutation", void 0],
    ["subscription", void 0]
  ]), i = [];
  if (e.astNode != null && i.push(e.astNode), e.extensionASTNodes != null)
    for (const f of e.extensionASTNodes)
      i.push(f);
  for (const f of i)
    if (f.operationTypes)
      for (const d of f.operationTypes)
        t.set(d.operation, d);
  const r = yn(e);
  for (const [f, d] of t) {
    const p = r.get(f);
    if (p != null) {
      const E = g(p);
      d != null ? d.type = E : t.set(f, {
        kind: o.OPERATION_TYPE_DEFINITION,
        operation: f,
        type: E
      });
    }
  }
  const s = [...t.values()].filter(q), a = y(e, e, n);
  if (!s.length && !a.length)
    return null;
  const u = {
    kind: s != null ? o.SCHEMA_DEFINITION : o.SCHEMA_EXTENSION,
    operationTypes: s,
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: a
  }, c = T(e);
  return c && (u.description = c), u;
}
function hn(e, n, t) {
  return {
    kind: o.DIRECTIVE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    arguments: e.args?.map((i) => ge(i, n, t)),
    repeatable: e.isRepeatable,
    locations: e.locations?.map((i) => ({
      kind: o.NAME,
      value: i
    })) || []
  };
}
function y(e, n, t) {
  let i = [];
  const r = ye(e, t);
  let s;
  r != null && (s = he(n, r));
  let a = null, u = null;
  if (s != null && (i = s.filter((c) => c.name.value !== "deprecated" && c.name.value !== "specifiedBy"), e.deprecationReason != null && (a = s.filter((c) => c.name.value === "deprecated")?.[0]), (e.specifiedByUrl != null || e.specifiedByURL != null) && (u = s.filter((c) => c.name.value === "specifiedBy")?.[0])), e.deprecationReason != null && a == null && (a = Ln(e.deprecationReason)), e.specifiedByUrl != null || e.specifiedByURL != null && u == null) {
    const f = {
      url: e.specifiedByUrl || e.specifiedByURL
    };
    u = J("specifiedBy", f);
  }
  return a != null && i.push(a), u != null && i.push(u), i;
}
function ge(e, n, t) {
  return {
    kind: o.INPUT_VALUE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    type: g(e.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    defaultValue: e.defaultValue !== void 0 ? O(e.defaultValue, e.type) ?? void 0 : void 0,
    directives: y(e, n, t)
  };
}
function On(e, n, t) {
  return {
    kind: o.OBJECT_TYPE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    fields: Object.values(e.getFields()).map((i) => De(i, n, t)),
    interfaces: Object.values(e.getInterfaces()).map((i) => g(i)),
    directives: y(e, n, t)
  };
}
function kn(e, n, t) {
  const i = {
    kind: o.INTERFACE_TYPE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    fields: Object.values(e.getFields()).map((r) => De(r, n, t)),
    directives: y(e, n, t)
  };
  return "getInterfaces" in e && (i.interfaces = Object.values(e.getInterfaces()).map((r) => g(r))), i;
}
function _n(e, n, t) {
  return {
    kind: o.UNION_TYPE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: y(e, n, t),
    types: e.getTypes().map((i) => g(i))
  };
}
function An(e, n, t) {
  return {
    kind: o.INPUT_OBJECT_TYPE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    fields: Object.values(e.getFields()).map((i) => bn(i, n, t)),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: y(e, n, t)
  };
}
function Sn(e, n, t) {
  return {
    kind: o.ENUM_TYPE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    values: Object.values(e.getValues()).map((i) => xn(i, n, t)),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: y(e, n, t)
  };
}
function Fn(e, n, t) {
  const i = ye(e, t), r = he(n, i), s = e.specifiedByUrl || e.specifiedByURL;
  if (s && !r.some((a) => a.name.value === "specifiedBy")) {
    const a = {
      url: s
    };
    r.push(J("specifiedBy", a));
  }
  return {
    kind: o.SCALAR_TYPE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: r
  };
}
function De(e, n, t) {
  return {
    kind: o.FIELD_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    arguments: e.args.map((i) => ge(i, n, t)),
    type: g(e.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: y(e, n, t)
  };
}
function bn(e, n, t) {
  return {
    kind: o.INPUT_VALUE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    type: g(e.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: y(e, n, t),
    defaultValue: O(e.defaultValue, e.type) ?? void 0
  };
}
function xn(e, n, t) {
  return {
    kind: o.ENUM_VALUE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    directives: y(e, n, t)
  };
}
function Ln(e) {
  return J("deprecated", { reason: e }, Ye);
}
function J(e, n, t) {
  const i = [];
  for (const r in n) {
    const s = n[r];
    let a;
    if (t != null) {
      const u = t.args.find((c) => c.name === r);
      u && (a = O(s, u.type));
    }
    a == null && (a = C(s)), a != null && i.push({
      kind: o.ARGUMENT,
      name: {
        kind: o.NAME,
        value: r
      },
      value: a
    });
  }
  return {
    kind: o.DIRECTIVE,
    name: {
      kind: o.NAME,
      value: e
    },
    arguments: i
  };
}
function he(e, n) {
  const t = [];
  for (const { name: i, args: r } of n) {
    const s = e?.getDirective(i);
    t.push(J(i, r, s));
  }
  return t;
}
const Mn = 80;
let S = {};
function H() {
  S = {};
}
function Vn(e) {
  const n = e.name?.value;
  if (n != null)
    switch (U(e, n), e.kind) {
      case "EnumTypeDefinition":
        if (e.values)
          for (const t of e.values)
            U(t, n, t.name.value);
        break;
      case "ObjectTypeDefinition":
      case "InputObjectTypeDefinition":
      case "InterfaceTypeDefinition":
        if (e.fields) {
          for (const t of e.fields)
            if (U(t, n, t.name.value), jn(t) && t.arguments)
              for (const i of t.arguments)
                U(i, n, t.name.value, i.name.value);
        }
        break;
    }
}
function U(e, n, t, i) {
  const r = Rn(e);
  if (typeof r != "string" || r.length === 0)
    return;
  const s = [n];
  t && (s.push(t), i && s.push(i));
  const a = s.join(".");
  S[a] || (S[a] = []), S[a].push(r);
}
function Cn(e) {
  return `
# ` + e.replace(/\n/g, `
# `);
}
function l(e, n) {
  return e ? e.filter((t) => t).join(n || "") : "";
}
function re(e) {
  return e?.some((n) => n.includes(`
`)) ?? !1;
}
function Pn(e) {
  return (n, t, i, r, s) => {
    const a = [], u = r.reduce((d, p) => (["fields", "arguments", "values"].includes(p) && d.name && a.push(d.name.value), d[p]), s[0]), c = [...a, u?.name?.value].filter(Boolean).join("."), f = [];
    return n.kind.includes("Definition") && S[c] && f.push(...S[c]), l([...f.map(Cn), n.description, e(n, t, i, r, s)], `
`);
  };
}
function P(e) {
  return e && `  ${e.replace(/\n/g, `
  `)}`;
}
function N(e) {
  return e && e.length !== 0 ? `{
${P(l(e, `
`))}
}` : "";
}
function m(e, n, t) {
  return n ? e + n + (t || "") : "";
}
function Un(e, n = !1) {
  const t = e.replace(/"""/g, '\\"""');
  return (e[0] === " " || e[0] === "	") && e.indexOf(`
`) === -1 ? `"""${t.replace(/"$/, `"
`)}"""` : `"""
${n ? t : P(t)}
"""`;
}
const se = {
  Name: { leave: (e) => e.value },
  Variable: { leave: (e) => "$" + e.name },
  // Document
  Document: {
    leave: (e) => l(e.definitions, `

`)
  },
  OperationDefinition: {
    leave: (e) => {
      const n = m("(", l(e.variableDefinitions, ", "), ")");
      return l([e.operation, l([e.name, n]), l(e.directives, " ")], " ") + " " + e.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable: e, type: n, defaultValue: t, directives: i }) => e + ": " + n + m(" = ", t) + m(" ", l(i, " "))
  },
  SelectionSet: { leave: ({ selections: e }) => N(e) },
  Field: {
    leave({ alias: e, name: n, arguments: t, directives: i, selectionSet: r }) {
      const s = m("", e, ": ") + n;
      let a = s + m("(", l(t, ", "), ")");
      return a.length > Mn && (a = s + m(`(
`, P(l(t, `
`)), `
)`)), l([a, l(i, " "), r], " ");
    }
  },
  Argument: { leave: ({ name: e, value: n }) => e + ": " + n },
  // Fragments
  FragmentSpread: {
    leave: ({ name: e, directives: n }) => "..." + e + m(" ", l(n, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition: e, directives: n, selectionSet: t }) => l(["...", m("on ", e), l(n, " "), t], " ")
  },
  FragmentDefinition: {
    leave: ({ name: e, typeCondition: n, variableDefinitions: t, directives: i, selectionSet: r }) => (
      // Note: fragment variable definitions are experimental and may be changed
      // or removed in the future.
      `fragment ${e}${m("(", l(t, ", "), ")")} on ${n} ${m("", l(i, " "), " ")}` + r
    )
  },
  // Value
  IntValue: { leave: ({ value: e }) => e },
  FloatValue: { leave: ({ value: e }) => e },
  StringValue: {
    leave: ({ value: e, block: n }) => n ? Un(e) : JSON.stringify(e)
  },
  BooleanValue: { leave: ({ value: e }) => e ? "true" : "false" },
  NullValue: { leave: () => "null" },
  EnumValue: { leave: ({ value: e }) => e },
  ListValue: { leave: ({ values: e }) => "[" + l(e, ", ") + "]" },
  ObjectValue: { leave: ({ fields: e }) => "{" + l(e, ", ") + "}" },
  ObjectField: { leave: ({ name: e, value: n }) => e + ": " + n },
  // Directive
  Directive: {
    leave: ({ name: e, arguments: n }) => "@" + e + m("(", l(n, ", "), ")")
  },
  // Type
  NamedType: { leave: ({ name: e }) => e },
  ListType: { leave: ({ type: e }) => "[" + e + "]" },
  NonNullType: { leave: ({ type: e }) => e + "!" },
  // Type System Definitions
  SchemaDefinition: {
    leave: ({ directives: e, operationTypes: n }) => l(["schema", l(e, " "), N(n)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation: e, type: n }) => e + ": " + n
  },
  ScalarTypeDefinition: {
    leave: ({ name: e, directives: n }) => l(["scalar", e, l(n, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ name: e, interfaces: n, directives: t, fields: i }) => l([
      "type",
      e,
      m("implements ", l(n, " & ")),
      l(t, " "),
      N(i)
    ], " ")
  },
  FieldDefinition: {
    leave: ({ name: e, arguments: n, type: t, directives: i }) => e + (re(n) ? m(`(
`, P(l(n, `
`)), `
)`) : m("(", l(n, ", "), ")")) + ": " + t + m(" ", l(i, " "))
  },
  InputValueDefinition: {
    leave: ({ name: e, type: n, defaultValue: t, directives: i }) => l([e + ": " + n, m("= ", t), l(i, " ")], " ")
  },
  InterfaceTypeDefinition: {
    leave: ({ name: e, interfaces: n, directives: t, fields: i }) => l([
      "interface",
      e,
      m("implements ", l(n, " & ")),
      l(t, " "),
      N(i)
    ], " ")
  },
  UnionTypeDefinition: {
    leave: ({ name: e, directives: n, types: t }) => l(["union", e, l(n, " "), m("= ", l(t, " | "))], " ")
  },
  EnumTypeDefinition: {
    leave: ({ name: e, directives: n, values: t }) => l(["enum", e, l(n, " "), N(t)], " ")
  },
  EnumValueDefinition: {
    leave: ({ name: e, directives: n }) => l([e, l(n, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ name: e, directives: n, fields: t }) => l(["input", e, l(n, " "), N(t)], " ")
  },
  DirectiveDefinition: {
    leave: ({ name: e, arguments: n, repeatable: t, locations: i }) => "directive @" + e + (re(n) ? m(`(
`, P(l(n, `
`)), `
)`) : m("(", l(n, ", "), ")")) + (t ? " repeatable" : "") + " on " + l(i, " | ")
  },
  SchemaExtension: {
    leave: ({ directives: e, operationTypes: n }) => l(["extend schema", l(e, " "), N(n)], " ")
  },
  ScalarTypeExtension: {
    leave: ({ name: e, directives: n }) => l(["extend scalar", e, l(n, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name: e, interfaces: n, directives: t, fields: i }) => l([
      "extend type",
      e,
      m("implements ", l(n, " & ")),
      l(t, " "),
      N(i)
    ], " ")
  },
  InterfaceTypeExtension: {
    leave: ({ name: e, interfaces: n, directives: t, fields: i }) => l([
      "extend interface",
      e,
      m("implements ", l(n, " & ")),
      l(t, " "),
      N(i)
    ], " ")
  },
  UnionTypeExtension: {
    leave: ({ name: e, directives: n, types: t }) => l(["extend union", e, l(n, " "), m("= ", l(t, " | "))], " ")
  },
  EnumTypeExtension: {
    leave: ({ name: e, directives: n, values: t }) => l(["extend enum", e, l(n, " "), N(t)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name: e, directives: n, fields: t }) => l(["extend input", e, l(n, " "), N(t)], " ")
  }
}, Bn = Object.keys(se).reduce((e, n) => ({
  ...e,
  [n]: {
    leave: Pn(se[n].leave)
  }
}), {});
function wn(e) {
  return Je(e, Bn);
}
function jn(e) {
  return e.kind === "FieldDefinition";
}
function Rn(e) {
  const n = $n(e);
  if (n !== void 0)
    return Yn(`
${n}`);
}
function $n(e) {
  const n = e.loc;
  if (!n)
    return;
  const t = [];
  let i = n.startToken.prev;
  for (; i != null && i.kind === Qe.COMMENT && i.next != null && i.prev != null && i.line + 1 === i.next.line && i.line !== i.prev.line; ) {
    const r = String(i.value);
    t.push(r), i = i.prev;
  }
  return t.length > 0 ? t.reverse().join(`
`) : void 0;
}
function Yn(e) {
  const n = e.split(/\r\n|[\n\r]/g), t = Jn(n);
  if (t !== 0)
    for (let i = 1; i < n.length; i++)
      n[i] = n[i].slice(t);
  for (; n.length > 0 && oe(n[0]); )
    n.shift();
  for (; n.length > 0 && oe(n[n.length - 1]); )
    n.pop();
  return n.join(`
`);
}
function Jn(e) {
  let n = null;
  for (let t = 1; t < e.length; t++) {
    const i = e[t], r = Oe(i);
    if (r !== i.length && (n === null || r < n) && (n = r, n === 0))
      break;
  }
  return n === null ? 0 : n;
}
function Oe(e) {
  let n = 0;
  for (; n < e.length && (e[n] === " " || e[n] === "	"); )
    n++;
  return n;
}
function oe(e) {
  return Oe(e) === e.length;
}
function Qn(e) {
  return e && typeof e == "object" && "kind" in e && e.kind === o.DOCUMENT;
}
function Hn(e, n, t) {
  const i = Gn([...n, ...e].filter(q), t);
  return t && t.sort && i.sort($), i;
}
function Gn(e, n) {
  return e.reduce((t, i) => {
    const r = t.findIndex((s) => s.name.value === i.name.value);
    return r === -1 ? t.concat([i]) : (n?.reverseArguments || (t[r] = i), t);
  }, []);
}
function Xn(e, n) {
  return !!e.find((t) => t.name.value === n.name.value);
}
function ke(e, n) {
  return !!n?.[e.name.value]?.repeatable;
}
function ae(e, n) {
  return n.some(({ value: t }) => t === e.value);
}
function _e(e, n) {
  const t = [...n];
  for (const i of e) {
    const r = t.findIndex((s) => s.name.value === i.name.value);
    if (r > -1) {
      const s = t[r];
      if (s.value.kind === "ListValue") {
        const a = s.value.values, u = i.value.values;
        s.value.values = Ae(a, u, (c, f) => {
          const d = c.value;
          return !d || !f.some((p) => p.value === d);
        });
      } else
        s.value = i.value;
    } else
      t.push(i);
  }
  return t;
}
function Wn(e, n) {
  return e.map((t, i, r) => {
    const s = r.findIndex((a) => a.name.value === t.name.value);
    if (s !== i && !ke(t, n)) {
      const a = r[s];
      return t.arguments = _e(t.arguments, a.arguments), null;
    }
    return t;
  }).filter(q);
}
function D(e = [], n = [], t, i) {
  const r = t && t.reverseDirectives, s = r ? e : n, a = r ? n : e, u = Wn([...s], i);
  for (const c of a)
    if (Xn(u, c) && !ke(c, i)) {
      const f = u.findIndex((p) => p.name.value === c.name.value), d = u[f];
      u[f].arguments = _e(c.arguments || [], d.arguments || []);
    } else
      u.push(c);
  return u;
}
function qn(e, n) {
  return n ? {
    ...e,
    arguments: Ae(n.arguments || [], e.arguments || [], (t, i) => !ae(t.name, i.map((r) => r.name))),
    locations: [
      ...n.locations,
      ...e.locations.filter((t) => !ae(t, n.locations))
    ]
  } : e;
}
function Ae(e, n, t) {
  return e.concat(n.filter((i) => t(i, e)));
}
function zn(e, n, t, i) {
  if (t?.consistentEnumMerge) {
    const a = [];
    e && a.push(...e), e = n, n = a;
  }
  const r = /* @__PURE__ */ new Map();
  if (e)
    for (const a of e)
      r.set(a.name.value, a);
  if (n)
    for (const a of n) {
      const u = a.name.value;
      if (r.has(u)) {
        const c = r.get(u);
        c.description = a.description || c.description, c.directives = D(a.directives, c.directives, i);
      } else
        r.set(u, a);
    }
  const s = [...r.values()];
  return t && t.sort && s.sort($), s;
}
function Kn(e, n, t, i) {
  return n ? {
    name: e.name,
    description: e.description || n.description,
    kind: t?.convertExtensions || e.kind === "EnumTypeDefinition" || n.kind === "EnumTypeDefinition" ? "EnumTypeDefinition" : "EnumTypeExtension",
    loc: e.loc,
    directives: D(e.directives, n.directives, t, i),
    values: zn(e.values, n.values, t)
  } : t?.convertExtensions ? {
    ...e,
    kind: o.ENUM_TYPE_DEFINITION
  } : e;
}
function Zn(e) {
  return typeof e == "string";
}
function et(e) {
  return e instanceof He;
}
function ue(e) {
  let n = e;
  for (; n.kind === o.LIST_TYPE || n.kind === "NonNullType"; )
    n = n.type;
  return n;
}
function ce(e) {
  return e.kind !== o.NAMED_TYPE;
}
function G(e) {
  return e.kind === o.LIST_TYPE;
}
function k(e) {
  return e.kind === o.NON_NULL_TYPE;
}
function R(e) {
  return G(e) ? `[${R(e.type)}]` : k(e) ? `${R(e.type)}!` : e.name.value;
}
var h;
(function(e) {
  e[e.A_SMALLER_THAN_B = -1] = "A_SMALLER_THAN_B", e[e.A_EQUALS_B = 0] = "A_EQUALS_B", e[e.A_GREATER_THAN_B = 1] = "A_GREATER_THAN_B";
})(h || (h = {}));
function nt(e, n) {
  return e == null && n == null ? h.A_EQUALS_B : e == null ? h.A_SMALLER_THAN_B : n == null ? h.A_GREATER_THAN_B : e < n ? h.A_SMALLER_THAN_B : e > n ? h.A_GREATER_THAN_B : h.A_EQUALS_B;
}
function tt(e, n) {
  const t = e.findIndex((i) => i.name.value === n.name.value);
  return [t > -1 ? e[t] : null, t];
}
function z(e, n, t, i, r) {
  const s = [];
  if (t != null && s.push(...t), n != null)
    for (const a of n) {
      const [u, c] = tt(s, a);
      if (u && !i?.ignoreFieldConflicts) {
        const f = i?.onFieldTypeConflict && i.onFieldTypeConflict(u, a, e, i?.throwOnConflict) || it(e, u, a, i?.throwOnConflict);
        f.arguments = Hn(a.arguments || [], u.arguments || [], i), f.directives = D(a.directives, u.directives, i, r), f.description = a.description || u.description, s[c] = f;
      } else
        s.push(a);
    }
  if (i && i.sort && s.sort($), i && i.exclusions) {
    const a = i.exclusions;
    return s.filter((u) => !a.includes(`${e.name.value}.${u.name.value}`));
  }
  return s;
}
function it(e, n, t, i = !1) {
  const r = R(n.type), s = R(t.type);
  if (r !== s) {
    const a = ue(n.type), u = ue(t.type);
    if (a.name.value !== u.name.value)
      throw new Error(`Field "${t.name.value}" already defined with a different type. Declared as "${a.name.value}", but you tried to override with "${u.name.value}"`);
    if (!L(n.type, t.type, !i))
      throw new Error(`Field '${e.name.value}.${n.name.value}' changed type from '${r}' to '${s}'`);
  }
  return k(t.type) && !k(n.type) && (n.type = t.type), n;
}
function L(e, n, t = !1) {
  if (!ce(e) && !ce(n))
    return e.toString() === n.toString();
  if (k(n)) {
    const i = k(e) ? e.type : e;
    return L(i, n.type);
  }
  return k(e) ? L(n, e, t) : G(e) ? G(n) && L(e.type, n.type) || k(n) && L(e, n.type) : !1;
}
function rt(e, n, t, i) {
  if (n)
    try {
      return {
        name: e.name,
        description: e.description || n.description,
        kind: t?.convertExtensions || e.kind === "InputObjectTypeDefinition" || n.kind === "InputObjectTypeDefinition" ? "InputObjectTypeDefinition" : "InputObjectTypeExtension",
        loc: e.loc,
        fields: z(e, e.fields, n.fields, t),
        directives: D(e.directives, n.directives, t, i)
      };
    } catch (r) {
      throw new Error(`Unable to merge GraphQL input type "${e.name.value}": ${r.message}`);
    }
  return t?.convertExtensions ? {
    ...e,
    kind: o.INPUT_OBJECT_TYPE_DEFINITION
  } : e;
}
function st(e, n) {
  return !!e.find((t) => t.name.value === n.name.value);
}
function K(e = [], n = [], t = {}) {
  const i = [...n, ...e.filter((r) => !st(n, r))];
  return t && t.sort && i.sort($), i;
}
function ot(e, n, t, i) {
  if (n)
    try {
      return {
        name: e.name,
        description: e.description || n.description,
        kind: t?.convertExtensions || e.kind === "InterfaceTypeDefinition" || n.kind === "InterfaceTypeDefinition" ? "InterfaceTypeDefinition" : "InterfaceTypeExtension",
        loc: e.loc,
        fields: z(e, e.fields, n.fields, t, i),
        directives: D(e.directives, n.directives, t, i),
        interfaces: e.interfaces ? K(e.interfaces, n.interfaces, t) : void 0
      };
    } catch (r) {
      throw new Error(`Unable to merge GraphQL interface "${e.name.value}": ${r.message}`);
    }
  return t?.convertExtensions ? {
    ...e,
    kind: o.INTERFACE_TYPE_DEFINITION
  } : e;
}
var I = {};
Object.defineProperty(I, "__esModule", {
  value: !0
});
I.Token = I.QueryDocumentKeys = I.OperationTypeNode = I.Location = void 0;
var at = I.isNode = ft;
class ut {
  /**
   * The character offset at which this Node begins.
   */
  /**
   * The character offset at which this Node ends.
   */
  /**
   * The Token at which this Node begins.
   */
  /**
   * The Token at which this Node ends.
   */
  /**
   * The Source document the AST represents.
   */
  constructor(n, t, i) {
    this.start = n.start, this.end = t.end, this.startToken = n, this.endToken = t, this.source = i;
  }
  get [Symbol.toStringTag]() {
    return "Location";
  }
  toJSON() {
    return {
      start: this.start,
      end: this.end
    };
  }
}
I.Location = ut;
class ct {
  /**
   * The kind of Token.
   */
  /**
   * The character offset at which this Node begins.
   */
  /**
   * The character offset at which this Node ends.
   */
  /**
   * The 1-indexed line number on which this Token appears.
   */
  /**
   * The 1-indexed column number at which this Token begins.
   */
  /**
   * For non-punctuation tokens, represents the interpreted value of the token.
   *
   * Note: is undefined for punctuation tokens, but typed as string for
   * convenience in the parser.
   */
  /**
   * Tokens exist as nodes in a double-linked-list amongst all tokens
   * including ignored tokens. <SOF> is always the first node and <EOF>
   * the last.
   */
  constructor(n, t, i, r, s, a) {
    this.kind = n, this.start = t, this.end = i, this.line = r, this.column = s, this.value = a, this.prev = null, this.next = null;
  }
  get [Symbol.toStringTag]() {
    return "Token";
  }
  toJSON() {
    return {
      kind: this.kind,
      value: this.value,
      line: this.line,
      column: this.column
    };
  }
}
I.Token = ct;
const Se = {
  Name: [],
  Document: ["definitions"],
  OperationDefinition: [
    "name",
    "variableDefinitions",
    "directives",
    "selectionSet"
  ],
  VariableDefinition: ["variable", "type", "defaultValue", "directives"],
  Variable: ["name"],
  SelectionSet: ["selections"],
  Field: ["alias", "name", "arguments", "directives", "selectionSet"],
  Argument: ["name", "value"],
  FragmentSpread: ["name", "directives"],
  InlineFragment: ["typeCondition", "directives", "selectionSet"],
  FragmentDefinition: [
    "name",
    // Note: fragment variable definitions are deprecated and will removed in v17.0.0
    "variableDefinitions",
    "typeCondition",
    "directives",
    "selectionSet"
  ],
  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ["values"],
  ObjectValue: ["fields"],
  ObjectField: ["name", "value"],
  Directive: ["name", "arguments"],
  NamedType: ["name"],
  ListType: ["type"],
  NonNullType: ["type"],
  SchemaDefinition: ["description", "directives", "operationTypes"],
  OperationTypeDefinition: ["type"],
  ScalarTypeDefinition: ["description", "name", "directives"],
  ObjectTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  FieldDefinition: ["description", "name", "arguments", "type", "directives"],
  InputValueDefinition: [
    "description",
    "name",
    "type",
    "defaultValue",
    "directives"
  ],
  InterfaceTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  UnionTypeDefinition: ["description", "name", "directives", "types"],
  EnumTypeDefinition: ["description", "name", "directives", "values"],
  EnumValueDefinition: ["description", "name", "directives"],
  InputObjectTypeDefinition: ["description", "name", "directives", "fields"],
  DirectiveDefinition: ["description", "name", "arguments", "locations"],
  SchemaExtension: ["directives", "operationTypes"],
  ScalarTypeExtension: ["name", "directives"],
  ObjectTypeExtension: ["name", "interfaces", "directives", "fields"],
  InterfaceTypeExtension: ["name", "interfaces", "directives", "fields"],
  UnionTypeExtension: ["name", "directives", "types"],
  EnumTypeExtension: ["name", "directives", "values"],
  InputObjectTypeExtension: ["name", "directives", "fields"]
};
I.QueryDocumentKeys = Se;
const lt = new Set(Object.keys(Se));
function ft(e) {
  const n = e?.kind;
  return typeof n == "string" && lt.has(n);
}
var X;
I.OperationTypeNode = X;
(function(e) {
  e.QUERY = "query", e.MUTATION = "mutation", e.SUBSCRIPTION = "subscription";
})(X || (I.OperationTypeNode = X = {}));
function dt(e, n, t, i) {
  return n ? {
    name: e.name,
    description: e.description || n.description,
    kind: t?.convertExtensions || e.kind === "ScalarTypeDefinition" || n.kind === "ScalarTypeDefinition" ? "ScalarTypeDefinition" : "ScalarTypeExtension",
    loc: e.loc,
    directives: D(e.directives, n.directives, t, i)
  } : t?.convertExtensions ? {
    ...e,
    kind: o.SCALAR_TYPE_DEFINITION
  } : e;
}
const W = {
  query: "Query",
  mutation: "Mutation",
  subscription: "Subscription"
};
function pt(e = [], n = []) {
  const t = [];
  for (const i in W) {
    const r = e.find((s) => s.operation === i) || n.find((s) => s.operation === i);
    r && t.push(r);
  }
  return t;
}
function mt(e, n, t, i) {
  return n ? {
    kind: e.kind === o.SCHEMA_DEFINITION || n.kind === o.SCHEMA_DEFINITION ? o.SCHEMA_DEFINITION : o.SCHEMA_EXTENSION,
    description: e.description || n.description,
    directives: D(e.directives, n.directives, t, i),
    operationTypes: pt(e.operationTypes, n.operationTypes)
  } : t?.convertExtensions ? {
    ...e,
    kind: o.SCHEMA_DEFINITION
  } : e;
}
function Et(e, n, t, i) {
  if (n)
    try {
      return {
        name: e.name,
        description: e.description || n.description,
        kind: t?.convertExtensions || e.kind === "ObjectTypeDefinition" || n.kind === "ObjectTypeDefinition" ? "ObjectTypeDefinition" : "ObjectTypeExtension",
        loc: e.loc,
        fields: z(e, e.fields, n.fields, t, i),
        directives: D(e.directives, n.directives, t, i),
        interfaces: K(e.interfaces, n.interfaces, t)
      };
    } catch (r) {
      throw new Error(`Unable to merge GraphQL type "${e.name.value}": ${r.message}`);
    }
  return t?.convertExtensions ? {
    ...e,
    kind: o.OBJECT_TYPE_DEFINITION
  } : e;
}
function Tt(e, n, t, i) {
  return n ? {
    name: e.name,
    description: e.description || n.description,
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: D(e.directives, n.directives, t, i),
    kind: t?.convertExtensions || e.kind === "UnionTypeDefinition" || n.kind === "UnionTypeDefinition" ? o.UNION_TYPE_DEFINITION : o.UNION_TYPE_EXTENSION,
    loc: e.loc,
    types: K(e.types, n.types, t)
  } : t?.convertExtensions ? {
    ...e,
    kind: o.UNION_TYPE_DEFINITION
  } : e;
}
const A = "SCHEMA_DEF_SYMBOL";
function vt(e) {
  return "name" in e;
}
function le(e, n, t = {}) {
  const i = t;
  for (const r of e)
    if (vt(r)) {
      const s = r.name?.value;
      if (n?.commentDescriptions && Vn(r), s == null)
        continue;
      if (n?.exclusions?.includes(s + ".*") || n?.exclusions?.includes(s))
        delete i[s];
      else
        switch (r.kind) {
          case o.OBJECT_TYPE_DEFINITION:
          case o.OBJECT_TYPE_EXTENSION:
            i[s] = Et(r, i[s], n, t);
            break;
          case o.ENUM_TYPE_DEFINITION:
          case o.ENUM_TYPE_EXTENSION:
            i[s] = Kn(r, i[s], n, t);
            break;
          case o.UNION_TYPE_DEFINITION:
          case o.UNION_TYPE_EXTENSION:
            i[s] = Tt(r, i[s], n, t);
            break;
          case o.SCALAR_TYPE_DEFINITION:
          case o.SCALAR_TYPE_EXTENSION:
            i[s] = dt(r, i[s], n, t);
            break;
          case o.INPUT_OBJECT_TYPE_DEFINITION:
          case o.INPUT_OBJECT_TYPE_EXTENSION:
            i[s] = rt(r, i[s], n, t);
            break;
          case o.INTERFACE_TYPE_DEFINITION:
          case o.INTERFACE_TYPE_EXTENSION:
            i[s] = ot(r, i[s], n, t);
            break;
          case o.DIRECTIVE_DEFINITION:
            i[s] && s in {} && (at(i[s]) || (i[s] = void 0)), i[s] = qn(r, i[s]);
            break;
        }
    } else
      (r.kind === o.SCHEMA_DEFINITION || r.kind === o.SCHEMA_EXTENSION) && (i[A] = mt(r, i[A], n));
  return i;
}
function ht(e, n) {
  H();
  const t = {
    kind: o.DOCUMENT,
    definitions: Nt(e, {
      useSchemaDefinition: !0,
      forceSchemaDefinition: !1,
      throwOnConflict: !1,
      commentDescriptions: !1,
      ...n
    })
  };
  let i;
  return n?.commentDescriptions ? i = wn(t) : i = t, H(), i;
}
function _(e, n, t = [], i = [], r = /* @__PURE__ */ new Set()) {
  if (e && !r.has(e))
    if (r.add(e), typeof e == "function")
      _(e(), n, t, i, r);
    else if (Array.isArray(e))
      for (const s of e)
        _(s, n, t, i, r);
    else if (Ge(e)) {
      const s = gn(e, n);
      _(s.definitions, n, t, i, r);
    } else if (Zn(e) || et(e)) {
      const s = fe(e, n);
      _(s.definitions, n, t, i, r);
    } else if (typeof e == "object" && Xe(e))
      e.kind === o.DIRECTIVE_DEFINITION ? t.push(e) : i.push(e);
    else if (Qn(e))
      _(e.definitions, n, t, i, r);
    else
      throw new Error(`typeDefs must contain only strings, documents, schemas, or functions, got ${typeof e}`);
  return { allDirectives: t, allNodes: i };
}
function Nt(e, n) {
  H();
  const { allDirectives: t, allNodes: i } = _(e, n), r = le(t, n), s = le(i, n, r);
  if (n?.useSchemaDefinition) {
    const u = s[A] || {
      kind: o.SCHEMA_DEFINITION,
      operationTypes: []
    }, c = u.operationTypes;
    for (const f in W)
      if (!c.find((p) => p.operation === f)) {
        const p = W[f], E = s[p];
        E != null && E.name != null && c.push({
          kind: o.OPERATION_TYPE_DEFINITION,
          type: {
            kind: o.NAMED_TYPE,
            name: E.name
          },
          operation: f
        });
      }
    u?.operationTypes?.length != null && u.operationTypes.length > 0 && (s[A] = u);
  }
  n?.forceSchemaDefinition && !s[A]?.operationTypes?.length && (s[A] = {
    kind: o.SCHEMA_DEFINITION,
    operationTypes: [
      {
        kind: o.OPERATION_TYPE_DEFINITION,
        operation: "query",
        type: {
          kind: o.NAMED_TYPE,
          name: {
            kind: o.NAME,
            value: "Query"
          }
        }
      }
    ]
  });
  const a = Object.values(s);
  if (n?.sort) {
    const u = typeof n.sort == "function" ? n.sort : nt;
    a.sort((c, f) => u(c.name?.value, f.name?.value));
  }
  return a;
}
const Ot = F`
  directive @auth(profileValidation: Boolean) on OBJECT | FIELD_DEFINITION
  directive @hasPermission(permission: String!) on OBJECT | FIELD_DEFINITION

  scalar DateTime
  scalar JSON

  input Filters {
    AND: [Filters]
    OR: [Filters]
    not: Boolean
    key: String
    operator: String
    value: String
  }

  enum SortDirection {
    ASC
    DESC
  }

  input SortInput {
    key: String
    direction: SortDirection
  }

  type DeleteResult {
    result: Boolean!
  }
`;
export {
  Ot as baseSchema,
  Dt as default,
  F as gql,
  ht as mergeTypeDefs
};

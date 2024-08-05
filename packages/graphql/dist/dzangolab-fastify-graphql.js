import ke from "fastify-plugin";
import he from "mercurius";
import { parse as ue, isNonNullType as ce, Kind as o, isListType as le, isInputObjectType as fe, isLeafType as _e, isEnumType as de, isSpecifiedDirective as Ae, isSpecifiedScalarType as Se, isIntrospectionType as Fe, isObjectType as be, isInterfaceType as Me, isUnionType as xe, isScalarType as Le, GraphQLDeprecatedDirective as Ce, visit as Ve, TokenKind as Pe, Source as Ue, isSchema as je, isDefinitionNode as Re } from "graphql";
const we = async (e, n) => {
  const t = e.config.graphql.plugins, i = {
    config: e.config,
    database: e.slonik,
    dbSchema: e.dbSchema
  };
  if (t)
    for (const r of t)
      await r.updateContext(i, e, n);
  return i;
}, Be = async (e) => {
  const n = e.config.graphql;
  n?.enabled ? await e.register(he, {
    context: we,
    ...n
  }) : e.log.info("GraphQL API not enabled");
}, ct = ke(Be);
var V = function() {
  return V = Object.assign || function(n) {
    for (var t, i = 1, r = arguments.length; i < r; i++) {
      t = arguments[i];
      for (var s in t)
        Object.prototype.hasOwnProperty.call(t, s) && (n[s] = t[s]);
    }
    return n;
  }, V.apply(this, arguments);
}, C = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), pe = !0, P = !1;
function me(e) {
  return e.replace(/[\s,]+/g, " ").trim();
}
function Ye(e) {
  return me(e.source.body.substring(e.start, e.end));
}
function $e(e) {
  var n = /* @__PURE__ */ new Set(), t = [];
  return e.definitions.forEach(function(i) {
    if (i.kind === "FragmentDefinition") {
      var r = i.name.value, s = Ye(i.loc), a = Y.get(r);
      a && !a.has(s) ? pe && console.warn("Warning: fragment with name " + r + ` already exists.
graphql-tag enforces all fragment names across your application to be unique; read more about
this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names`) : a || Y.set(r, a = /* @__PURE__ */ new Set()), a.add(s), n.has(s) || (n.add(s), t.push(i));
    } else
      t.push(i);
  }), V(V({}, e), { definitions: t });
}
function Je(e) {
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
function He(e) {
  var n = me(e);
  if (!C.has(n)) {
    var t = ue(e, {
      experimentalFragmentVariables: P,
      allowLegacyFragmentVariables: P
    });
    if (!t || t.kind !== "Document")
      throw new Error("Not a valid GraphQL document.");
    C.set(n, Je($e(t)));
  }
  return C.get(n);
}
function A(e) {
  for (var n = [], t = 1; t < arguments.length; t++)
    n[t - 1] = arguments[t];
  typeof e == "string" && (e = [e]);
  var i = e[0];
  return n.forEach(function(r, s) {
    r && r.kind === "Document" ? i += r.loc.source.body : i += r, i += e[s + 1];
  }), He(i);
}
function Qe() {
  C.clear(), Y.clear();
}
function Ge() {
  pe = !1;
}
function Xe() {
  P = !0;
}
function We() {
  P = !1;
}
var F = {
  gql: A,
  resetCaches: Qe,
  disableFragmentWarnings: Ge,
  enableExperimentalFragmentVariables: Xe,
  disableExperimentalFragmentVariables: We
};
(function(e) {
  e.gql = F.gql, e.resetCaches = F.resetCaches, e.disableFragmentWarnings = F.disableFragmentWarnings, e.enableExperimentalFragmentVariables = F.enableExperimentalFragmentVariables, e.disableExperimentalFragmentVariables = F.disableExperimentalFragmentVariables;
})(A || (A = {}));
A.default = A;
function qe(e, n) {
  return String(e) < String(n) ? -1 : String(e) > String(n) ? 1 : 0;
}
function K(e) {
  let n;
  return "alias" in e && (n = e.alias?.value), n == null && "name" in e && (n = e.name?.value), n == null && (n = e.kind), n;
}
function R(e, n, t) {
  const i = K(e), r = K(n);
  return typeof t == "function" ? t(i, r) : qe(i, r);
}
function G(e) {
  return e != null;
}
const Te = 3;
function Ee(e) {
  return w(e, []);
}
function w(e, n) {
  switch (typeof e) {
    case "string":
      return JSON.stringify(e);
    case "function":
      return e.name ? `[function ${e.name}]` : "[function]";
    case "object":
      return ze(e, n);
    default:
      return String(e);
  }
}
function Z(e) {
  return (e.name = "GraphQLError") ? e.toString() : `${e.name}: ${e.message};
 ${e.stack}`;
}
function ze(e, n) {
  if (e === null)
    return "null";
  if (e instanceof Error)
    return e.name === "AggregateError" ? Z(e) + `
` + ee(e.errors, n) : Z(e);
  if (n.includes(e))
    return "[Circular]";
  const t = [...n, e];
  if (Ke(e)) {
    const i = e.toJSON();
    if (i !== e)
      return typeof i == "string" ? i : w(i, t);
  } else if (Array.isArray(e))
    return ee(e, t);
  return Ze(e, t);
}
function Ke(e) {
  return typeof e.toJSON == "function";
}
function Ze(e, n) {
  const t = Object.entries(e);
  return t.length === 0 ? "{}" : n.length > Te ? "[" + en(e) + "]" : "{ " + t.map(([r, s]) => r + ": " + w(s, n)).join(", ") + " }";
}
function ee(e, n) {
  if (e.length === 0)
    return "[]";
  if (n.length > Te)
    return "[Array]";
  const t = e.length, i = [];
  for (let r = 0; r < t; ++r)
    i.push(w(e[r], n));
  return "[" + i.join(", ") + "]";
}
function en(e) {
  const n = Object.prototype.toString.call(e).replace(/^\[object /, "").replace(/]$/, "");
  if (n === "Object" && typeof e.constructor == "function") {
    const t = e.constructor.name;
    if (typeof t == "string" && t !== "")
      return t;
  }
  return n;
}
function nn(e) {
  return e != null && typeof e == "object" && Symbol.iterator in e;
}
function tn(e) {
  return typeof e == "object" && e !== null;
}
function X(e, n = ["directives"]) {
  return n.reduce((t, i) => t == null ? t : t[i], e?.extensions);
}
function v(e) {
  if (ce(e)) {
    const n = v(e.ofType);
    if (n.kind === o.NON_NULL_TYPE)
      throw new Error(`Invalid type node ${Ee(e)}. Inner type of non-null type cannot be a non-null type.`);
    return {
      kind: o.NON_NULL_TYPE,
      type: n
    };
  } else if (le(e))
    return {
      kind: o.LIST_TYPE,
      type: v(e.ofType)
    };
  return {
    kind: o.NAMED_TYPE,
    name: {
      kind: o.NAME,
      value: e.name
    }
  };
}
function M(e) {
  if (e === null)
    return { kind: o.NULL };
  if (e === void 0)
    return null;
  if (Array.isArray(e)) {
    const n = [];
    for (const t of e) {
      const i = M(t);
      i != null && n.push(i);
    }
    return { kind: o.LIST, values: n };
  }
  if (typeof e == "object") {
    if (e?.toJSON)
      return M(e.toJSON());
    const n = [];
    for (const t in e) {
      const i = e[t], r = M(i);
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
    return rn.test(n) ? { kind: o.INT, value: n } : { kind: o.FLOAT, value: n };
  }
  if (typeof e == "string")
    return { kind: o.STRING, value: e };
  throw new TypeError(`Cannot convert value to AST: ${e}.`);
}
const rn = /^-?(?:0|[1-9][0-9]*)$/;
function D(e, n) {
  if (ce(n)) {
    const t = D(e, n.ofType);
    return t?.kind === o.NULL ? null : t;
  }
  if (e === null)
    return { kind: o.NULL };
  if (e === void 0)
    return null;
  if (le(n)) {
    const t = n.ofType;
    if (nn(e)) {
      const i = [];
      for (const r of e) {
        const s = D(r, t);
        s != null && i.push(s);
      }
      return { kind: o.LIST, values: i };
    }
    return D(e, t);
  }
  if (fe(n)) {
    if (!tn(e))
      return null;
    const t = [];
    for (const i of Object.values(n.getFields())) {
      const r = D(e[i.name], i.type);
      r && t.push({
        kind: o.OBJECT_FIELD,
        name: { kind: o.NAME, value: i.name },
        value: r
      });
    }
    return { kind: o.OBJECT, fields: t };
  }
  if (_e(n)) {
    const t = n.serialize(e);
    return t == null ? null : de(n) ? { kind: o.ENUM, value: t } : n.name === "ID" && typeof t == "string" && sn.test(t) ? { kind: o.INT, value: t } : M(t);
  }
  console.assert(!1, "Unexpected input type: " + Ee(n));
}
const sn = /^-?(?:0|[1-9][0-9]*)$/;
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
function on(e) {
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
const an = on(function(n) {
  const t = /* @__PURE__ */ new Map(), i = n.getQueryType();
  i && t.set("query", i);
  const r = n.getMutationType();
  r && t.set("mutation", r);
  const s = n.getSubscriptionType();
  return s && t.set("subscription", s), t;
});
function un(e, n = {}) {
  const t = n.pathToDirectivesInExtensions, i = e.getTypeMap(), r = cn(e, t), s = r != null ? [r] : [], a = e.getDirectives();
  for (const c of a)
    Ae(c) || s.push(ln(c, e, t));
  for (const c in i) {
    const l = i[c], f = Se(l), p = Fe(l);
    if (!(f || p))
      if (be(l))
        s.push(fn(l, e, t));
      else if (Me(l))
        s.push(dn(l, e, t));
      else if (xe(l))
        s.push(pn(l, e, t));
      else if (fe(l))
        s.push(mn(l, e, t));
      else if (de(l))
        s.push(Tn(l, e, t));
      else if (Le(l))
        s.push(En(l, e, t));
      else
        throw new Error(`Unknown type ${l}.`);
  }
  return {
    kind: o.DOCUMENT,
    definitions: s
  };
}
function cn(e, n) {
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
      for (const p of f.operationTypes)
        t.set(p.operation, p);
  const r = an(e);
  for (const [f, p] of t) {
    const m = r.get(f);
    if (m != null) {
      const O = v(m);
      p != null ? p.type = O : t.set(f, {
        kind: o.OPERATION_TYPE_DEFINITION,
        operation: f,
        type: O
      });
    }
  }
  const s = [...t.values()].filter(G), a = S(e, e, n);
  if (!s.length && !a.length)
    return null;
  const c = {
    kind: s != null ? o.SCHEMA_DEFINITION : o.SCHEMA_EXTENSION,
    operationTypes: s,
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: a
  }, l = T(e);
  return l && (c.description = l), c;
}
function ln(e, n, t) {
  return {
    kind: o.DIRECTIVE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    arguments: e.args?.map((i) => Ne(i, n, t)),
    repeatable: e.isRepeatable,
    locations: e.locations?.map((i) => ({
      kind: o.NAME,
      value: i
    })) || []
  };
}
function S(e, n, t) {
  const i = X(e, t);
  let r = [];
  e.astNode != null && r.push(e.astNode), "extensionASTNodes" in e && e.extensionASTNodes != null && (r = r.concat(e.extensionASTNodes));
  let s;
  if (i != null)
    s = W(n, i);
  else {
    s = [];
    for (const a of r)
      a.directives && s.push(...a.directives);
  }
  return s;
}
function B(e, n, t) {
  let i = [], r = null;
  const s = X(e, t);
  let a;
  return s != null ? a = W(n, s) : a = e.astNode?.directives, a != null && (i = a.filter((c) => c.name.value !== "deprecated"), e.deprecationReason != null && (r = a.filter((c) => c.name.value === "deprecated")?.[0])), e.deprecationReason != null && r == null && (r = In(e.deprecationReason)), r == null ? i : [r].concat(i);
}
function Ne(e, n, t) {
  return {
    kind: o.INPUT_VALUE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    type: v(e.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    defaultValue: e.defaultValue !== void 0 ? D(e.defaultValue, e.type) ?? void 0 : void 0,
    directives: B(e, n, t)
  };
}
function fn(e, n, t) {
  return {
    kind: o.OBJECT_TYPE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    fields: Object.values(e.getFields()).map((i) => ve(i, n, t)),
    interfaces: Object.values(e.getInterfaces()).map((i) => v(i)),
    directives: S(e, n, t)
  };
}
function dn(e, n, t) {
  const i = {
    kind: o.INTERFACE_TYPE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    fields: Object.values(e.getFields()).map((r) => ve(r, n, t)),
    directives: S(e, n, t)
  };
  return "getInterfaces" in e && (i.interfaces = Object.values(e.getInterfaces()).map((r) => v(r))), i;
}
function pn(e, n, t) {
  return {
    kind: o.UNION_TYPE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: S(e, n, t),
    types: e.getTypes().map((i) => v(i))
  };
}
function mn(e, n, t) {
  return {
    kind: o.INPUT_OBJECT_TYPE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    fields: Object.values(e.getFields()).map((i) => Nn(i, n, t)),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: S(e, n, t)
  };
}
function Tn(e, n, t) {
  return {
    kind: o.ENUM_TYPE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    values: Object.values(e.getValues()).map((i) => vn(i, n, t)),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: S(e, n, t)
  };
}
function En(e, n, t) {
  const i = X(e, t), r = i ? W(n, i) : e.astNode?.directives || [], s = e.specifiedByUrl || e.specifiedByURL;
  if (s && !r.some((a) => a.name.value === "specifiedBy")) {
    const a = {
      url: s
    };
    r.push(U("specifiedBy", a));
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
function ve(e, n, t) {
  return {
    kind: o.FIELD_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    arguments: e.args.map((i) => Ne(i, n, t)),
    type: v(e.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: B(e, n, t)
  };
}
function Nn(e, n, t) {
  return {
    kind: o.INPUT_VALUE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    type: v(e.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: B(e, n, t),
    defaultValue: D(e.defaultValue, e.type) ?? void 0
  };
}
function vn(e, n, t) {
  return {
    kind: o.ENUM_VALUE_DEFINITION,
    description: T(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: B(e, n, t)
  };
}
function In(e) {
  return U("deprecated", { reason: e }, Ce);
}
function U(e, n, t) {
  const i = [];
  if (t != null)
    for (const r of t.args) {
      const s = r.name, a = n[s];
      if (a !== void 0) {
        const c = D(a, r.type);
        c && i.push({
          kind: o.ARGUMENT,
          name: {
            kind: o.NAME,
            value: s
          },
          value: c
        });
      }
    }
  else
    for (const r in n) {
      const s = n[r], a = M(s);
      a && i.push({
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
function W(e, n) {
  const t = [];
  for (const i in n) {
    const r = n[i], s = e?.getDirective(i);
    if (Array.isArray(r))
      for (const a of r)
        t.push(U(i, a, s));
    else
      t.push(U(i, r, s));
  }
  return t;
}
const yn = 80;
let _ = {};
function $() {
  _ = {};
}
function Dn(e) {
  const n = e.name?.value;
  if (n != null)
    switch (L(e, n), e.kind) {
      case "EnumTypeDefinition":
        if (e.values)
          for (const t of e.values)
            L(t, n, t.name.value);
        break;
      case "ObjectTypeDefinition":
      case "InputObjectTypeDefinition":
      case "InterfaceTypeDefinition":
        if (e.fields) {
          for (const t of e.fields)
            if (L(t, n, t.name.value), An(t) && t.arguments)
              for (const i of t.arguments)
                L(i, n, t.name.value, i.name.value);
        }
        break;
    }
}
function L(e, n, t, i) {
  const r = Sn(e);
  if (typeof r != "string" || r.length === 0)
    return;
  const s = [n];
  t && (s.push(t), i && s.push(i));
  const a = s.join(".");
  _[a] || (_[a] = []), _[a].push(r);
}
function gn(e) {
  return `
# ` + e.replace(/\n/g, `
# `);
}
function u(e, n) {
  return e ? e.filter((t) => t).join(n || "") : "";
}
function ne(e) {
  return e?.some((n) => n.includes(`
`)) ?? !1;
}
function On(e) {
  return (n, t, i, r, s) => {
    const a = [], c = r.reduce((p, m) => (["fields", "arguments", "values"].includes(m) && p.name && a.push(p.name.value), p[m]), s[0]), l = [...a, c?.name?.value].filter(Boolean).join("."), f = [];
    return n.kind.includes("Definition") && _[l] && f.push(..._[l]), u([...f.map(gn), n.description, e(n, t, i, r, s)], `
`);
  };
}
function x(e) {
  return e && `  ${e.replace(/\n/g, `
  `)}`;
}
function E(e) {
  return e && e.length !== 0 ? `{
${x(u(e, `
`))}
}` : "";
}
function d(e, n, t) {
  return n ? e + n + (t || "") : "";
}
function kn(e, n = !1) {
  const t = e.replace(/"""/g, '\\"""');
  return (e[0] === " " || e[0] === "	") && e.indexOf(`
`) === -1 ? `"""${t.replace(/"$/, `"
`)}"""` : `"""
${n ? t : x(t)}
"""`;
}
const te = {
  Name: { leave: (e) => e.value },
  Variable: { leave: (e) => "$" + e.name },
  // Document
  Document: {
    leave: (e) => u(e.definitions, `

`)
  },
  OperationDefinition: {
    leave: (e) => {
      const n = d("(", u(e.variableDefinitions, ", "), ")");
      return u([e.operation, u([e.name, n]), u(e.directives, " ")], " ") + " " + e.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable: e, type: n, defaultValue: t, directives: i }) => e + ": " + n + d(" = ", t) + d(" ", u(i, " "))
  },
  SelectionSet: { leave: ({ selections: e }) => E(e) },
  Field: {
    leave({ alias: e, name: n, arguments: t, directives: i, selectionSet: r }) {
      const s = d("", e, ": ") + n;
      let a = s + d("(", u(t, ", "), ")");
      return a.length > yn && (a = s + d(`(
`, x(u(t, `
`)), `
)`)), u([a, u(i, " "), r], " ");
    }
  },
  Argument: { leave: ({ name: e, value: n }) => e + ": " + n },
  // Fragments
  FragmentSpread: {
    leave: ({ name: e, directives: n }) => "..." + e + d(" ", u(n, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition: e, directives: n, selectionSet: t }) => u(["...", d("on ", e), u(n, " "), t], " ")
  },
  FragmentDefinition: {
    leave: ({ name: e, typeCondition: n, variableDefinitions: t, directives: i, selectionSet: r }) => (
      // Note: fragment variable definitions are experimental and may be changed
      // or removed in the future.
      `fragment ${e}${d("(", u(t, ", "), ")")} on ${n} ${d("", u(i, " "), " ")}` + r
    )
  },
  // Value
  IntValue: { leave: ({ value: e }) => e },
  FloatValue: { leave: ({ value: e }) => e },
  StringValue: {
    leave: ({ value: e, block: n }) => n ? kn(e) : JSON.stringify(e)
  },
  BooleanValue: { leave: ({ value: e }) => e ? "true" : "false" },
  NullValue: { leave: () => "null" },
  EnumValue: { leave: ({ value: e }) => e },
  ListValue: { leave: ({ values: e }) => "[" + u(e, ", ") + "]" },
  ObjectValue: { leave: ({ fields: e }) => "{" + u(e, ", ") + "}" },
  ObjectField: { leave: ({ name: e, value: n }) => e + ": " + n },
  // Directive
  Directive: {
    leave: ({ name: e, arguments: n }) => "@" + e + d("(", u(n, ", "), ")")
  },
  // Type
  NamedType: { leave: ({ name: e }) => e },
  ListType: { leave: ({ type: e }) => "[" + e + "]" },
  NonNullType: { leave: ({ type: e }) => e + "!" },
  // Type System Definitions
  SchemaDefinition: {
    leave: ({ directives: e, operationTypes: n }) => u(["schema", u(e, " "), E(n)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation: e, type: n }) => e + ": " + n
  },
  ScalarTypeDefinition: {
    leave: ({ name: e, directives: n }) => u(["scalar", e, u(n, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ name: e, interfaces: n, directives: t, fields: i }) => u([
      "type",
      e,
      d("implements ", u(n, " & ")),
      u(t, " "),
      E(i)
    ], " ")
  },
  FieldDefinition: {
    leave: ({ name: e, arguments: n, type: t, directives: i }) => e + (ne(n) ? d(`(
`, x(u(n, `
`)), `
)`) : d("(", u(n, ", "), ")")) + ": " + t + d(" ", u(i, " "))
  },
  InputValueDefinition: {
    leave: ({ name: e, type: n, defaultValue: t, directives: i }) => u([e + ": " + n, d("= ", t), u(i, " ")], " ")
  },
  InterfaceTypeDefinition: {
    leave: ({ name: e, interfaces: n, directives: t, fields: i }) => u([
      "interface",
      e,
      d("implements ", u(n, " & ")),
      u(t, " "),
      E(i)
    ], " ")
  },
  UnionTypeDefinition: {
    leave: ({ name: e, directives: n, types: t }) => u(["union", e, u(n, " "), d("= ", u(t, " | "))], " ")
  },
  EnumTypeDefinition: {
    leave: ({ name: e, directives: n, values: t }) => u(["enum", e, u(n, " "), E(t)], " ")
  },
  EnumValueDefinition: {
    leave: ({ name: e, directives: n }) => u([e, u(n, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ name: e, directives: n, fields: t }) => u(["input", e, u(n, " "), E(t)], " ")
  },
  DirectiveDefinition: {
    leave: ({ name: e, arguments: n, repeatable: t, locations: i }) => "directive @" + e + (ne(n) ? d(`(
`, x(u(n, `
`)), `
)`) : d("(", u(n, ", "), ")")) + (t ? " repeatable" : "") + " on " + u(i, " | ")
  },
  SchemaExtension: {
    leave: ({ directives: e, operationTypes: n }) => u(["extend schema", u(e, " "), E(n)], " ")
  },
  ScalarTypeExtension: {
    leave: ({ name: e, directives: n }) => u(["extend scalar", e, u(n, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name: e, interfaces: n, directives: t, fields: i }) => u([
      "extend type",
      e,
      d("implements ", u(n, " & ")),
      u(t, " "),
      E(i)
    ], " ")
  },
  InterfaceTypeExtension: {
    leave: ({ name: e, interfaces: n, directives: t, fields: i }) => u([
      "extend interface",
      e,
      d("implements ", u(n, " & ")),
      u(t, " "),
      E(i)
    ], " ")
  },
  UnionTypeExtension: {
    leave: ({ name: e, directives: n, types: t }) => u(["extend union", e, u(n, " "), d("= ", u(t, " | "))], " ")
  },
  EnumTypeExtension: {
    leave: ({ name: e, directives: n, values: t }) => u(["extend enum", e, u(n, " "), E(t)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name: e, directives: n, fields: t }) => u(["extend input", e, u(n, " "), E(t)], " ")
  }
}, hn = Object.keys(te).reduce((e, n) => ({
  ...e,
  [n]: {
    leave: On(te[n].leave)
  }
}), {});
function _n(e) {
  return Ve(e, hn);
}
function An(e) {
  return e.kind === "FieldDefinition";
}
function Sn(e) {
  const n = Fn(e);
  if (n !== void 0)
    return bn(`
${n}`);
}
function Fn(e) {
  const n = e.loc;
  if (!n)
    return;
  const t = [];
  let i = n.startToken.prev;
  for (; i != null && i.kind === Pe.COMMENT && i.next != null && i.prev != null && i.line + 1 === i.next.line && i.line !== i.prev.line; ) {
    const r = String(i.value);
    t.push(r), i = i.prev;
  }
  return t.length > 0 ? t.reverse().join(`
`) : void 0;
}
function bn(e) {
  const n = e.split(/\r\n|[\n\r]/g), t = Mn(n);
  if (t !== 0)
    for (let i = 1; i < n.length; i++)
      n[i] = n[i].slice(t);
  for (; n.length > 0 && ie(n[0]); )
    n.shift();
  for (; n.length > 0 && ie(n[n.length - 1]); )
    n.pop();
  return n.join(`
`);
}
function Mn(e) {
  let n = null;
  for (let t = 1; t < e.length; t++) {
    const i = e[t], r = Ie(i);
    if (r !== i.length && (n === null || r < n) && (n = r, n === 0))
      break;
  }
  return n === null ? 0 : n;
}
function Ie(e) {
  let n = 0;
  for (; n < e.length && (e[n] === " " || e[n] === "	"); )
    n++;
  return n;
}
function ie(e) {
  return Ie(e) === e.length;
}
function xn(e) {
  return e && typeof e == "object" && "kind" in e && e.kind === o.DOCUMENT;
}
function Ln(e, n, t) {
  const i = Cn([...n, ...e].filter(G), t);
  return t && t.sort && i.sort(R), i;
}
function Cn(e, n) {
  return e.reduce((t, i) => {
    const r = t.findIndex((s) => s.name.value === i.name.value);
    return r === -1 ? t.concat([i]) : (n?.reverseArguments || (t[r] = i), t);
  }, []);
}
function Vn(e, n) {
  return !!e.find((t) => t.name.value === n.name.value);
}
function ye(e, n) {
  return !!n?.[e.name.value]?.repeatable;
}
function re(e, n) {
  return n.some(({ value: t }) => t === e.value);
}
function De(e, n) {
  const t = [...n];
  for (const i of e) {
    const r = t.findIndex((s) => s.name.value === i.name.value);
    if (r > -1) {
      const s = t[r];
      if (s.value.kind === "ListValue") {
        const a = s.value.values, c = i.value.values;
        s.value.values = ge(a, c, (l, f) => {
          const p = l.value;
          return !p || !f.some((m) => m.value === p);
        });
      } else
        s.value = i.value;
    } else
      t.push(i);
  }
  return t;
}
function Pn(e, n) {
  return e.map((t, i, r) => {
    const s = r.findIndex((a) => a.name.value === t.name.value);
    if (s !== i && !ye(t, n)) {
      const a = r[s];
      return t.arguments = De(t.arguments, a.arguments), null;
    }
    return t;
  }).filter(G);
}
function I(e = [], n = [], t, i) {
  const r = t && t.reverseDirectives, s = r ? e : n, a = r ? n : e, c = Pn([...s], i);
  for (const l of a)
    if (Vn(c, l) && !ye(l, i)) {
      const f = c.findIndex((m) => m.name.value === l.name.value), p = c[f];
      c[f].arguments = De(l.arguments || [], p.arguments || []);
    } else
      c.push(l);
  return c;
}
function Un(e, n) {
  return n ? {
    ...e,
    arguments: ge(n.arguments || [], e.arguments || [], (t, i) => !re(t.name, i.map((r) => r.name))),
    locations: [
      ...n.locations,
      ...e.locations.filter((t) => !re(t, n.locations))
    ]
  } : e;
}
function ge(e, n, t) {
  return e.concat(n.filter((i) => t(i, e)));
}
function jn(e, n, t, i) {
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
      const c = a.name.value;
      if (r.has(c)) {
        const l = r.get(c);
        l.description = a.description || l.description, l.directives = I(a.directives, l.directives, i);
      } else
        r.set(c, a);
    }
  const s = [...r.values()];
  return t && t.sort && s.sort(R), s;
}
function Rn(e, n, t, i) {
  return n ? {
    name: e.name,
    description: e.description || n.description,
    kind: t?.convertExtensions || e.kind === "EnumTypeDefinition" || n.kind === "EnumTypeDefinition" ? "EnumTypeDefinition" : "EnumTypeExtension",
    loc: e.loc,
    directives: I(e.directives, n.directives, t, i),
    values: jn(e.values, n.values, t)
  } : t?.convertExtensions ? {
    ...e,
    kind: o.ENUM_TYPE_DEFINITION
  } : e;
}
function wn(e) {
  return typeof e == "string";
}
function Bn(e) {
  return e instanceof Ue;
}
function se(e) {
  let n = e;
  for (; n.kind === o.LIST_TYPE || n.kind === "NonNullType"; )
    n = n.type;
  return n;
}
function oe(e) {
  return e.kind !== o.NAMED_TYPE;
}
function J(e) {
  return e.kind === o.LIST_TYPE;
}
function g(e) {
  return e.kind === o.NON_NULL_TYPE;
}
function j(e) {
  return J(e) ? `[${j(e.type)}]` : g(e) ? `${j(e.type)}!` : e.name.value;
}
var y;
(function(e) {
  e[e.A_SMALLER_THAN_B = -1] = "A_SMALLER_THAN_B", e[e.A_EQUALS_B = 0] = "A_EQUALS_B", e[e.A_GREATER_THAN_B = 1] = "A_GREATER_THAN_B";
})(y || (y = {}));
function Yn(e, n) {
  return e == null && n == null ? y.A_EQUALS_B : e == null ? y.A_SMALLER_THAN_B : n == null ? y.A_GREATER_THAN_B : e < n ? y.A_SMALLER_THAN_B : e > n ? y.A_GREATER_THAN_B : y.A_EQUALS_B;
}
function $n(e, n) {
  const t = e.findIndex((i) => i.name.value === n.name.value);
  return [t > -1 ? e[t] : null, t];
}
function q(e, n, t, i, r) {
  const s = [];
  if (t != null && s.push(...t), n != null)
    for (const a of n) {
      const [c, l] = $n(s, a);
      if (c && !i?.ignoreFieldConflicts) {
        const f = i?.onFieldTypeConflict && i.onFieldTypeConflict(c, a, e, i?.throwOnConflict) || Jn(e, c, a, i?.throwOnConflict);
        f.arguments = Ln(a.arguments || [], c.arguments || [], i), f.directives = I(a.directives, c.directives, i, r), f.description = a.description || c.description, s[l] = f;
      } else
        s.push(a);
    }
  if (i && i.sort && s.sort(R), i && i.exclusions) {
    const a = i.exclusions;
    return s.filter((c) => !a.includes(`${e.name.value}.${c.name.value}`));
  }
  return s;
}
function Jn(e, n, t, i = !1) {
  const r = j(n.type), s = j(t.type);
  if (r !== s) {
    const a = se(n.type), c = se(t.type);
    if (a.name.value !== c.name.value)
      throw new Error(`Field "${t.name.value}" already defined with a different type. Declared as "${a.name.value}", but you tried to override with "${c.name.value}"`);
    if (!b(n.type, t.type, !i))
      throw new Error(`Field '${e.name.value}.${n.name.value}' changed type from '${r}' to '${s}'`);
  }
  return g(t.type) && !g(n.type) && (n.type = t.type), n;
}
function b(e, n, t = !1) {
  if (!oe(e) && !oe(n))
    return e.toString() === n.toString();
  if (g(n)) {
    const i = g(e) ? e.type : e;
    return b(i, n.type);
  }
  return g(e) ? b(n, e, t) : J(e) ? J(n) && b(e.type, n.type) || g(n) && b(e, n.type) : !1;
}
function Hn(e, n, t, i) {
  if (n)
    try {
      return {
        name: e.name,
        description: e.description || n.description,
        kind: t?.convertExtensions || e.kind === "InputObjectTypeDefinition" || n.kind === "InputObjectTypeDefinition" ? "InputObjectTypeDefinition" : "InputObjectTypeExtension",
        loc: e.loc,
        fields: q(e, e.fields, n.fields, t),
        directives: I(e.directives, n.directives, t, i)
      };
    } catch (r) {
      throw new Error(`Unable to merge GraphQL input type "${e.name.value}": ${r.message}`);
    }
  return t?.convertExtensions ? {
    ...e,
    kind: o.INPUT_OBJECT_TYPE_DEFINITION
  } : e;
}
function Qn(e, n) {
  return !!e.find((t) => t.name.value === n.name.value);
}
function z(e = [], n = [], t = {}) {
  const i = [...n, ...e.filter((r) => !Qn(n, r))];
  return t && t.sort && i.sort(R), i;
}
function Gn(e, n, t, i) {
  if (n)
    try {
      return {
        name: e.name,
        description: e.description || n.description,
        kind: t?.convertExtensions || e.kind === "InterfaceTypeDefinition" || n.kind === "InterfaceTypeDefinition" ? "InterfaceTypeDefinition" : "InterfaceTypeExtension",
        loc: e.loc,
        fields: q(e, e.fields, n.fields, t),
        directives: I(e.directives, n.directives, t, i),
        interfaces: e.interfaces ? z(e.interfaces, n.interfaces, t) : void 0
      };
    } catch (r) {
      throw new Error(`Unable to merge GraphQL interface "${e.name.value}": ${r.message}`);
    }
  return t?.convertExtensions ? {
    ...e,
    kind: o.INTERFACE_TYPE_DEFINITION
  } : e;
}
var N = {};
Object.defineProperty(N, "__esModule", {
  value: !0
});
N.Token = N.QueryDocumentKeys = N.OperationTypeNode = N.Location = void 0;
var Xn = N.isNode = Kn;
class Wn {
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
N.Location = Wn;
class qn {
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
N.Token = qn;
const Oe = {
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
N.QueryDocumentKeys = Oe;
const zn = new Set(Object.keys(Oe));
function Kn(e) {
  const n = e?.kind;
  return typeof n == "string" && zn.has(n);
}
var H;
N.OperationTypeNode = H;
(function(e) {
  e.QUERY = "query", e.MUTATION = "mutation", e.SUBSCRIPTION = "subscription";
})(H || (N.OperationTypeNode = H = {}));
function Zn(e, n, t, i) {
  return n ? {
    name: e.name,
    description: e.description || n.description,
    kind: t?.convertExtensions || e.kind === "ScalarTypeDefinition" || n.kind === "ScalarTypeDefinition" ? "ScalarTypeDefinition" : "ScalarTypeExtension",
    loc: e.loc,
    directives: I(e.directives, n.directives, t, i)
  } : t?.convertExtensions ? {
    ...e,
    kind: o.SCALAR_TYPE_DEFINITION
  } : e;
}
const Q = {
  query: "Query",
  mutation: "Mutation",
  subscription: "Subscription"
};
function et(e = [], n = []) {
  const t = [];
  for (const i in Q) {
    const r = e.find((s) => s.operation === i) || n.find((s) => s.operation === i);
    r && t.push(r);
  }
  return t;
}
function nt(e, n, t, i) {
  return n ? {
    kind: e.kind === o.SCHEMA_DEFINITION || n.kind === o.SCHEMA_DEFINITION ? o.SCHEMA_DEFINITION : o.SCHEMA_EXTENSION,
    description: e.description || n.description,
    directives: I(e.directives, n.directives, t, i),
    operationTypes: et(e.operationTypes, n.operationTypes)
  } : t?.convertExtensions ? {
    ...e,
    kind: o.SCHEMA_DEFINITION
  } : e;
}
function tt(e, n, t, i) {
  if (n)
    try {
      return {
        name: e.name,
        description: e.description || n.description,
        kind: t?.convertExtensions || e.kind === "ObjectTypeDefinition" || n.kind === "ObjectTypeDefinition" ? "ObjectTypeDefinition" : "ObjectTypeExtension",
        loc: e.loc,
        fields: q(e, e.fields, n.fields, t),
        directives: I(e.directives, n.directives, t, i),
        interfaces: z(e.interfaces, n.interfaces, t)
      };
    } catch (r) {
      throw new Error(`Unable to merge GraphQL type "${e.name.value}": ${r.message}`);
    }
  return t?.convertExtensions ? {
    ...e,
    kind: o.OBJECT_TYPE_DEFINITION
  } : e;
}
function it(e, n, t, i) {
  return n ? {
    name: e.name,
    description: e.description || n.description,
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: I(e.directives, n.directives, t, i),
    kind: t?.convertExtensions || e.kind === "UnionTypeDefinition" || n.kind === "UnionTypeDefinition" ? o.UNION_TYPE_DEFINITION : o.UNION_TYPE_EXTENSION,
    loc: e.loc,
    types: z(e.types, n.types, t)
  } : t?.convertExtensions ? {
    ...e,
    kind: o.UNION_TYPE_DEFINITION
  } : e;
}
const h = "SCHEMA_DEF_SYMBOL";
function rt(e) {
  return "name" in e;
}
function ae(e, n, t = {}) {
  const i = t;
  for (const r of e)
    if (rt(r)) {
      const s = r.name?.value;
      if (n?.commentDescriptions && Dn(r), s == null)
        continue;
      if (n?.exclusions?.includes(s + ".*") || n?.exclusions?.includes(s))
        delete i[s];
      else
        switch (r.kind) {
          case o.OBJECT_TYPE_DEFINITION:
          case o.OBJECT_TYPE_EXTENSION:
            i[s] = tt(r, i[s], n, t);
            break;
          case o.ENUM_TYPE_DEFINITION:
          case o.ENUM_TYPE_EXTENSION:
            i[s] = Rn(r, i[s], n, t);
            break;
          case o.UNION_TYPE_DEFINITION:
          case o.UNION_TYPE_EXTENSION:
            i[s] = it(r, i[s], n, t);
            break;
          case o.SCALAR_TYPE_DEFINITION:
          case o.SCALAR_TYPE_EXTENSION:
            i[s] = Zn(r, i[s], n, t);
            break;
          case o.INPUT_OBJECT_TYPE_DEFINITION:
          case o.INPUT_OBJECT_TYPE_EXTENSION:
            i[s] = Hn(r, i[s], n, t);
            break;
          case o.INTERFACE_TYPE_DEFINITION:
          case o.INTERFACE_TYPE_EXTENSION:
            i[s] = Gn(r, i[s], n, t);
            break;
          case o.DIRECTIVE_DEFINITION:
            i[s] && s in {} && (Xn(i[s]) || (i[s] = void 0)), i[s] = Un(r, i[s]);
            break;
        }
    } else
      (r.kind === o.SCHEMA_DEFINITION || r.kind === o.SCHEMA_EXTENSION) && (i[h] = nt(r, i[h], n));
  return i;
}
function lt(e, n) {
  $();
  const t = {
    kind: o.DOCUMENT,
    definitions: st(e, {
      useSchemaDefinition: !0,
      forceSchemaDefinition: !1,
      throwOnConflict: !1,
      commentDescriptions: !1,
      ...n
    })
  };
  let i;
  return n?.commentDescriptions ? i = _n(t) : i = t, $(), i;
}
function k(e, n, t = [], i = [], r = /* @__PURE__ */ new Set()) {
  if (e && !r.has(e))
    if (r.add(e), typeof e == "function")
      k(e(), n, t, i, r);
    else if (Array.isArray(e))
      for (const s of e)
        k(s, n, t, i, r);
    else if (je(e)) {
      const s = un(e, n);
      k(s.definitions, n, t, i, r);
    } else if (wn(e) || Bn(e)) {
      const s = ue(e, n);
      k(s.definitions, n, t, i, r);
    } else if (typeof e == "object" && Re(e))
      e.kind === o.DIRECTIVE_DEFINITION ? t.push(e) : i.push(e);
    else if (xn(e))
      k(e.definitions, n, t, i, r);
    else
      throw new Error(`typeDefs must contain only strings, documents, schemas, or functions, got ${typeof e}`);
  return { allDirectives: t, allNodes: i };
}
function st(e, n) {
  $();
  const { allDirectives: t, allNodes: i } = k(e, n), r = ae(t, n), s = ae(i, n, r);
  if (n?.useSchemaDefinition) {
    const c = s[h] || {
      kind: o.SCHEMA_DEFINITION,
      operationTypes: []
    }, l = c.operationTypes;
    for (const f in Q)
      if (!l.find((m) => m.operation === f)) {
        const m = Q[f], O = s[m];
        O != null && O.name != null && l.push({
          kind: o.OPERATION_TYPE_DEFINITION,
          type: {
            kind: o.NAMED_TYPE,
            name: O.name
          },
          operation: f
        });
      }
    c?.operationTypes?.length != null && c.operationTypes.length > 0 && (s[h] = c);
  }
  n?.forceSchemaDefinition && !s[h]?.operationTypes?.length && (s[h] = {
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
    const c = typeof n.sort == "function" ? n.sort : Yn;
    a.sort((l, f) => c(l.name?.value, f.name?.value));
  }
  return a;
}
const ft = A`
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
  ft as baseSchema,
  ct as default,
  A as gql,
  lt as mergeTypeDefs
};

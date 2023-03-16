import i from "fastify-plugin";
const p = async (o, n, e) => {
  const t = n.config;
  o.decorate("config", t), o.addHook("onRequest", async (a) => {
    a.config = t;
  });
  const { baseUrl: r, port: s } = t, c = `${r}:${s}`;
  o.decorate("hostname", c), e();
}, d = i(p), g = (o, n) => {
  if (o === void 0)
    return n;
  switch (typeof n) {
    case "boolean":
      return !!JSON.parse(o);
    case "number":
      return JSON.parse(o);
    default:
      return o;
  }
};
export {
  d as default,
  g as parse
};

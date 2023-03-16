import s from "fastify-plugin";
import e from "mercurius";
const r = async (n, o) => {
  const i = n.config.mercurius.plugins, t = {
    config: n.config,
    database: n.slonik
  };
  if (i)
    for (const c of i)
      await c.updateContext(t, n, o);
  return t;
}, g = async (n) => {
  const o = n.config.mercurius;
  o?.enabled ? n.register(e, {
    context: r,
    ...o
  }) : n.log.info("GraphQL API not enabled");
}, a = s(g);
export {
  a as default
};

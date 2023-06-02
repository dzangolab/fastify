import a from "fastify-plugin";
import e from "mercurius";
const s = async (n, o) => {
  const i = n.config.mercurius.plugins, c = {
    config: n.config,
    database: n.slonik,
    dbSchema: n.dbSchema
  };
  if (i)
    for (const t of i)
      await t.updateContext(c, n, o);
  return c;
}, g = async (n) => {
  const o = n.config.mercurius;
  o?.enabled ? await n.register(e, {
    context: s,
    ...o
  }) : n.log.info("GraphQL API not enabled");
}, u = a(g);
export {
  u as default
};

import "@dzangolab/fastify-mercurius";
import p from "fastify-plugin";
import { createTableFragment as l, createWhereIdFragment as y, createLimitFragment as d } from "@dzangolab/fastify-slonik";
const u = "users", c = (t, n, e) => ({
  findById: async (s) => {
    const r = e`
        SELECT *
        FROM ${l(u)}
        ${y(s)}
      `;
    return await n.connect((a) => a.maybeOne(r));
  },
  list: async (s = t.pagination.default_limit, r) => {
    const i = e`
        SELECT *
        FROM ${l(u)}
        ORDER BY id ASC
        ${d(
      Math.min(
        s ?? t.pagination.default_limit,
        t?.pagination.max_limit
      ),
      r
    )};
      `;
    return await n.connect((o) => o.any(i));
  }
}), f = async (t, n, e) => {
  t.get(
    "/users",
    {
      preHandler: t.verifySession()
    },
    async (s, r) => {
      const i = c(s.config, s.slonik, s.sql), { limit: a, offset: o } = s.query, m = await i.list(a, o);
      r.send(m);
    }
  ), e();
}, g = (t, n, e) => {
  t.register(f), e();
}, w = p(g), v = {
  user: async (t, n, e) => await c(e.config, e.database, e.sql).findById(n.id),
  users: async (t, n, e) => await c(e.config, e.database, e.sql).list(n.limit, n.offset)
}, E = { Query: v };
export {
  w as default,
  E as userResolver,
  c as userService
};

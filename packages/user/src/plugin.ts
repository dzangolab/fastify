import FastifyPlugin from "fastify-plugin";

import mercuriusAuthPlugin from "./mercurius-auth/plugin";
import hasPermission from "./middlewares/hasPermission";
import supertokensPlugin from "./supertokens";
import userContext from "./userContext";

import type { MercuriusEnabledPlugin } from "@dzangolab/fastify-mercurius";
import type { FastifyInstance } from "fastify";

const plugin = FastifyPlugin(
  async (
    fastify: FastifyInstance,
    options: Record<never, never>,
    done: () => void
  ) => {
    const { mercurius } = fastify.config;

    await fastify.register(supertokensPlugin);

    fastify.decorate("hasPermission", hasPermission);

    if (mercurius.enabled) {
      await fastify.register(mercuriusAuthPlugin);
    }

    // [RL 2024-06-11] change sRefreshToken cookie path to /
    // so that refresh token will include in the cookie
    // even if the refresh token route is different than the cookie path
    fastify.addHook("onSend", async (request, reply) => {
      const setCookieHeader = reply.getHeader("set-cookie");

      if (setCookieHeader) {
        const cookies = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];

        const updatedCookies = cookies.map((cookie) => {
          if (String(cookie).startsWith("sRefreshToken")) {
            // eslint-disable-next-line unicorn/better-regex
            return String(cookie).replace(/Path=\/[^;]*/i, "Path=/");
          }

          return cookie;
        });

        reply.removeHeader("set-cookie");
        reply.header("set-cookie", updatedCookies);
      }
    });

    done();
  }
) as MercuriusEnabledPlugin;

plugin.updateContext = userContext;

export default plugin;

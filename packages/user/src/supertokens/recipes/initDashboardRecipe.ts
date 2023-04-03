import Dashboard from "supertokens-node/recipe/dashboard";

import type { FastifyInstance } from "fastify";

const init = (fastify: FastifyInstance) => {
  return Dashboard.init({ apiKey: fastify.config.dashboard?.apiKey || "" });
};

export default init;

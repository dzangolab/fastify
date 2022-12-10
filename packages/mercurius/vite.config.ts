import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    build: {
      lib: {
        entry: resolve(dirname(fileURLToPath(import.meta.url)), "src/index.ts"),
        fileName: "dzangolab-fastify-mercurius",
        name: "DzangolabFastifyMercurius",
      },
      rollupOptions: {
        external: [
          "@dzangolab/fastify-config",
          "@dzangolab/fastify-slonik",
          "fastify",
          "fastify-plugin",
          "graphql",
        ],
        output: {
          exports: "named",
          globals: {
            "@dzangolab/fastify-config": "DzangolabFastifyConfig",
            "@dzangolab/fastify-slonik": "DzangolabFastifySlonik",
            fastify: "Fastify",
            "fastify-plugin": "FastifyPlugin",
            graphql: "Graphql",
          },
        },
      },
      target: "es2022",
    },
  };
});

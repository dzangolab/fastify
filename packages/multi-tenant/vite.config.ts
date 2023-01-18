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
        fileName: "dzangolab-fastify-multi-tenant",
        name: "DzangolabFastifyMultiTenant",
      },
      rollupOptions: {
        external: [
          "@dzangolab/fastify-config",
          "@dzangolab/fastify-slonik",
          "@dzangolab/postgres-migrations",
          "fastify",
          "fastify-plugin",
          "pg",
          "slonik",
        ],
        output: {
          exports: "named",
          globals: {
            "@dzangolab/fastify-config": "DzangolabFastifyConfig",
            "@dzangolab/fastify-slonik": "DzangolabFastifySlonik",
            "@dzangolab/postgres-migrations": "DzangolabPostgresMigrations",
            fastify: "Fastify",
            "fastify-plugin": "FastifyPlugin",
            pg: "Pg",
            slonik: "Slonik",
          },
        },
      },
      target: "es2022",
    },
  };
});

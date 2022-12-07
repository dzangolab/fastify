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
        fileName: "dzangolab-fastify-slonik",
        name: "DzangolabFastifySlonik",
      },
      rollupOptions: {
        external: [
          "@dzangolab/fastify-config",
          "fastify",
          "fastify-plugin",
          "slonik",
        ],
        output: {
          exports: "named",
          globals: {
            "@dzangolab/fastify-config": "DzangolabFastifyConfig",
            fastify: "Fastify",
            "fastify-plugin": "FastifyPlugin",
            slonik: "Slonik",
          },
        },
      },
      target: "es2022",
    },
  };
});

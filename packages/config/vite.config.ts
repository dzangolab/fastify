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
        fileName: (format) => `dzangolab-fastify-config.${format}.js`,
        formats: ["es", "cjs"],
        name: "DzangolabFastifyConfig",
      },
      rollupOptions: {
        external: ["fastify", "fastify-plugin"],
        output: {
          exports: "named",
          globals: {
            fastify: "Fastify",
            "fastify-plugin": "FastifyPlugin",
          },
        },
      },
      target: "es2022",
    },
  };
});

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
        fileName: "dzangolab-fastify-user",
        name: "DzangolabFastifyUser",
      },
      rollupOptions: {
        external: [
          "@dzangolab/fastify-config",
          "@dzangolab/fastify-mercurius",
          "@dzangolab/fastify-slonik",
          "fastify",
          "fastify-plugin",
          "mercurius",
          "slonik",
          "supertokens-node",
        ],
        output: {
          exports: "named",
          globals: {
            "@dzangolab/fastify-config": "DzangolabFastifyConfig",
            "@dzangolab/fastify-mercurius": "DzangolabFastifyConfig",
            "@dzangolab/fastify-slonik": "DzangolabFastifySlonik",
            fastify: "Fastify",
            "fastify-plugin": "FastifyPlugin",
            mercurius: "Mercurius",
            slonik: "Slonik",
            "supertokens-node": "SupertokensNode",
          },
        },
      },
      target: "es2022",
    },
  };
});

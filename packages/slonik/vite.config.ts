import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, loadEnv } from "vite";

import { dependencies, peerDependencies } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    build: {
      lib: {
        entry: resolve(dirname(fileURLToPath(import.meta.url)), "src/index.ts"),
        fileName: "prefabs-tech-fastify-slonik",
        name: "PrefabsTechFastifySlonik",
      },
      rollupOptions: {
        external: [
          ...Object.keys(dependencies),
          ...Object.keys(peerDependencies),
        ],
        output: {
          exports: "named",
          globals: {
            "@prefabs.tech/fastify-config": "PrefabsTechFastifyConfig",
            "@prefabs.tech/postgres-migrations":
              "PrefabsTechPostgresMigrations",
            fastify: "Fastify",
            "fastify-plugin": "FastifyPlugin",
            humps: "Humps",
            pg: "Pg",
            slonik: "Slonik",
            "slonik-interceptor-query-logging": "SlonikInterceptorQueryLogging",
            zod: "Zod",
          },
        },
      },
      target: "es2022",
    },
    resolve: {
      alias: {
        "@/": new URL("src/", import.meta.url).pathname,
      },
    },
    test: {
      coverage: {
        provider: "istanbul",
        reporter: ["text", "json", "html"],
      },
    },
  };
});

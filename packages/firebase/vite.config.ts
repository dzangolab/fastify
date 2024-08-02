import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, loadEnv } from "vite";

import { peerDependencies } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    build: {
      lib: {
        entry: resolve(dirname(fileURLToPath(import.meta.url)), "src/index.ts"),
        fileName: "dzangolab-fastify-firebase",
        name: "DzangolabFastifyFirebase",
      },
      rollupOptions: {
        external: Object.keys(peerDependencies),
        output: {
          exports: "named",
          globals: {
            "@dzangolab/fastify-slonik": "DzangolabFastifySlonik",
            "@dzangolab/fastify-graphql": "DzangolabFastifyGraphql",
            fastify: "Fastify",
            "fastify-plugin": "FastifyPlugin",
            "firebase-admin": "FirebaseAdmin",
            mercurius: "mercurius",
            slonik: "Slonik",
            zod: "zod",
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

import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { dependencies, peerDependencies } from "./package.json";

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
          ...Object.keys(dependencies),
          ...Object.keys(peerDependencies),
          "node:fs",
          /supertokens-node+/,
        ],
        output: {
          exports: "named",
          globals: {
            "@dzangolab/fastify-config": "DzangolabFastifyConfig",
            "@dzangolab/fastify-mercurius": "DzangolabFastifyMercurius",
            "@dzangolab/fastify-slonik": "DzangolabFastifySlonik",
            "@dzangolab/postgres-migrations": "DzangolabPostgresMigrations",
            fastify: "Fastify",
            "fastify-plugin": "FastifyPlugin",
            "@dzangolab/fastify-user": "DzangolabFastifyUser",
            humps: "Humps",
            mercurius: "Mercurius",
            "lodash.merge": "LodashMerge",
            "node:fs": "NodeFs",
            pg: "Pg",
            slonik: "Slonik",
            "supertokens-node": "SupertokensNode",
            "supertokens-node/framework/fastify": "SupertokensFastify",
            "supertokens-node/recipe/session/framework/fastify":
              "SupertokensSessionFastify",
            "supertokens-node/recipe/session": "SupertokensSession",
            "supertokens-node/recipe/thirdpartyemailpassword":
              "SupertokensThirdPartyEmailPassword",
            "supertokens-node/recipe/userroles": "SupertokensUserRoles",
            zod: "Zod",
          },
        },
      },
      target: "es2022",
    },
    plugins: [tsconfigPaths()],
    /*
    resolve: {
      alias: {
        "@/": new URL("src/", import.meta.url).pathname,
      },
    },
    */
    test: {
      coverage: {
        provider: "istanbul",
        reporter: ["text", "json", "html"],
      },
    },
  };
});

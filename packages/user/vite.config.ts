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
        fileName: "dzangolab-fastify-user",
        name: "DzangolabFastifyUser",
      },
      rollupOptions: {
        external: [...Object.keys(peerDependencies), /supertokens-node+/],
        output: {
          exports: "named",
          globals: {
            "@dzangolab/fastify-config": "DzangolabFastifyConfig",
            "@dzangolab/fastify-mercurius": "DzangolabFastifyMercurius",
            "@dzangolab/fastify-mailer": "DzangolabFastifyMailer",
            "@dzangolab/fastify-slonik": "DzangolabFastifySlonik",
            "@fastify/cors": "FastifyCors",
            "@fastify/formbody": "FastifyFormbody",
            fastify: "Fastify",
            "fastify-plugin": "FastifyPlugin",
            mercurius: "Mercurius",
            "mercurius-auth": "MercuriusAuth",
            slonik: "Slonik",
            "supertokens-node": "SupertokensNode",
            "supertokens-node/framework/fastify": "SupertokensFastify",
            "supertokens-node/recipe/session/framework/fastify":
              "SupertokensSessionFastify",
            "supertokens-node/recipe/session": "SupertokensSession",
            "supertokens-node/recipe/thirdpartyemailpassword":
              "SupertokensThirdPartyEmailPassword",
            "supertokens-node/recipe/userroles": "SupertokensUserRoles",
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

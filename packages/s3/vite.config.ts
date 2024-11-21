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
        fileName: "dzangolab-fastify-s3",
        name: "DzangolabFastifyS3",
      },
      rollupOptions: {
        external: [
          ...Object.keys(dependencies),
          ...Object.keys(peerDependencies),
          /supertokens-node+/,
        ],
        output: {
          exports: "named",
          globals: {
            "@aws-sdk/client-s3": "AWSClientS3",
            "@aws-sdk/lib-storage": "AWSLibStorage",
            "@aws-sdk/s3-request-presigner": "AWSS3RequestPresigner",
            "@dzangolab/fastify-config": "DzangolabFastifyConfig",
            "@dzangolab/fastify-graphql": "DzangolabFastifyGraphql",
            "@dzangolab/fastify-slonik": "DzangolabFastifySlonik",
            "@fastify/cors": "FastifyCors",
            "@fastify/formbody": "FastifyFormbody",
            "@fastify/multipart": "FastifyMultipart",
            busboy: "Busboy",
            fastify: "Fastify",
            "fastify-plugin": "FastifyPlugin",
            "graphql-upload-minimal": "graphqlUploadMinimal",
            slonik: "Slonik",
            zod: "zod",
            uuid: "uuid",
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

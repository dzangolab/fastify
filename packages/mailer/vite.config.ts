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
        fileName: "dzangolab-fastify-mailer",
        name: "DzangolabFastifyMailer",
      },
      rollupOptions: {
        external: [
          "@dzangolab/fastify-config",
          "fastify",
          "fastify-plugin",
          "html-minifier",
          "html-to-text",
          "mjml",
          "mustache",
          "nodemailer",
          "nodemailer-html-to-text",
          "nodemailer-mjml",
        ],
        output: {
          exports: "named",
          globals: {
            "@dzangolab/fastify-config": "DzangolabFastifyConfig",
            fastify: "Fastify",
            "fastify-plugin": "FastifyPlugin",
            "html-minifier": "HtmlMinifier",
            "html-to-text": "HtmlToText",
            mjml: "Mjml",
            mustache: "Mustache",
            nodemailer: "Nodemailer",
            "nodemailer-html-to-text": "NodemailerHtmlToText",
            "nodemailer-mjml": "NodemailerMml",
          },
        },
      },
      target: "es2022",
    },
  };
});

module.exports = {
  appName: "@dzangolab/fastify",
  buildCommand: ({ isYarn, version }) => {
    return "pnpm build";
  },
  installCommand: ({ isYarn }) => {
    return "pnpm -r install";
  },
  monorepo: {
    mainVersionFile: "package.json",
    packagesToBump: ["packages/*", "tools/*"],
    packagesToPublish: ["packages/*"],
  },
  publishCommand: ({ isYarn, tag, defaultCommand, dir }) => {
    return "pnpm publish --access public --tag 0.3";
  },
  shouldPrepare: ({ releaseType, commitNumbersPerType }) => {
    return true;
  },
};

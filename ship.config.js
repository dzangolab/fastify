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
    packagesToBump: ["packages/*", "tools/*", "!packages/mercurius"],
    packagesToPublish: ["packages/*", "!packages/mercurius"],
  },
  publishCommand: ({ isYarn, tag, defaultCommand, dir }) => {
    return "pnpm publish --access public";
  },
};

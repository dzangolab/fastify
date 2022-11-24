module.exports = {
  buildCommand: ({ isYarn, version }) => {
    return "pnpm build";
  },
  installCommand: ({ isYarn }) => {
    return "pnpm -r install";
  },
  publishCommand: ({ isYarn, tag, defaultCommand, dir }) => {
    return "pnpm publish --access public";
  },
  monorepo: {
    mainVersionFile: "package.json",
    packagesToBump: ["packages/*", "tools/*"],
    packagesToPublish: ["packages/*"],
  }
};

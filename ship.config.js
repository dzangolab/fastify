module.exports = {
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
  }
};

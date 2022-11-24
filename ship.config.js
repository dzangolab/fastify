module.exports = {
  buildCommand: "pnpm build",
  installCommand: "pnpm -r install",
  monorepo: {
    mainVersionFile: "package.json",
    packagesToBump: ["packages/*", "tools/*"],
    packagesToPublish: ["packages/*"],
  }
};

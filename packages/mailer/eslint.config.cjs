const configCustom = require("eslint-config-custom");

module.exports = [
  ...configCustom,
  {
    files: [".js", ".cjs", ".mjs", ".ts", ".cts", ".mts"],
    extends: ["eslint:recommended"],
  },
  {
    ignores: ["**/*.log*", "coverage", "dist", "node_modules", "eslint.config.cjs"],
  },
];

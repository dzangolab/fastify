const configCustom = require("eslint-config-custom");

module.exports = [
  ...configCustom,
  {
    ignores: ["**/*.log*", "coverage", "dist", "node_modules", "eslint.config.cjs"],
  },
];

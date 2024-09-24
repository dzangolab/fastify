const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const importPlugin =  require("eslint-plugin-import");
const tsParser = require("@typescript-eslint/parser");
const globals = require("globals");
const nodePlugin = require("eslint-plugin-n")

module.exports = [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "module" } },
  { languageOptions: { globals: globals.browser } },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    ignores: ['eslint.config.mjs', '**/exports-unused.ts'],
  },
  {
    rules: {
      "import/namespace": "off", // this is having some issue
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
        },
      ],

    },
  },
  nodePlugin.configs["flat/recommended-script"],
  {
    rules: {
      "n/exports-style": ["error", "module.exports"]
    }
  }
];

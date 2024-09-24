const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const importPlugin =  require("eslint-plugin-import");
const tsParser = require("@typescript-eslint/parser");
const globals = require("globals");
const nodePlugin = require("eslint-plugin-n");
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const pluginPromise = require('eslint-plugin-promise');
const eslintPluginUnicorn = require('eslint-plugin-unicorn');


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
      "import/namespace": "off",
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
      "n/no-missing-import": "off", 
    }
  },
  eslintPluginPrettierRecommended,
  pluginPromise.configs['flat/recommended'],
  {
    languageOptions: {
      globals: globals.builtin,
    },
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    rules: {
    "unicorn/filename-case": [
      "error",
      {
        cases: {
          camelCase: true,
          snakeCase: true,
        },
      },
    ],
    "unicorn/import-style": [
      "error",
      {
        styles: {
          "node:path": {
            named: true,
          },
        },
      },
    ],
    "unicorn/numeric-separators-style": [
      "error",
      {
        number: {
          minimumDigits: 6,
          groupLength: 3,
        },
      },
    ],
    "unicorn/prefer-structured-clone": "off",
    "unicorn/prevent-abbreviations": [
      "error",
      {
        allowList: {
          db: true,
          docs: true,
          env: true,
          err: true,
          i: true,
          param: true,
          req: true,
          res: true,
        },
      },
    ],
    }
  },
];

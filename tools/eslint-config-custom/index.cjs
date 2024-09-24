const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const importPlugin =  require("eslint-plugin-import");
const globals = require("globals");
const nodePlugin = require("eslint-plugin-n");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const promisePlugin = require("eslint-plugin-promise");
const unicornPlugin = require("eslint-plugin-unicorn");

module.exports = [
  {
    languageOptions: {
      globals: {...globals.node, ...globals.builtin},
      parserOptions: {
        ecmaVersion: "latest",
        //sourceType: "module",
      },
    },
    rules: {
      curly: ["error", "all"],
      "brace-style": ["error", "1tbs"],
    }
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
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
      "n/no-unpublished-import": [
        "error",
        {
          allowModules: ["@faker-js/faker", "mercurius-codegen", "query-string"],
        },
      ],
      "n/no-unsupported-features/es-syntax": ["error", { ignores: ["modules"] }],
    }
  },
  eslintPluginPrettierRecommended,
  {
    rules: {
      "prettier/prettier": "error",
    },
  },
  promisePlugin.configs["flat/recommended"],
  {
    plugins: {
      unicorn: unicornPlugin,
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

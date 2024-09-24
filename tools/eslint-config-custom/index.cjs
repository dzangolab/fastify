const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const importPlugin = require("eslint-plugin-import");
const globals = require("globals");
const nodePlugin = require("eslint-plugin-n");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const promisePlugin = require("eslint-plugin-promise");
const unicornPlugin = require("eslint-plugin-unicorn");
const typescriptEslintParser = require('@typescript-eslint/parser');

module.exports = [
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.builtin },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      parser: typescriptEslintParser,
    },
    rules: {
      curly: ["error", "all"],
      "brace-style": ["error", "1tbs"],
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    rules: {
      // Disable namespace and customize order of imports
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
      // [DU 2024-SEP-24] Issue unresolved: Problem occurs when importing modules locally.
      "n/no-missing-import": "off",
      "n/no-unpublished-import": [
        "error",
        {
          allowModules: ["@faker-js/faker", "mercurius-codegen", "query-string"],
        },
      ],
      "n/no-unsupported-features/es-syntax": ["error", { ignores: ["modules"] }],
    },
  },
  eslintPluginPrettierRecommended,
  {
    rules: {
      "prettier/prettier": "error",
    },
  },
  promisePlugin.configs["flat/recommended"],
  unicornPlugin.configs["flat/recommended"],
  {
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
      // [DU 2024-SEP-10]: Disabled the 'unicorn/prefer-structured-clone' rule, which recommends using 'structuredClone' 
      // instead of 'JSON.parse(JSON.stringify(...))' (see: https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-structured-clone.md).
      // This may cause warnings when using 'JSON.parse(JSON.stringify(data))'. The reason for using this approach is unclear,
      // but it could potentially lead to issues for other developers. Further review is needed to determine if 'structuredClone' should be used instead.
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
    },
  },
  {
    settings: {
      node: {
        tryExtensions: [".js", ".json", ".node", ".ts"],
      },
    },
  },
  {
    ignores: ["**/*.log*", "coverage", "dist", "node_modules", "eslint.config.cjs"],
  },
];

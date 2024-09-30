module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:n/recommended",
    // "plugin:import/recommended",
    // "plugin:import/typescript",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:unicorn/recommended",
    "prettier",
  ],
  overrides: [
    {
      files: "**/*.spec.ts",
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    // "import",
    "n",
    "prettier",
    "promise",
    "unicorn",
  ],
  rules: {
    curly: ["error", "all"],
    "brace-style": ["error", "1tbs"],
    // "import/order": [
    //   "error",
    //   {
    //     alphabetize: {
    //       order: "asc",
    //       caseInsensitive: true,
    //     },
    //     groups: [
    //       "builtin",
    //       "external",
    //       "internal",
    //       ["parent", "sibling"],
    //       "index",
    //       "object",
    //       "type",
    //     ],
    //     "newlines-between": "always",
    //   },
    // ],
    "n/no-unpublished-import": [
      "error",
      {
        allowModules: ["@faker-js/faker", "mercurius-codegen", "query-string"],
      },
    ],
    "n/no-missing-import": "off",
    "n/no-unsupported-features/es-syntax": ["error", { ignores: ["modules"] }],
    "prettier/prettier": "error",
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
  settings: {
    node: {
      tryExtensions: [".js", ".json", ".node", ".ts"],
    },
  },
};

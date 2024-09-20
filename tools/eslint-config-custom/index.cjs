const { fixupConfigRules, fixupPluginRules } = require("@eslint/compat");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const eslintImport = require("eslint-plugin-import");
const n = require("eslint-plugin-n");
const prettier = require("eslint-plugin-prettier");
const promise = require("eslint-plugin-promise");
const unicorn = require("eslint-plugin-unicorn");
const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");
const path = require("node:path");
const { fileURLToPath } = require("node:url");
const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");

const dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = [...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:n/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:unicorn/recommended",
    "prettier",
)), {
    plugins: {
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        import: fixupPluginRules(eslintImport),
        n: fixupPluginRules(n),
        prettier: fixupPluginRules(prettier),
        promise,
        unicorn: fixupPluginRules(unicorn),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
    },

    settings: {
        node: {
            tryExtensions: [".cjs", ".js", ".json", ".node", ".ts"],
        },
    },

    rules: {
        curly: ["error", "all"],
        "brace-style": ["error", "1tbs"],

        "import/order": ["error", {
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
        }],

        "n/no-unpublished-import": ["error", {
            allowModules: ["@faker-js/faker", "mercurius-codegen", "query-string"],
        }],

        "n/no-unsupported-features/es-syntax": ["error", {
            ignores: ["modules"],
        }],

        "prettier/prettier": "error",

        "unicorn/filename-case": ["error", {
            cases: {
                camelCase: true,
                snakeCase: true,
            },
        }],

        "unicorn/import-style": ["error", {
            styles: {
                "node:path": {
                    named: true,
                },
            },
        }],

        "unicorn/numeric-separators-style": ["error", {
            number: {
                minimumDigits: 6,
                groupLength: 3,
            },
        }],

        "unicorn/prefer-structured-clone": "off",

        "unicorn/prevent-abbreviations": ["error", {
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
        }],
    },
}, {
    files: ["**/*.spec.ts"],
}];

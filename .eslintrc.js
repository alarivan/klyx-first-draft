module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["solid", "prettier", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:solid/typescript",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  env: {
    browser: true,
    es2021: true,
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{ts,tsx,js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    "import/order": [
      "error",
      {
        groups: [
          "type",
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
        alphabetize: {
          order:
            "asc" /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
          caseInsensitive: true /* ignore case. Options: [true, false] */,
        },
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
      },
    ],
  },
};

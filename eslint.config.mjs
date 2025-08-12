import js from "@eslint/js";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import eslintPluginImport from "eslint-plugin-import";

const serverTypeChecked = tseslint.configs.recommendedTypeChecked.map((cfg) => ({
  ...cfg,
  files: ["apps/server/**/*.{ts,tsx}"],
}));

const clientRecommended = tseslint.configs.recommended.map((cfg) => ({
  ...cfg,
  files: ["apps/client/**/*.{ts,tsx}"],
}));

export default [
  globalIgnores(["**/dist", "**/node_modules", "**/coverage"]),
  js.configs.recommended,

  // root eslint
  {
    files: ["eslint.config.{js,mjs,cjs,ts}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
      },
    },
  },

  // apps/server
  ...serverTypeChecked,
  {
    files: ["apps/server/**/*.{ts,js}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "commonjs",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: new URL("./apps/server", import.meta.url),
      },
    },
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },

  // apps/client
  ...clientRecommended,
  {
    files: ["apps/client/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...(reactHooks.configs["recommended-latest"]?.rules ?? {}),
      ...(reactRefresh.configs.vite?.rules ?? {}),
    },
  },
];

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

const serverTypeChecked = tseslint.configs.recommendedTypeChecked.map((cfg) => ({
  ...cfg,
  files: ["apps/server/**/*.{ts,tsx}"],
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
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
    },
  },

  // apps/client
  ...tseslint.configs.recommended,
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

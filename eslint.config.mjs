// @ts-check
import { defineConfig } from "eslint/config";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig(
  { ignores: [".astro/", "dist/"] },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    extends: [
      pluginJs.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      {
        languageOptions: {
          parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
          },
        },
        rules: { "@typescript-eslint/no-non-null-assertion": "off" },
      },
    ],
  },
  eslintPluginAstro.configs.recommended,
  eslintPluginAstro.configs["jsx-a11y-strict"],
  eslintConfigPrettier,
);

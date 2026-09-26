// @ts-check

import { version as tsVersion } from "typescript";

/** @type {import("prettier").Config & import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
export default {
  plugins: [
    "prettier-plugin-astro",
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "^astro:",
    "^astro(/.+)?$",
    "^@astrojs/",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/",
    "",
    "^\\.+/",
  ],
  importOrderTypeScriptVersion: tsVersion,
  overrides: [
    {
      files: ["tsconfig.json", "tsconfig.*.json"],
      options: { parser: "jsonc" },
    },
    {
      files: "eslint.config.*",
      options: {
        importOrder: [
          "^eslint(/.+)?$",
          "^@eslint/",
          "<THIRD_PARTY_MODULES>",
          "^\\.+/",
        ],
      },
    },
  ],
};

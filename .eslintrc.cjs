/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "plugin:astro/recommended",
    "plugin:astro/jsx-a11y-strict",
    "prettier",
  ],
  rules: { "import/no-unresolved": [2, { ignore: ["^@astrojs/"] }] },
  overrides: [
    {
      // Define the configuration for `.astro` file.
      files: ["*.astro"],
      // Allows Astro components to be parsed.
      parser: "astro-eslint-parser",
      // Parse the script in `.astro` as TypeScript by adding the following configuration.
      // It's the setting you need when using TypeScript.
      parserOptions: {
        parser: "@typescript-eslint/parser",
        project: "tsconfig.json",
        extraFileExtensions: [".astro"],
      },
    },
  ],
};

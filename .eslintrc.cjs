/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "plugin:astro/recommended",
    "plugin:astro/jsx-a11y-strict",
    "plugin:prettier/recommended",
  ],
  overrides: [
    {
      files: ["*.js", "*.[mc]js"],
      extends: [
        "eslint:recommended",
        "airbnb-base",
        "plugin:prettier/recommended",
      ],
      rules: { "import/no-unresolved": [2, { ignore: ["^@astrojs/"] }] },
    },
    {
      // Define the configuration for `.astro` file.
      files: ["*.astro"],
      // Allows Astro components to be parsed.
      parser: "astro-eslint-parser",
      // Parse the script in `.astro` as TypeScript by adding the following configuration.
      // It's the setting you need when using TypeScript.
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
      rules: {
        // override/add rules settings here, such as:
        // "astro/no-set-html-directive": "error"
      },
    },
  ],
};

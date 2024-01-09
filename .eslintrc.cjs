/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "plugin:astro/recommended",
    "plugin:astro/jsx-a11y-strict",
    "plugin:prettier/recommended",
  ],
  settings: { "import/resolver": { typescript: {} } },
  overrides: [
    {
      files: ["*.js", "*.[mc]js"],
      extends: [
        "eslint:recommended",
        "airbnb-base",
        "plugin:prettier/recommended",
      ],
    },
    {
      files: ["*.ts"],
      extends: [
        "eslint:recommended",
        "airbnb-base",
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/stylistic-type-checked",
        "plugin:prettier/recommended",
      ],
      parserOptions: { project: "tsconfig.json" },
      rules: { "import/prefer-default-export": 0 },
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

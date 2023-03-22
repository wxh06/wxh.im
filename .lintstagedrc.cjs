const eslint = "eslint --fix";
const prettier = "prettier --write";

module.exports = {
  "*.{astro,js,mjs,cjs,ts}": [prettier, eslint],
  "*.{md,html,json,yml,yaml}": prettier,
};

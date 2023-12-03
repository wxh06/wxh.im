const eslint = "eslint --fix";
const prettier = "prettier --write";
const prettierCheck = "prettier --check";

module.exports = {
  "*.{js,mjs,cjs,ts,astro}": [eslint, prettierCheck],
  "*.{md,mdx,html,css,json,yml,yaml}": prettier,
};

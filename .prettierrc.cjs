/** @type {import('prettier').Config} */
module.exports = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  printWidth: 120,
  jsxSingleQuote: false,
  plugins: [
    require.resolve("prettier-plugin-tailwindcss"), // MUST come last
  ],
  tailwindConfig: "./tailwind.config.js",
};

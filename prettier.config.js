module.exports = {
  singleQuote: false,
  arrowParens: "always",
  trailingComma: "none",
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  endOfLine: "auto",
  overrides: [
    {
      files: "*.scss",
      options: {
        tabWidth: 4
      }
    }
  ]
};

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "max-len": "off",
    "require-jsdoc": "off",
    "valid-jsdoc": "off",
    "require-await": "off",
    "linebreak-style": "off",
    "indent": "off",
    "new-cap": "off",
    "quote-props": "off",
    quotes: ["error", "double"],
  },
};

const reactNativeConfig = require("@react-native/eslint-config/flat");

module.exports = [
  ...reactNativeConfig,
  {
    // The config's Flow rules for .js files call ESLint APIs that ESLint 9 removed and crash. All app code is TypeScript.
    ignores: ["**/*.js", "android/**", "node_modules/**"],
  },
];

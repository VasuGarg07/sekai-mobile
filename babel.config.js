module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    // Must come first: the compiler needs the original source.
    ["babel-plugin-react-compiler", {}],
    [
      "module-resolver",
      {
        root: ["."],
        alias: {
          "^@/assets/(.+)": "./assets/\\1",
          "^@/(.+)": "./src/\\1",
        },
      },
    ],
    // Must stay last (Reanimated 4 / react-native-worklets requirement).
    "react-native-worklets/plugin",
  ],
};

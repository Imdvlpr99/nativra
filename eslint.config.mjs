import baseConfig from "./packages/config/eslint.js";

export default [
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/coverage/**",
      "**/.turbo/**",
      "apps/native-preview/**",
      "examples/**",
      "registry/**",
    ],
  },
  ...baseConfig,
];

